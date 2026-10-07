export interface MissionStep {
  title: string;
  description: string;
}

export interface MissionGenerated {
  title: string;
  tagline: string;
  duration_minutes: number;
  activity: string;
  difficulty: string;
  intro: string;
  mission: string;
  steps: MissionStep[];
  challenge: string;
  screen_free_minutes: number;
  safety_note: string;
  completion_message: string;
}

export interface MissionGenerateRequest {
  duration: number;
  activity: string;
  mood: string;
  difficulty: string;
  interests: string[];
  additional_context?: string;
  location_context?: string;
}

export interface MissionResponse {
  id: number;
  title: string;
  tagline: string;
  activity: string;
  duration_minutes: number;
  difficulty: string;
  mission_data: MissionGenerated;
  completed: boolean;
  reflection: string | null;
  feeling: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface ActiveMissionSession {
  missionId?: number;
  mission: MissionGenerated;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  startedAt: number;
  currentStepIndex: number;
}
