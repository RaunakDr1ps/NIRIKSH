from pydantic import BaseModel, Field
from typing import List, Optional


class EngineTelemetry(BaseModel):
    engineId: int
    cycle: int
    altitude_m: float
    mach: float
    tamb_k: float
    pamb_pa: float
    rpm_rev_min: float
    fuelFlow_kg_s: float
    p2_pa: float
    t2_k: float
    p3_pa: float
    t3_k: float
    p4_pa: float
    t4_k: float


class EngineHealth(BaseModel):
    compressorHealth: float
    combustorHealth: float
    turbineHealth: float
    overallHealth: float


class EnginePrediction(BaseModel):
    thrust_N: float
    tsfc_g_N_s: float
    confidence: float


class Warning(BaseModel):
    id: str
    type: str  # critical, warning, info
    component: str
    message: str
    timestamp: str
    active: bool


class DegradationTrend(BaseModel):
    cycle: int
    compressorHealth: float
    combustorHealth: float
    turbineHealth: float
    overallHealth: float


class ModelInfo(BaseModel):
    name: str
    version: str
    accuracy: float
    precision: float
    recall: float
    f1Score: float
    lastTrained: str
    features: List[str]


class DashboardData(BaseModel):
    telemetry: EngineTelemetry
    health: EngineHealth
    prediction: EnginePrediction
    history: List[EngineTelemetry]
    healthHistory: List[EngineHealth]
    degradationTrends: List[DegradationTrend]
    warnings: List[Warning]
    modelInfo: ModelInfo


class PredictRequest(BaseModel):
    engineId: Optional[int] = 1
    altitude_m: float
    mach: float
    tamb_k: float
    pamb_pa: float
    rpm_rev_min: float
    fuelFlow_kg_s: float
    p2_pa: float
    t2_k: float
    p3_pa: float
    t3_k: float
    p4_pa: float
    t4_k: float


class PredictResponse(BaseModel):
    prediction: EnginePrediction
    health: EngineHealth


class UploadResponse(BaseModel):
    message: str
    rows: int


class HealthResponse(BaseModel):
    health: EngineHealth
    status: str
    confidence: float


class ModelListResponse(BaseModel):
    models: List[dict]


class HistoryResponse(BaseModel):
    telemetry: List[EngineTelemetry]
    health: List[EngineHealth]
