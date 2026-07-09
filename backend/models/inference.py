"""
NIRIKSH Model Inference Service
Loads trained models and provides prediction API.
"""
from typing import Optional, Dict, Any

import numpy as np
import pandas as pd
import joblib

from config import settings


class ModelInference:
    """Loads and runs inference using trained ML models."""

    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.metadata: Optional[dict] = None
        self._loaded = False
        self.best_model: Optional[Any] = None
        self._best_model_loaded = False

    def load_models(self):
        """Load all trained models and feature metadata."""
        if not settings.model_dir.exists():
            print(f"[WARN] Model directory not found: {settings.model_dir}", flush=True)
            return

        # Load metadata
        metadata_path = settings.ml_pipeline_dir / "feature_metadata.pkl"
        if metadata_path.exists():
            self.metadata = joblib.load(metadata_path)
            print(f"[INFO] Loaded feature metadata ({len(self.metadata['features'])} features)", flush=True)
        else:
            print("[WARN] Feature metadata not found. Run training pipeline first.", flush=True)
            return

        # Load health models
        for target in ["CompressorHealth", "CombustorHealth", "TurbineHealth", "OverallHealth"]:
            path = settings.model_dir / f"{target}_model.pkl"
            if path.exists():
                self.models[target] = joblib.load(path)
                print(f"[INFO] Loaded model: {target}", flush=True)

        # Load performance models
        for target in ["Thrust_N", "TSFC_g_N_s"]:
            colab_target = target.replace("_", "").replace(".", "")
            path = settings.model_dir / f"{colab_target}_model.pkl"
            if path.exists():
                self.models[target] = joblib.load(path)
                print(f"[INFO] Loaded model: {target}", flush=True)

        self._loaded = True
        print(f"[INFO] {len(self.models)} models loaded", flush=True)

        # Load best_model.joblib (v2 multi-output model)
        self._load_best_model()

    def _load_best_model(self):
        """Load the unified multi-output model trained in notebook 03."""
        path = settings.best_model_path
        if path.exists():
            try:
                self.best_model = joblib.load(path)
                self._best_model_loaded = True
                n_targets = len(self.best_model.estimators_) if hasattr(self.best_model, 'estimators_') else 6
                n_features = self.best_model.estimators_[0].n_features_in_ if hasattr(self.best_model, 'estimators_') else 24
                print(f"[INFO] Loaded best_model.joblib ({n_targets} targets, {n_features} features)", flush=True)
            except Exception as e:
                print(f"[WARN] Failed to load best_model.joblib: {e}", flush=True)
        else:
            print(f"[WARN] best_model.joblib not found at {path}", flush=True)

    def predict_v2(self, features: pd.DataFrame) -> dict:
        """Predict all 6 targets using the unified multi-output model.

        Expects features with the 24 columns defined in FEATURE_COLUMNS_V2,
        in the exact order used during training (alphabetically: raw cols
        first, then engineered cols).

        Returns dict with keys:
            CompressorHealth, CombustorHealth, TurbineHealth, OverallHealth,
            Thrust_N, TSFC_g_N_s
        """
        if not self._best_model_loaded:
            return self._fallback_predict_v2(features)

        X = features.values if hasattr(features, 'values') else features
        pred_2d = self.best_model.predict(X)

        # pred_2d shape: (n_samples, 6)  — order matches training
        if pred_2d.ndim == 1:
            pred_2d = pred_2d.reshape(1, -1)

        row = pred_2d[0]
        return {
            "CompressorHealth": float(np.clip(row[0], 0.0, 1.0)),
            "CombustorHealth":  float(np.clip(row[1], 0.0, 1.0)),
            "TurbineHealth":    float(np.clip(row[2], 0.0, 1.0)),
            "OverallHealth":    float(np.clip(row[3], 0.0, 1.0)),
            "Thrust_N":         float(row[4]),
            "TSFC_g_N_s":       float(row[5]),
        }

    def predict_v2_batch(self, features: pd.DataFrame) -> list[dict]:
        """Batch version of predict_v2."""
        if not self._best_model_loaded:
            results = []
            for i in range(len(features)):
                single = self._fallback_predict_v2(features.iloc[[i]].reset_index(drop=True))
                results.append(single)
            return results

        X = features.values if hasattr(features, 'values') else features
        pred_2d = self.best_model.predict(X)

        results = []
        for i in range(pred_2d.shape[0]):
            row = pred_2d[i]
            results.append({
                "CompressorHealth": float(np.clip(row[0], 0.0, 1.0)),
                "CombustorHealth":  float(np.clip(row[1], 0.0, 1.0)),
                "TurbineHealth":    float(np.clip(row[2], 0.0, 1.0)),
                "OverallHealth":    float(np.clip(row[3], 0.0, 1.0)),
                "Thrust_N":         float(row[4]),
                "TSFC_g_N_s":       float(row[5]),
            })
        return results

    def _fallback_predict_v2(self, features: pd.DataFrame) -> dict:
        """Fallback when best_model.joblib is not available.

        Combines the existing physics-informed health and performance
        fallbacks into a single 6-target dict.
        """
        health = self._fallback_health(features)
        perf = self._fallback_performance(features)
        health.update(perf)
        return health

    def _fallback_health(self, features: pd.DataFrame) -> dict:
        """Physics-informed fallback when ML models aren't available."""
        row = features.iloc[0]
        pr = row.get("P3_Pa", 1e6) / max(row.get("P2_Pa", 1e5), 1)
        tr = row.get("T3_K", 800) / max(row.get("T2_K", 288), 1)
        cycle = row.get("Cycle", 1)

        compressor = float(np.clip(pr / 18 - 0.05 * (cycle / 100), 0.1, 1.0))
        delta_t = row.get("T3_K", 800) - row.get("T2_K", 288)
        combustor = float(np.clip(delta_t / 600 - 0.03 * (cycle / 100), 0.1, 1.0))
        turbine = float(np.clip(compressor * 0.9 - 0.04 * (cycle / 100), 0.1, 1.0))
        overall = float(np.clip(0.35 * compressor + 0.3 * combustor + 0.35 * turbine, 0.1, 1.0))

        return {
            "CompressorHealth": compressor,
            "CombustorHealth": combustor,
            "TurbineHealth": turbine,
            "OverallHealth": overall,
        }

    def _fallback_performance(self, features: pd.DataFrame) -> dict:
        """Physics-informed thrust/TSFC estimation."""
        row = features.iloc[0]
        ff = row.get("FuelFlow_kg_s", 0.5)
        mach = max(row.get("Mach", 0.3), 0.1)
        pr = row.get("P3_Pa", 1e6) / max(row.get("P2_Pa", 1e5), 1)

        thrust = ff * 45000 * 0.25 * (1 + 0.1 * pr) / mach
        thrust = float(np.clip(thrust, 1000, 50000))
        tsfc = float(np.clip((ff * 1000) / max(thrust / 1000, 0.01), 5, 60))

        return {"Thrust_N": thrust, "TSFC_g_N_s": tsfc}


# Singleton
_inference_instance: Optional[ModelInference] = None


def get_inference() -> ModelInference:
    global _inference_instance
    if _inference_instance is None:
        _inference_instance = ModelInference()
        _inference_instance.load_models()
    return _inference_instance
