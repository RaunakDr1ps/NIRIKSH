import pandas as pd
import numpy as np
from typing import List


def create_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()

    df["PressureRatio"] = df["P3_Pa"] / df["P2_Pa"].replace(0, 1)

    df["TemperatureRatio"] = df["T3_K"] / df["T2_K"].replace(0, 1)

    df["ExpansionRatio"] = df["P4_Pa"] / df["P3_Pa"].replace(0, 1)

    df["DeltaT_Combustor"] = df["T3_K"] - df["T2_K"]

    df["TurbineInletRatio"] = df["T4_K"] / df["T3_K"].replace(0, 1)

    unique_ids = df["EngineID"].unique()
    for eid in unique_ids:
        mask = df["EngineID"] == eid
        rpm_mean = df.loc[mask, "RPM_rev_min"].mean()
        rpm_std = df.loc[mask, "RPM_rev_min"].std()
        if rpm_std > 0:
            df.loc[mask, "NormalizedRPM"] = (df.loc[mask, "RPM_rev_min"] - rpm_mean) / rpm_std
        else:
            df.loc[mask, "NormalizedRPM"] = 0.0

    for eid in unique_ids:
        mask = df["EngineID"] == eid
        ff_mean = df.loc[mask, "FuelFlow_kg_s"].mean()
        ff_std = df.loc[mask, "FuelFlow_kg_s"].std()
        if ff_std > 0:
            df.loc[mask, "NormalizedFuelFlow"] = (df.loc[mask, "FuelFlow_kg_s"] - ff_mean) / ff_std
        else:
            df.loc[mask, "NormalizedFuelFlow"] = 0.0

    df["CompressorEfficiency"] = df["PressureRatio"] / (df["TemperatureRatio"] ** 0.286)

    df["TurbineEfficiency"] = (1 - df["ExpansionRatio"] ** 0.25) / (1 - df["ExpansionRatio"])

    df["SpecificThrust"] = df["FuelFlow_kg_s"] * df["PressureRatio"] / df["Mach"].replace(0, 0.1)

    df["ThermalEfficiency"] = 1 - 1 / (df["PressureRatio"] ** 0.286)

    df["CycleSquared"] = df["Cycle"] ** 2
    df["CycleLog"] = np.log1p(df["Cycle"])
    df["CyclePressureDecay"] = df["Cycle"] * df["PressureRatio"]

    for eid in unique_ids:
        mask = df["EngineID"] == eid
        for col in ["RPM_rev_min", "FuelFlow_kg_s", "P3_Pa", "T3_K", "T4_K"]:
            df.loc[mask, f"{col}_RollMean5"] = (
                df.loc[mask, col].rolling(window=5, min_periods=1).mean()
            )
            df.loc[mask, f"{col}_RollStd5"] = (
                df.loc[mask, col].rolling(window=5, min_periods=1).std().fillna(0)
            )

    df["RPM_FuelRatio"] = df["RPM_rev_min"] / df["FuelFlow_kg_s"].replace(0, 1e-6)
    df["ThrustFuelRatio"] = df["P4_Pa"] / df["FuelFlow_kg_s"].replace(0, 1e-6)

    return df


FEATURE_COLUMNS = [
    "Cycle", "Altitude_m", "Mach", "Tamb_K", "Pamb_Pa",
    "PressureRatio", "TemperatureRatio", "ExpansionRatio",
    "DeltaT_Combustor", "TurbineInletRatio",
    "NormalizedRPM", "NormalizedFuelFlow",
    "CompressorEfficiency", "TurbineEfficiency",
    "SpecificThrust", "ThermalEfficiency",
    "CycleSquared", "CycleLog", "CyclePressureDecay",
    "RPM_rev_min_RollMean5", "FuelFlow_kg_s_RollMean5",
    "P3_Pa_RollMean5", "T3_K_RollMean5", "T4_K_RollMean5",
    "RPM_FuelRatio", "ThrustFuelRatio",
]

HEALTH_TARGETS = [
    "CompressorHealth", "CombustorHealth", "TurbineHealth", "OverallHealth",
]

PERFORMANCE_TARGETS = [
    "Thrust_N", "TSFC_g_N_s",
]


# ---------------------------------------------------------------------------
# V2 feature engineering — matches notebook 02 (used by best_model.joblib)
# ---------------------------------------------------------------------------

def create_features_v2(df: pd.DataFrame) -> pd.DataFrame:
    """Reproduce the exact feature engineering from notebook 02.

    Keeps all 14 raw telemetry columns and adds 12 engineered features.
    The output has 32 columns (14 raw + 12 engineered + EngineID + Cycle +
    6 targets, though targets are not created here).
    """
    df = df.copy()

    df["Pressure_Ratio"] = df["P3_Pa"] / df["P2_Pa"]
    df["Temperature_Ratio"] = df["T3_K"] / df["T2_K"]
    df["Turbine_Expansion_Ratio"] = df["P3_Pa"] / df["P4_Pa"]
    df["Turbine_Temperature_Drop_K"] = df["T3_K"] - df["T4_K"]
    df["Combustor_Temp_Rise_K"] = df["T3_K"] - df["T2_K"]

    df["Corrected_RPM"] = df["RPM_rev_min"] / np.sqrt(df["T2_K"] / 288.15)
    df["Corrected_FuelFlow"] = (
        df["FuelFlow_kg_s"]
        / (df["P2_Pa"] / 101325)
        / np.sqrt(df["T2_K"] / 288.15)
    )

    gamma_ratio = 0.286
    ideal_work = df["Pressure_Ratio"] ** gamma_ratio - 1
    actual_work = df["Temperature_Ratio"] - 1
    df["Compressor_Efficiency_Proxy"] = ideal_work / actual_work

    df["RPM_squared"] = df["RPM_rev_min"] ** 2
    df["TAS_Proxy"] = df["Mach"] * np.sqrt(df["Tamb_K"])
    df["Cycle_Squared"] = df["Cycle"] ** 2
    df["Log_Pressure_Ratio"] = np.log(df["Pressure_Ratio"])

    return df


FEATURE_COLUMNS_V2 = [
    "Altitude_m",
    "Mach",
    "Tamb_K",
    "Pamb_Pa",
    "RPM_rev_min",
    "FuelFlow_kg_s",
    "P2_Pa",
    "T2_K",
    "P3_Pa",
    "T3_K",
    "P4_Pa",
    "T4_K",
    "Pressure_Ratio",
    "Temperature_Ratio",
    "Turbine_Expansion_Ratio",
    "Turbine_Temperature_Drop_K",
    "Combustor_Temp_Rise_K",
    "Corrected_RPM",
    "Corrected_FuelFlow",
    "Compressor_Efficiency_Proxy",
    "RPM_squared",
    "TAS_Proxy",
    "Cycle_Squared",
    "Log_Pressure_Ratio",
]