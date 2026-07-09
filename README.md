# NIRIKSH

**Physics-Informed Digital Twin for Real-Time Turbojet Engine Health Monitoring**

NIRIKSH (Next-generation Intelligent Real-time Intelligent Knowledge-based Surveillance & Health) is an end-to-end ML-powered digital twin platform that ingests live turbojet telemetry, estimates component-level degradation, predicts thrust and TSFC, and surfaces actionable maintenance warnings — all through a real-time dashboard.

---

## Features

- **Real-Time Telemetry Ingestion** — Upload CSV datasets and step through operational cycles live
- **Component-Level Health Estimation** — ML models predict compressor, combustor, and turbine health (0–1 scale)
- **Performance Prediction** — Thrust (N) and TSFC (g/N·s) estimates with confidence scoring
- **Degradation Trend Analysis** — Track how each sub-system degrades over consecutive cycles
- **Physics-Informed Fallbacks** — When ML models are absent, physics-based heuristics keep the system operational
- **Intelligent Warning System** — Tiered alerts (critical / warning / info) based on health thresholds
- **Interactive Dashboard** — Built with React + Vite, featuring live charts and a dark-themed UI
- **Model Management** — Load individual health/performance models or a unified multi-output model

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        NIRIKSH SYSTEM                               │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────┐     ┌──────────────────┐     ┌────────────────┐  │
│  │   Frontend    │     │    Backend API   │     │   ML Engine    │  │
│  │  (React/Vite) │◄───►│   (FastAPI)      │◄───►│  (Python)      │  │
│  │               │     │                  │     │                │  │
│  │  • Dashboard  │     │  /api/dashboard  │     │  • Feature     │  │
│  │  • Health     │     │  /api/predict    │     │    Engineering │  │
│  │    Monitor    │     │  /api/upload     │     │  • Health      │  │
│  │  • Analytics  │     │  /api/health/:id │     │    Models (RF, │  │
│  │  • Predictions│     │  /api/history/:id│     │    XGBoost)    │  │
│  │  • Maintenance│     │  /api/models     │     │  • Performance │  │
│  │               │     │                  │     │    Models      │  │
│  └──────┬───────┘     └────────┬─────────┘     │    (XGBoost,   │  │
│         │                      │               │    LightGBM)   │  │
│         │                      │               │  • Physics-    │  │
│         │                      │               │    Informed    │  │
│         │                      │               │    Fallbacks   │  │
│         │                      │               └────────┬───────┘  │
│         │                      │                        │          │
│         ▼                      ▼                        ▼          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                    Data / Model Storage                     │    │
│  │                                                             │    │
│  │  datasets/raw/   │  models/saved/*.pkl   │  models/         │    │
│  │  train.csv       │  best_model.joblib    │  pipelines/      │    │
│  │  test.csv        │  (unified 6-output)   │  feature_meta    │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer      | Technology                                                       |
| ---------- | ---------------------------------------------------------------- |
| **Backend**  | Python 3.12+, FastAPI, Uvicorn, Pydantic                         |
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS, Recharts, Framer Motion |
| **ML**       | scikit-learn, XGBoost, LightGBM, pandas, numpy, joblib           |
| **Infra**    | Windows (dev), `.bat` launchers, Jupyter notebooks               |

---

## Folder Structure

```
NIRIKSH/
├── backend/
│   ├── api/            # REST endpoints (dashboard, predict, upload, history)
│   ├── core/           # EngineService — main business logic
│   ├── models/         # ModelInference — model loading & prediction
│   ├── utils/          # Feature engineering (create_features, FEATURE_COLUMNS)
│   ├── main.py         # FastAPI app entry point
│   ├── config.py       # Settings via pydantic-settings
│   └── schemas.py      # Pydantic request/response models
├── frontend/
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── context/    # Dashboard state management
│   │   ├── pages/      # Page views (Dashboard, HealthMonitor, Analytics…)
│   │   ├── services/   # API client layer
│   │   ├── types/      # TypeScript interfaces
│   │   └── utils/      # Helper functions
│   ├── package.json
│   └── vite.config.ts
├── ml/
│   ├── features/       # Feature engineering scripts
│   ├── training/       # Training pipeline (train_pipeline.py)
│   └── evaluation/     # Evaluation & visualization (evaluate.py, visualize.py)
├── models/
│   ├── saved/          # Trained model artifacts (.pkl, .joblib)
│   └── pipelines/      # Feature metadata & training reports
├── datasets/
│   ├── raw/            # Source CSV datasets (train.csv, test.csv, ground_truth.csv)
│   └── processed/      # (ignored) Generated artifacts
├── notebooks/
│   ├── 01_Data_Exploration.ipynb
│   ├── 02_Feature_Engineering.ipynb
│   └── 03_Model_Training.ipynb
├── reports/            # Generated evaluation reports
├── docs/               # Project documentation
├── start_backend.bat   # One-click backend launcher (Windows)
├── start_frontend.bat  # One-click frontend launcher (Windows)
└── .gitignore
```

---

## Installation

### Prerequisites

- Python 3.12+
- Node.js 20+
- npm 10+

### Backend Setup

```bash
cd backend
python -m venv venv
.\venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

### Frontend Setup

```bash
cd frontend
npm install
```

---

## Running Backend

```bash
cd backend
.\venv\Scripts\activate
python main.py
```

The API starts at **http://localhost:8000**

Or use the one-click launcher:

```bash
.\start_backend.bat
```

---

## Running Frontend

```bash
cd frontend
npm run dev
```

The dev server starts at **http://localhost:5173**

Or use the one-click launcher:

```bash
.\start_frontend.bat
```

---

## Running Notebooks

```bash
cd notebooks
jupyter notebook
```

| Notebook                      | Description                             |
| ----------------------------- | --------------------------------------- |
| `01_Data_Exploration.ipynb`   | Exploratory data analysis & statistics  |
| `02_Feature_Engineering.ipynb`| Feature creation & selection            |
| `03_Model_Training.ipynb`     | Train unified multi-output model        |

---

## ML Pipeline

The training pipeline supports two model architectures:

### Individual Models (via `train_pipeline.py`)

| Target                  | Algorithms               |
| ----------------------- | ------------------------ |
| CompressorHealth        | RandomForest, XGBoost    |
| CombustorHealth         | RandomForest, XGBoost    |
| TurbineHealth           | RandomForest, XGBoost    |
| OverallHealth           | RandomForest, XGBoost    |
| Thrust_N                | XGBoost, LightGBM        |
| TSFC_g_N_s              | XGBoost, LightGBM        |

**Run the pipeline:**

```bash
python ml/training/train_pipeline.py
```

### Unified Multi-Output Model (via notebook)

Notebook `03_Model_Training.ipynb` trains a single multi-output regressor that predicts all 6 targets at once. The output is saved as `models/best_model.joblib`.

### Evaluation

```bash
python ml/evaluation/evaluate.py
```

Generates feature importance plots in `ml/evaluation/`.

---

## API Endpoints

| Method | Endpoint             | Description                               |
| ------ | -------------------- | ----------------------------------------- |
| GET    | `/`                  | Root health check                         |
| GET    | `/api/dashboard`     | Full dashboard snapshot (telemetry, health, prediction, warnings, trends, model info) |
| POST   | `/api/predict`       | Predict thrust, TSFC, and health from raw telemetry |
| POST   | `/api/upload`        | Upload a CSV dataset for streaming        |
| GET    | `/api/health/{id}`   | Get health status for a specific engine   |
| GET    | `/api/history/{id}`  | Get telemetry & health history for an engine |
| GET    | `/api/models`        | List all loaded models                    |

### Example: Predict

```bash
curl -X POST http://localhost:8000/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "altitude_m": 0, "mach": 0.3, "tamb_k": 288.15,
    "pamb_pa": 101325, "rpm_rev_min": 15000,
    "fuelFlow_kg_s": 0.5, "p2_pa": 101325, "t2_k": 288.15,
    "p3_pa": 1520000, "t3_k": 850, "p4_pa": 1200000,
    "t4_k": 1200
  }'
```

---

## Screenshots

<!-- TODO: Add dashboard, health monitor, and analytics screenshots here -->

---

## Future Work

- [ ] **Live data streaming** — WebSocket-based telemetry for real-time sensor feeds
- [ ] **Multi-engine fleet view** — Aggregate health across multiple engine units
- [ ] **Explainable AI (XAI)** — SHAP/LIME integration for prediction interpretability
- [ ] **RUL estimation** — Remaining Useful Life prediction using survival models
- [ ] **Anomaly detection** — Unsupervised isolation-forest based anomaly flags
- [ ] **Docker deployment** — Containerized stack for cloud deployment
- [ ] **CI/CD pipeline** — Automated testing, training, and deployment

---

## License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## Contributors

- **Raunak** — *Lead Developer* — [GitHub](https://github.com/raunak)
