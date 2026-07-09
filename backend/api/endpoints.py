import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, File, UploadFile, HTTPException

from schemas import (
    PredictRequest,
    PredictResponse,
    UploadResponse,
    DashboardData,
    HealthResponse,
    HistoryResponse,
    ModelListResponse,
    EngineTelemetry,
    EngineHealth,
    EnginePrediction,
    Warning,
    DegradationTrend,
    ModelInfo,
)
from core.engine_service import EngineService, get_engine_service

router = APIRouter()


@router.post("/upload", response_model=UploadResponse)
async def upload_dataset(
    file: UploadFile = File(...),
    engine_service: EngineService = Depends(get_engine_service),
):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are supported")

    content = await file.read()
    rows = await engine_service.load_dataset(content, file.filename)

    return UploadResponse(message="Dataset loaded successfully", rows=rows)


@router.get("/dashboard", response_model=DashboardData)
async def get_dashboard(
    engine_service: EngineService = Depends(get_engine_service),
):
    engine_id = engine_service._current_engine_id()
    telemetry = await engine_service.get_latest_telemetry()
    health = await engine_service.get_current_health()
    prediction = await engine_service.get_current_prediction()
    history = await engine_service.get_telemetry_history(engine_id)
    health_history = await engine_service.get_health_history(engine_id)
    trends = await engine_service.get_degradation_trends(engine_id)
    warnings = await engine_service.get_active_warnings()
    model_info = await engine_service.get_model_info()

    return DashboardData(
        telemetry=telemetry,
        health=health,
        prediction=prediction,
        history=history,
        healthHistory=health_history,
        degradationTrends=trends,
        warnings=warnings,
        modelInfo=model_info,
    )


@router.post("/predict", response_model=PredictResponse)
async def predict_engine(
    request: PredictRequest,
    engine_service: EngineService = Depends(get_engine_service),
):
    prediction = await engine_service.predict(
        altitude_m=request.altitude_m,
        mach=request.mach,
        tamb_k=request.tamb_k,
        pamb_pa=request.pamb_pa,
        rpm_rev_min=request.rpm_rev_min,
        fuelFlow_kg_s=request.fuelFlow_kg_s,
        p2_pa=request.p2_pa,
        t2_k=request.t2_k,
        p3_pa=request.p3_pa,
        t3_k=request.t3_k,
        p4_pa=request.p4_pa,
        t4_k=request.t4_k,
    )
    health = await engine_service.estimate_health_from_telemetry(
        altitude_m=request.altitude_m,
        mach=request.mach,
        tamb_k=request.tamb_k,
        pamb_pa=request.pamb_pa,
        rpm_rev_min=request.rpm_rev_min,
        fuelFlow_kg_s=request.fuelFlow_kg_s,
        p2_pa=request.p2_pa,
        t2_k=request.t2_k,
        p3_pa=request.p3_pa,
        t3_k=request.t3_k,
        p4_pa=request.p4_pa,
        t4_k=request.t4_k,
    )

    return PredictResponse(prediction=prediction, health=health)


@router.get("/health/{engine_id}", response_model=HealthResponse)
async def get_engine_health(
    engine_id: int,
    engine_service: EngineService = Depends(get_engine_service),
):
    health = await engine_service.get_engine_health(engine_id)
    status = "healthy"
    if health.overallHealth < 0.4:
        status = "critical"
    elif health.overallHealth < 0.6:
        status = "warning"
    elif health.overallHealth < 0.8:
        status = "attention"

    return HealthResponse(
        health=health,
        status=status,
        confidence=engine_service._get_confidence(),
    )


@router.get("/history/{engine_id}", response_model=HistoryResponse)
async def get_engine_history(
    engine_id: int,
    range: Optional[str] = "all",
    engine_service: EngineService = Depends(get_engine_service),
):
    telemetry = await engine_service.get_telemetry_history(engine_id, range)
    health = await engine_service.get_health_history(engine_id, range)

    return HistoryResponse(telemetry=telemetry, health=health)


@router.get("/models", response_model=ModelListResponse)
async def get_models(
    engine_service: EngineService = Depends(get_engine_service),
):
    models = await engine_service.get_available_models()
    return ModelListResponse(models=models)
