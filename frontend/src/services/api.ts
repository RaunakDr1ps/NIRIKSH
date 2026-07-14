import axios from 'axios';
import type { DashboardData, EngineTelemetry, EnginePrediction, EngineHealth } from '@/types/engine';

const api = axios.create({
  baseURL: 'https://niriksh.onrender.com/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

export async function uploadDataset(
  file: File,
  onProgress?: (progress: number) => void,
): Promise<{ message: string; rows: number }> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    },
  });
  return data;
}

export async function getDashboard(): Promise<DashboardData> {
  const { data } = await api.get('/dashboard');
  return data;
}

export async function predictEngine(payload: Partial<EngineTelemetry>): Promise<{
  prediction: EnginePrediction;
  health: EngineHealth;
}> {
  const { data } = await api.post('/predict', payload);
  return data;
}

export async function getEngineHealth(engineId: number): Promise<{
  health: EngineHealth;
  status: string;
  confidence: number;
}> {
  const { data } = await api.get(`/health/${engineId}`);
  return data;
}

export async function getModelsInfo(): Promise<{
  models: Array<{ name: string; version: string; metrics: Record<string, number> }>;
}> {
  const { data } = await api.get('/models');
  return data;
}

export async function getEngineHistory(engineId: number, range?: string): Promise<{
  telemetry: EngineTelemetry[];
  health: EngineHealth[];
}> {
  const { data } = await api.get(`/history/${engineId}`, {
    params: { range },
  });
  return data;
}
