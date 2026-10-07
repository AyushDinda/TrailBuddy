import { ActiveMissionSession, MissionGenerated, MissionGenerateRequest, MissionResponse } from '../types/mission';

const PREVIEW_KEY = 'trailbuddy_preview_mission';
const PREVIEW_PARAMS_KEY = 'trailbuddy_preview_params';
const ACTIVE_SESSION_KEY = 'trailbuddy_active_session';
const LAST_COMPLETED_KEY = 'trailbuddy_last_completed';

export function savePreviewMission(mission: MissionGenerated, params: MissionGenerateRequest): void {
  try {
    localStorage.setItem(PREVIEW_KEY, JSON.stringify(mission));
    localStorage.setItem(PREVIEW_PARAMS_KEY, JSON.stringify(params));
  } catch (e) {
    console.error('Failed to save preview mission in localStorage', e);
  }
}

export function getPreviewMission(): { mission: MissionGenerated | null; params: MissionGenerateRequest | null } {
  try {
    const missionRaw = localStorage.getItem(PREVIEW_KEY);
    const paramsRaw = localStorage.getItem(PREVIEW_PARAMS_KEY);
    return {
      mission: missionRaw ? JSON.parse(missionRaw) : null,
      params: paramsRaw ? JSON.parse(paramsRaw) : null,
    };
  } catch (e) {
    console.error('Failed to read preview mission from localStorage', e);
    return { mission: null, params: null };
  }
}

export function clearPreviewMission(): void {
  localStorage.removeItem(PREVIEW_KEY);
  localStorage.removeItem(PREVIEW_PARAMS_KEY);
}

export function saveActiveSession(session: ActiveMissionSession): void {
  try {
    localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    console.error('Failed to save active session in localStorage', e);
  }
}

export function getActiveSession(): ActiveMissionSession | null {
  try {
    const raw = localStorage.getItem(ACTIVE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to read active session from localStorage', e);
    return null;
  }
}

export function clearActiveSession(): void {
  localStorage.removeItem(ACTIVE_SESSION_KEY);
}

export function saveLastCompleted(mission: MissionResponse): void {
  try {
    localStorage.setItem(LAST_COMPLETED_KEY, JSON.stringify(mission));
  } catch (e) {
    console.error('Failed to save last completed mission', e);
  }
}

export function getLastCompleted(): MissionResponse | null {
  try {
    const raw = localStorage.getItem(LAST_COMPLETED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Failed to read last completed mission', e);
    return null;
  }
}

export function clearLastCompleted(): void {
  localStorage.removeItem(LAST_COMPLETED_KEY);
}
