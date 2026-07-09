export interface EngineTelemetry {
  engineId: number;
  cycle: number;
  altitude_m: number;
  mach: number;
  tamb_k: number;
  pamb_pa: number;
  rpm_rev_min: number;
  fuelFlow_kg_s: number;
  p2_pa: number;
  t2_k: number;
  p3_pa: number;
  t3_k: number;
  p4_pa: number;
  t4_k: number;
}

export interface EngineHealth {
  compressorHealth: number;
  combustorHealth: number;
  turbineHealth: number;
  overallHealth: number;
}

export interface EnginePrediction {
  thrust_N: number;
  tsfc_g_N_s: number;
  confidence: number;
}

export type HealthStatus = 'healthy' | 'attention' | 'warning' | 'critical';

export interface HealthThresholds {
  healthy: number;
  attention: number;
  warning: number;
  critical: number;
}

export interface ParameterLimits {
  min: number;
  max: number;
  warningLow?: number;
  warningHigh?: number;
  criticalLow?: number;
  criticalHigh?: number;
}

export interface DashboardData {
  telemetry: EngineTelemetry;
  health: EngineHealth;
  prediction: EnginePrediction;
  history: EngineTelemetry[];
  healthHistory: EngineHealth[];
  degradationTrends: DegradationTrend[];
  warnings: Warning[];
  modelInfo: ModelInfo;
}

export interface DegradationTrend {
  cycle: number;
  compressorHealth: number;
  combustorHealth: number;
  turbineHealth: number;
  overallHealth: number;
}

export interface Warning {
  id: string;
  type: 'critical' | 'warning' | 'info';
  component: string;
  message: string;
  timestamp: string;
  active: boolean;
}

export interface ModelInfo {
  name: string;
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  lastTrained: string;
  features: string[];
}

export interface EngineStatus {
  status: HealthStatus;
  label: string;
  color: string;
  nextMaintenanceCycle: number;
  remainingLifePercent: number;
}

export type TimeRange = '1h' | '6h' | '24h' | '7d' | '30d' | 'all';
