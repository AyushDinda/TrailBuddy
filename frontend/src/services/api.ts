import { MissionGenerateRequest, MissionGenerated, MissionResponse } from '../types/mission';

const BASE_URL = '/api';

export interface HealthStatus {
  status: string;
  project: string;
  version: string;
  ollama_base_url: string;
  ollama_model: string;
  mock_ai: boolean;
  timestamp: string;
}

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) {
    throw new Error('Backend health check failed');
  }
  return res.json();
}

export async function generateMission(req: MissionGenerateRequest): Promise<MissionGenerated> {
  const res = await fetch(`${BASE_URL}/missions/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    let errorDetail = 'Failed to generate mission';
    try {
      const errData = await res.json();
      errorDetail = errData.detail || errorDetail;
    } catch {
      // Fallback text if not json
      errorDetail = await res.text();
    }
    throw new Error(errorDetail);
  }

  return res.json();
}

export async function saveMission(payload: {
  title: string;
  tagline: string;
  activity: string;
  duration_minutes: number;
  difficulty: string;
  mission_json: MissionGenerated;
  completed?: boolean;
}): Promise<MissionResponse> {
  const res = await fetch(`${BASE_URL}/missions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to save mission' }));
    throw new Error(err.detail || 'Failed to save mission');
  }

  return res.json();
}

export async function getMissions(): Promise<MissionResponse[]> {
  const res = await fetch(`${BASE_URL}/missions`);
  if (!res.ok) {
    throw new Error('Failed to load mission history');
  }
  return res.json();
}

export async function getMissionById(id: number): Promise<MissionResponse> {
  const res = await fetch(`${BASE_URL}/missions/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to load mission ${id}`);
  }
  return res.json();
}

export async function completeMission(
  id: number,
  data: { reflection?: string; feeling?: string }
): Promise<MissionResponse> {
  const res = await fetch(`${BASE_URL}/missions/${id}/complete`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Failed to record completion' }));
    throw new Error(err.detail || 'Failed to record completion');
  }

  return res.json();
}

export async function deleteMission(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/missions/${id}`, {
    method: 'DELETE',
  });

  if (!res.ok) {
    throw new Error(`Failed to delete mission ${id}`);
  }
}
