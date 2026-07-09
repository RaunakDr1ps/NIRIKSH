from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "NIRIKSH"
    app_version: str = "2.1.0"
    debug: bool = False

    # Paths
    base_dir: Path = Path(__file__).resolve().parent
    model_dir: Path = base_dir.parent / "models" / "saved"
    best_model_path: Path = base_dir.parent / "models" / "best_model.joblib"
    dataset_dir: Path = base_dir.parent / "datasets" / "raw"
    ml_pipeline_dir: Path = base_dir.parent / "models" / "pipelines"

    # API
    host: str = "0.0.0.0"
    port: int = 8000

    # Data
    max_upload_size_mb: int = 50
    poll_interval_ms: int = 5000

    # Model
    default_engine_id: int = 1
    confidence_threshold: float = 0.7

    model_config = {"protected_namespaces": ("settings_",), "env_prefix": "NIRIKSH_", "env_file": ".env"}


settings = Settings()
