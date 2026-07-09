"""
NIRIKSH ML Training Pipeline
======================================
Trains ensemble models for engine health prediction,
thrust estimation, and TSFC estimation.

Models trained:
  - Health (CompressorHealth, CombustorHealth, TurbineHealth, OverallHealth):
      RandomForest, XGBoost  (best selected by RMSE)
  - Performance (Thrust_N, TSFC_g_N_s):
      XGBoost, LightGBM (if installed)  (best selected by RMSE)

Input:
  datasets/raw/turbojet_complete_dataset.csv

Output:
  models/saved/{target}_model.pkl       -- trained model artifacts
  models/pipelines/feature_metadata.pkl -- feature list for inference
  models/pipelines/training_report.txt  -- metrics summary
"""

from __future__ import annotations

import logging
import sys
from pathlib import Path
from typing import Any, Dict, List, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split

import xgboost as xgb

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
BASE_DIR = Path(__file__).resolve().parents[2]
DATASET_DIR = BASE_DIR / "datasets" / "raw"
MODEL_DIR = BASE_DIR / "models" / "saved"
PIPELINE_DIR = BASE_DIR / "models" / "pipelines"

DATASET_FILE = DATASET_DIR / "turbojet_complete_dataset.csv"

# Ensure output directories exist
MODEL_DIR.mkdir(parents=True, exist_ok=True)
PIPELINE_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Backend imports (compatibility with existing feature pipeline)
# ---------------------------------------------------------------------------
sys.path.append(str(BASE_DIR / "backend"))

from utils.features import (
    FEATURE_COLUMNS,
    HEALTH_TARGETS,
    PERFORMANCE_TARGETS,
    create_features,
)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("niriksh-train")

# Unicode-safe symbols for console output
CHECK = "\u2713"  # ✓
R2_SYMBOL = "R\u00b2"  # R²

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
RANDOM_STATE = 42
TEST_SIZE = 0.20

# Health-model hyperparameters
RF_HEALTH_PARAMS: Dict[str, Any] = {
    "n_estimators": 200,
    "max_depth": 20,
    "min_samples_leaf": 5,
    "n_jobs": -1,
    "random_state": RANDOM_STATE,
}

XGB_HEALTH_PARAMS: Dict[str, Any] = {
    "n_estimators": 200,
    "max_depth": 8,
    "learning_rate": 0.05,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "random_state": RANDOM_STATE,
    "verbosity": 0,
}

# Performance-model hyperparameters
XGB_PERF_PARAMS: Dict[str, Any] = {
    "n_estimators": 300,
    "max_depth": 10,
    "learning_rate": 0.03,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "random_state": RANDOM_STATE,
    "verbosity": 0,
}

LGBM_PERF_PARAMS: Dict[str, Any] = {
    "n_estimators": 300,
    "max_depth": -1,
    "learning_rate": 0.03,
    "subsample": 0.8,
    "colsample_bytree": 0.8,
    "random_state": RANDOM_STATE,
    "verbosity": -1,
}


# ===================================================================
#  Data Loading
# ===================================================================
def load_single_dataset(path: Path) -> pd.DataFrame:
    """Load the single turbojet complete dataset CSV."""
    if not path.exists():
        raise FileNotFoundError(
            f"Dataset not found at: {path}\n"
            f"Please place 'turbojet_complete_dataset.csv' in {DATASET_DIR}"
        )
    log.info("Loading dataset: %s", path)
    df = pd.read_csv(path)
    log.info("Loaded %s rows x %s columns", len(df), len(df.columns))
    return df


# ===================================================================
#  Data Preparation
# ===================================================================
def prepare_data(df: pd.DataFrame) -> pd.DataFrame:
    """Apply feature engineering and fill missing numeric values."""
    log.info("Starting feature engineering (%s features)", len(FEATURE_COLUMNS))
    df_feat = create_features(df)

    # Fill only numeric columns with median (avoid categorical/object leaks)
    numeric_cols = df_feat.select_dtypes(include=[np.number]).columns
    median_series = df_feat[numeric_cols].median()
    df_feat[numeric_cols] = df_feat[numeric_cols].fillna(median_series)

    log.info(
        "Feature engineering complete. Shape: %s rows x %s cols",
        len(df_feat),
        len(df_feat.columns),
    )
    return df_feat


def validate_targets(df: pd.DataFrame) -> None:
    """Ensure all required target columns exist in the dataframe."""
    all_targets = list(HEALTH_TARGETS) + list(PERFORMANCE_TARGETS)
    missing = [c for c in all_targets if c not in df.columns]
    if missing:
        raise KeyError(
            f"Missing target columns in dataset: {missing}\n"
            f"Ensure '{DATASET_FILE.name}' contains all expected columns."
        )
    log.info("All %s target columns present in dataset", len(all_targets))


def validate_features(df: pd.DataFrame) -> None:
    """Ensure all required feature columns exist after engineering."""
    missing = [c for c in FEATURE_COLUMNS if c not in df.columns]
    if missing:
        raise KeyError(
            f"Missing feature columns after create_features(): {missing}"
        )
    log.info("All %s feature columns present after engineering", len(FEATURE_COLUMNS))


# ===================================================================
#  Training Helpers
# ===================================================================
def _compute_metrics(
    y_true: np.ndarray,
    y_pred: np.ndarray,
) -> Dict[str, float]:
    """Return standard regression metrics as a dict."""
    return {
        "rmse": float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "r2": float(r2_score(y_true, y_pred)),
        "mae": float(mean_absolute_error(y_true, y_pred)),
    }


def _model_filename(target: str, is_performance: bool = False) -> str:
    """Return the model filename expected by backend/inference.py.

    Health models:   {target}_model.pkl          (e.g. CompressorHealth_model.pkl)
    Performance:     {stripped}_model.pkl         (e.g. ThrustN_model.pkl, TSFCgNs_model.pkl)
    """
    if is_performance:
        stripped = target.replace("_", "").replace(".", "")
        return f"{stripped}_model.pkl"
    return f"{target}_model.pkl"


def _log_metrics(
    model_name: str,
    metrics: Dict[str, float],
    prefix: str = "",
) -> None:
    """Log a single model's metrics on one line."""
    log.info(
        "%s  %-12s  RMSE: %8.4f   %s: %7.4f   MAE: %8.4f",
        prefix,
        model_name,
        metrics["rmse"],
        R2_SYMBOL,
        metrics["r2"],
        metrics["mae"],
    )


# ===================================================================
#  Health Model Training (RF + XGBoost)
# ===================================================================
def train_health_models(df: pd.DataFrame) -> Dict[str, Dict[str, Any]]:
    """Train RandomForest and XGBoost for each health target.

    Returns a dict keyed by target name, with best-model metadata.
    """
    X = df[FEATURE_COLUMNS]
    results: Dict[str, Dict[str, Any]] = {}

    for target in HEALTH_TARGETS:
        log.info("=" * 60)
        log.info("Training health models for: %s", target)
        log.info("=" * 60)

        y = df[target]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
        )
        log.info(
            "Train: %s samples | Test: %s samples", len(X_train), len(X_test)
        )

        # ---- Random Forest ----
        rf = RandomForestRegressor(**RF_HEALTH_PARAMS)
        rf.fit(X_train, y_train)
        rf_metrics = _compute_metrics(y_test, rf.predict(X_test))
        _log_metrics("RandomForest", rf_metrics, prefix="  ")

        # ---- XGBoost ----
        xg = xgb.XGBRegressor(**XGB_HEALTH_PARAMS)
        xg.fit(X_train, y_train)
        xg_metrics = _compute_metrics(y_test, xg.predict(X_test))
        _log_metrics("XGBoost", xg_metrics, prefix="  ")

        # ---- Select best (lower RMSE wins) ----
        if xg_metrics["rmse"] <= rf_metrics["rmse"]:
            best_model = xg
            best_name = "XGBoost"
            best_metrics = xg_metrics
        else:
            best_model = rf
            best_name = "RandomForest"
            best_metrics = rf_metrics

        # Save
        filename = _model_filename(target, is_performance=False)
        model_path = MODEL_DIR / filename
        joblib.dump(best_model, model_path)

        log.info(
            "  %s Selected %s  ->  %s",
            CHECK,
            best_name,
            model_path,
        )

        results[target] = {
            "model": best_name,
            "rmse": best_metrics["rmse"],
            "r2": best_metrics["r2"],
            "mae": best_metrics["mae"],
        }

    return results


# ===================================================================
#  Performance Model Training (XGBoost + LightGBM optional)
# ===================================================================
def train_performance_models(df: pd.DataFrame) -> Dict[str, Dict[str, Any]]:
    """Train XGBoost and optionally LightGBM for each performance target.

    Returns a dict keyed by target name, with best-model metadata.
    """
    X = df[FEATURE_COLUMNS]
    results: Dict[str, Dict[str, Any]] = {}

    for target in PERFORMANCE_TARGETS:
        log.info("=" * 60)
        log.info("Training performance models for: %s", target)
        log.info("=" * 60)

        y = df[target]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=TEST_SIZE, random_state=RANDOM_STATE
        )
        log.info(
            "Train: %s samples | Test: %s samples", len(X_train), len(X_test)
        )

        # ---- XGBoost ----
        xg = xgb.XGBRegressor(**XGB_PERF_PARAMS)
        xg.fit(X_train, y_train)
        xg_metrics = _compute_metrics(y_test, xg.predict(X_test))
        _log_metrics("XGBoost", xg_metrics, prefix="  ")

        # Default best is XGBoost
        best_model = xg
        best_name = "XGBoost"
        best_metrics = xg_metrics

        # ---- LightGBM (optional) ----
        lgb_available = False
        try:
            import lightgbm as lgb  # type: ignore

            lgb_available = True
        except ImportError:
            log.info("  LightGBM not installed — skipping")

        if lgb_available:
            lg = lgb.LGBMRegressor(**LGBM_PERF_PARAMS)
            lg.fit(X_train, y_train)
            lg_metrics = _compute_metrics(y_test, lg.predict(X_test))
            _log_metrics("LightGBM", lg_metrics, prefix="  ")

            if lg_metrics["rmse"] <= xg_metrics["rmse"]:
                best_model = lg
                best_name = "LightGBM"
                best_metrics = lg_metrics

        # Save
        filename = _model_filename(target, is_performance=True)
        model_path = MODEL_DIR / filename
        joblib.dump(best_model, model_path)

        log.info(
            "  %s Selected %s  ->  %s",
            CHECK,
            best_name,
            model_path,
        )

        results[target] = {
            "model": best_name,
            "rmse": best_metrics["rmse"],
            "r2": best_metrics["r2"],
            "mae": best_metrics["mae"],
        }

    return results


# ===================================================================
#  Artifact Persistence
# ===================================================================
def save_feature_metadata() -> None:
    """Save feature column list and target names for inference."""
    metadata = {
        "features": FEATURE_COLUMNS,
        "health_targets": HEALTH_TARGETS,
        "performance_targets": PERFORMANCE_TARGETS,
        "n_features": len(FEATURE_COLUMNS),
    }
    path = PIPELINE_DIR / "feature_metadata.pkl"
    joblib.dump(metadata, path)
    log.info(
        "%s Feature metadata saved to %s (%s features)",
        CHECK,
        path,
        len(FEATURE_COLUMNS),
    )


def save_training_report(
    health_results: Dict[str, Dict[str, Any]],
    perf_results: Dict[str, Dict[str, Any]],
) -> None:
    """Generate a UTF-8-safe text report with all training metrics."""
    lines: List[str] = []

    def emit(text: str = "") -> None:
        lines.append(text)

    emit("=" * 62)
    emit("  NIRIKSH MODEL TRAINING REPORT")
    emit("=" * 62)
    emit()

    emit("HEALTH PREDICTION MODELS")
    emit("-" * 42)
    for target, m in health_results.items():
        emit(f"  {target}:")
        emit(f"    Model (best) : {m['model']}")
        emit(f"    RMSE         : {m['rmse']:.6f}")
        emit(f"    R{chr(0xb2)}            : {m['r2']:.6f}")
        emit(f"    MAE          : {m['mae']:.6f}")
        emit()

    emit("PERFORMANCE PREDICTION MODELS")
    emit("-" * 42)
    for target, m in perf_results.items():
        emit(f"  {target}:")
        emit(f"    Model (best) : {m['model']}")
        emit(f"    RMSE         : {m['rmse']:.6f}")
        emit(f"    R{chr(0xb2)}            : {m['r2']:.6f}")
        emit(f"    MAE          : {m['mae']:.6f}")
        emit()

    emit(f"Total features used  : {len(FEATURE_COLUMNS)}")
    emit(f"Models saved to      : {MODEL_DIR}")
    emit("=" * 62)

    report_str = "\n".join(lines)
    path = PIPELINE_DIR / "training_report.txt"
    path.write_text(report_str, encoding="utf-8")

    log.info("%s Training report saved to %s", CHECK, path)
    # Also print the full report to console
    print("\n" + report_str + "\n")


# ===================================================================
#  Main Entry Point
# ===================================================================
def main() -> None:
    """Execute the full training pipeline end-to-end."""
    log.info("=" * 60)
    log.info("  NIRIKSH ML Training Pipeline  v2.1.0")
    log.info("=" * 60)

    # 1. Load dataset
    df_raw = load_single_dataset(DATASET_FILE)

    # 2. Feature engineering
    df = prepare_data(df_raw)

    # 3. Validate schema
    validate_targets(df)
    validate_features(df)

    # 4. Train health models
    health_results = train_health_models(df)

    # 5. Train performance models
    perf_results = train_performance_models(df)

    # 6. Save artifacts
    save_feature_metadata()
    save_training_report(health_results, perf_results)

    log.info(
        "%s Pipeline complete. All models saved to %s",
        CHECK,
        MODEL_DIR,
    )


if __name__ == "__main__":
    main()
