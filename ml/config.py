from pathlib import Path

# Root directory
ROOT_DIR = Path(__file__).resolve().parents[1]

# Dataset paths
DATASET_DIR = ROOT_DIR / "datasets" / "raw"

TRAIN_DATA = DATASET_DIR / "train.csv"
TEST_DATA = DATASET_DIR / "test.csv"
GROUND_TRUTH = DATASET_DIR / "ground_truth.csv"

# Model directory
MODEL_DIR = ROOT_DIR / "models" / "saved"

# Report directory
REPORT_DIR = ROOT_DIR / "reports"

# Create folders automatically
MODEL_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)