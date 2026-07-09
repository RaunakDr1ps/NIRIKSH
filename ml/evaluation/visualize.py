"""
NIRIKSH Data Visualization Script
Generates professional aerospace-grade visualizations of engine data.
"""
from pathlib import Path

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec

BASE_DIR = Path(__file__).resolve().parents[2]
DATASET_DIR = BASE_DIR / "datasets" / "raw"
OUTPUT_DIR = BASE_DIR / "ml" / "evaluation"

OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

plt.style.use("dark_background")
plt.rcParams.update({
    "figure.facecolor": "#0a0e17",
    "axes.facecolor": "#0f1524",
    "axes.edgecolor": "#1a2540",
    "axes.labelcolor": "#9ca3af",
    "text.color": "#e5e7eb",
    "xtick.color": "#6b7280",
    "ytick.color": "#6b7280",
    "grid.color": "#1a2540",
    "grid.alpha": 0.5,
    "legend.facecolor": "#0f1524",
    "legend.edgecolor": "#1a2540",
    "font.family": "monospace",
})

HUD_BLUE = "#00d4ff"
HUD_GREEN = "#00ff88"
HUD_AMBER = "#ffb300"
HUD_ORANGE = "#ff6a00"
HUD_RED = "#ff0040"
HUD_CYAN = "#00ffb9"


def load_data() -> pd.DataFrame:
    csv_files = list(DATASET_DIR.glob("*.csv"))
    if not csv_files:
        print("[WARN] No CSV files found. Using synthetic data for demonstration.")
        return _generate_synthetic_data()

    df = pd.concat([pd.read_csv(f) for f in csv_files], ignore_index=True)
    print(f"[INFO] Loaded {len(df)} rows from {len(csv_files)} files")
    return df


def _generate_synthetic_data() -> pd.DataFrame:
    np.random.seed(42)
    n = 5000
    cycles = np.arange(1, n + 1)
    return pd.DataFrame({
        "EngineID": np.random.randint(1, 11, n),
        "Cycle": cycles,
        "Altitude_m": np.random.uniform(0, 12000, n),
        "Mach": np.random.uniform(0.2, 0.9, n),
        "Tamb_K": np.random.uniform(216, 310, n),
        "Pamb_Pa": np.random.uniform(20000, 101325, n),
        "RPM_rev_min": np.random.uniform(8000, 20000, n),
        "FuelFlow_kg_s": np.random.uniform(0.1, 1.5, n),
        "P2_Pa": np.random.uniform(80000, 105000, n),
        "T2_K": np.random.uniform(216, 310, n),
        "P3_Pa": np.random.uniform(500000, 2500000, n),
        "T3_K": np.random.uniform(500, 950, n),
        "P4_Pa": np.random.uniform(400000, 2000000, n),
        "T4_K": np.random.uniform(800, 1600, n),
        "Thrust_N": np.random.uniform(5000, 50000, n),
        "TSFC_g_N_s": np.random.uniform(10, 50, n),
    })


def plot_engine_lifecycle(df: pd.DataFrame):
    engine = df[df["EngineID"] == df["EngineID"].iloc[0]].head(500)
    if len(engine) < 2:
        return

    fig = plt.figure(figsize=(16, 10))
    gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.35, wspace=0.3)

    # RPM over cycles
    ax1 = fig.add_subplot(gs[0, 0])
    ax1.plot(engine["Cycle"], engine["RPM_rev_min"], color=HUD_BLUE, linewidth=1, alpha=0.8)
    ax1.fill_between(engine["Cycle"], engine["RPM_rev_min"], alpha=0.1, color=HUD_BLUE)
    ax1.set_title("RPM", color=HUD_BLUE)
    ax1.set_xlabel("Cycle")
    ax1.set_ylabel("RPM")

    # Fuel Flow
    ax2 = fig.add_subplot(gs[0, 1])
    ax2.plot(engine["Cycle"], engine["FuelFlow_kg_s"], color=HUD_AMBER, linewidth=1, alpha=0.8)
    ax2.fill_between(engine["Cycle"], engine["FuelFlow_kg_s"], alpha=0.1, color=HUD_AMBER)
    ax2.set_title("Fuel Flow", color=HUD_AMBER)
    ax2.set_xlabel("Cycle")
    ax2.set_ylabel("kg/s")

    # Temperature T4
    ax3 = fig.add_subplot(gs[0, 2])
    ax3.plot(engine["Cycle"], engine["T4_K"], color=HUD_ORANGE, linewidth=1, alpha=0.8)
    ax3.fill_between(engine["Cycle"], engine["T4_K"], alpha=0.1, color=HUD_ORANGE)
    ax3.set_title("Turbine Inlet Temp (T4)", color=HUD_ORANGE)
    ax3.set_xlabel("Cycle")
    ax3.set_ylabel("K")

    # Pressure Ratio
    if "P3_Pa" in engine.columns and "P2_Pa" in engine.columns:
        ax4 = fig.add_subplot(gs[1, 0])
        pr = engine["P3_Pa"] / engine["P2_Pa"].replace(0, 1)
        ax4.plot(engine["Cycle"], pr, color=HUD_CYAN, linewidth=1, alpha=0.8)
        ax4.fill_between(engine["Cycle"], pr, alpha=0.1, color=HUD_CYAN)
        ax4.set_title("Pressure Ratio", color=HUD_CYAN)
        ax4.set_xlabel("Cycle")
        ax4.set_ylabel("P3/P2")

    # Thrust
    if "Thrust_N" in engine.columns:
        ax5 = fig.add_subplot(gs[1, 1])
        ax5.plot(engine["Cycle"], engine["Thrust_N"], color=HUD_GREEN, linewidth=1, alpha=0.8)
        ax5.fill_between(engine["Cycle"], engine["Thrust_N"], alpha=0.1, color=HUD_GREEN)
        ax5.set_title("Thrust", color=HUD_GREEN)
        ax5.set_xlabel("Cycle")
        ax5.set_ylabel("N")

    # TSFC
    if "TSFC_g_N_s" in engine.columns:
        ax6 = fig.add_subplot(gs[1, 2])
        ax6.plot(engine["Cycle"], engine["TSFC_g_N_s"], color=HUD_RED, linewidth=1, alpha=0.8)
        ax6.fill_between(engine["Cycle"], engine["TSFC_g_N_s"], alpha=0.1, color=HUD_RED)
        ax6.set_title("TSFC", color=HUD_RED)
        ax6.set_xlabel("Cycle")
        ax6.set_ylabel("g/kN·s")

    # Altitude Profile
    ax7 = fig.add_subplot(gs[2, 0])
    ax7.plot(engine["Cycle"], engine["Altitude_m"], color=HUD_GREEN, linewidth=1, alpha=0.8)
    ax7.fill_between(engine["Cycle"], engine["Altitude_m"], alpha=0.1, color=HUD_GREEN)
    ax7.set_title("Altitude Profile", color=HUD_GREEN)
    ax7.set_xlabel("Cycle")
    ax7.set_ylabel("m")

    # Mach Profile
    ax8 = fig.add_subplot(gs[2, 1])
    ax8.plot(engine["Cycle"], engine["Mach"], color=HUD_BLUE, linewidth=1, alpha=0.8)
    ax8.fill_between(engine["Cycle"], engine["Mach"], alpha=0.1, color=HUD_BLUE)
    ax8.set_title("Mach Profile", color=HUD_BLUE)
    ax8.set_xlabel("Cycle")
    ax8.set_ylabel("Mach")

    # Distribution of key parameters
    ax9 = fig.add_subplot(gs[2, 2])
    params = ["RPM_rev_min", "FuelFlow_kg_s", "T4_K", "Thrust_N"]
    colors = [HUD_BLUE, HUD_AMBER, HUD_ORANGE, HUD_GREEN]
    for param, color in zip(params, colors):
        if param in engine.columns:
            data = engine[param].dropna()
            ax9.hist(data, bins=30, alpha=0.4, color=color, label=param, density=True)
    ax9.set_title("Parameter Distributions", color="#e5e7eb")
    ax9.legend(fontsize=8, loc="upper right")
    ax9.set_ylabel("Density")

    fig.suptitle("NIRIKSH — Engine Lifecycle Analysis", fontsize=14, color=HUD_BLUE, y=0.98)
    path = OUTPUT_DIR / "engine_lifecycle.png"
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"  Saved: {path.name}")


def plot_correlation_matrix(df: pd.DataFrame):
    numeric_cols = df.select_dtypes(include=[np.number]).columns
    corr_cols = [c for c in numeric_cols if c not in ["EngineID", "Cycle"]][:15]
    corr = df[corr_cols].corr()

    fig, ax = plt.subplots(figsize=(12, 10))
    im = ax.imshow(corr.values, cmap="coolwarm", vmin=-1, vmax=1, aspect="auto")
    ax.set_xticks(range(len(corr_cols)))
    ax.set_yticks(range(len(corr_cols)))
    ax.set_xticklabels(corr_cols, rotation=45, ha="right", fontsize=7)
    ax.set_yticklabels(corr_cols, fontsize=7)
    ax.set_title("Parameter Correlation Matrix", color=HUD_BLUE, fontsize=12)

    for i in range(len(corr_cols)):
        for j in range(len(corr_cols)):
            val = corr.values[i, j]
            color = "white" if abs(val) > 0.5 else "#9ca3af"
            ax.text(j, i, f"{val:.2f}", ha="center", va="center", fontsize=6, color=color)

    fig.colorbar(im, ax=ax, shrink=0.75)
    path = OUTPUT_DIR / "correlation_matrix.png"
    fig.savefig(path, dpi=150, bbox_inches="tight")
    plt.close()
    print(f"  Saved: {path.name}")


def main():
    print("=" * 60)
    print("  NIRIKSH Data Visualization")
    print("=" * 60)

    print("\n[1/3] Loading data...")
    df = load_data()

    print("\n[2/3] Generating engine lifecycle plot...")
    plot_engine_lifecycle(df)

    print("\n[3/3] Generating correlation matrix...")
    plot_correlation_matrix(df)

    print(f"\n[DONE] Visualizations saved to {OUTPUT_DIR}")


if __name__ == "__main__":
    main()
