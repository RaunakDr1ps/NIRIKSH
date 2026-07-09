"""
NIRIKSH Model Evaluation Script
Evaluates trained models and generates performance visualizations.
"""
from pathlib import Path

import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt

BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_DIR = BASE_DIR / "models" / "saved"
PIPELINE_DIR = BASE_DIR / "models" / "pipelines"
OUTPUT_DIR = BASE_DIR / "ml" / "evaluation"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

plt.style.use("dark_background")
plt.rcParams["figure.facecolor"] = "#0a0e17"
plt.rcParams["axes.facecolor"] = "#0f1524"
plt.rcParams["axes.edgecolor"] = "#1a2540"
plt.rcParams["axes.labelcolor"] = "#9ca3af"
plt.rcParams["text.color"] = "#e5e7eb"
plt.rcParams["xtick.color"] = "#6b7280"
plt.rcParams["ytick.color"] = "#6b7280"
plt.rcParams["grid.color"] = "#1a2540"
plt.rcParams["legend.facecolor"] = "#0f1524"
plt.rcParams["legend.edgecolor"] = "#1a2540"


def load_models():
    models = {}
    for model_path in MODEL_DIR.glob("*.pkl"):
        target = model_path.stem.replace("_model", "")
        models[target] = joblib.load(model_path)
        print(f"  Loaded: {model_path.name}")
    return models


def plot_feature_importance(models: dict):
    for target, model in models.items():
        if hasattr(model, "feature_importances_"):
            importances = model.feature_importances_
            metadata = joblib.load(PIPELINE_DIR / "feature_metadata.pkl")
            features = metadata["features"]

            indices = np.argsort(importances)[::-1][:15]

            fig, ax = plt.subplots(figsize=(10, 6))
            ax.barh(
                range(len(indices)),
                importances[indices],
                color="#00d4ff",
                alpha=0.8,
            )
            ax.set_yticks(range(len(indices)))
            ax.set_yticklabels([features[i] for i in indices])
            ax.set_xlabel("Importance")
            ax.set_title(f"Top 15 Features — {target}", color="#e5e7eb")

            plt.tight_layout()
            path = OUTPUT_DIR / f"feature_importance_{target}.png"
            fig.savefig(path, dpi=150, bbox_inches="tight")
            plt.close()
            print(f"  Saved: {path.name}")


def generate_summary():
    report_path = PIPELINE_DIR / "training_report.txt"
    if report_path.exists():
        print("\n" + report_path.read_text())


def main():
    print("=" * 60)
    print("  NIRIKSH Model Evaluation")
    print("=" * 60)

    print("\n[1/3] Loading trained models...")
    models = load_models()

    print("\n[2/3] Generating feature importance plots...")
    plot_feature_importance(models)

    print("\n[3/3] Training summary:")
    generate_summary()

    print(f"\n[DONE] Evaluation complete. Outputs saved to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
