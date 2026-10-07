import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  RotateCw, 
  ArrowLeft, 
  ShieldAlert, 
  PhoneOff, 
  AlertCircle
} from 'lucide-react';
import { NatureBadge } from '../components/NatureBadge';
import { getPreviewMission, savePreviewMission, saveActiveSession } from '../utils/storage';
import { generateMission, saveMission } from '../services/api';
import { MissionGenerated, MissionGenerateRequest } from '../types/mission';

export const MissionPreviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [mission, setMission] = useState<MissionGenerated | null>(null);
  const [params, setParams] = useState<MissionGenerateRequest | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cached = getPreviewMission();
    if (!cached.mission) {
      navigate('/create');
      return;
    }
    setMission(cached.mission);
    setParams(cached.params);
  }, [navigate]);

  if (!mission) {
    return null;
  }

  const handleStartMission = async () => {
    try {
      setIsStarting(true);
      setError(null);

      // Save to SQLite backend
      const saved = await saveMission({
        title: mission.title,
        tagline: mission.tagline,
        activity: mission.activity,
        duration_minutes: mission.duration_minutes,
        difficulty: mission.difficulty,
        mission_json: mission,
        completed: false,
      });

      // Initialize active mission session in localStorage
      const totalSeconds = mission.duration_minutes * 60;
      saveActiveSession({
        missionId: saved.id,
        mission: mission,
        totalSeconds: totalSeconds,
        remainingSeconds: totalSeconds,
        isRunning: true,
        startedAt: Date.now(),
        currentStepIndex: 0,
      });

      // Transition to active minimal screen
      navigate('/active');
    } catch (err: any) {
      console.error('Failed to start and save mission', err);
      setError(err.message || 'Could not save mission to history. Check backend connection.');
      setIsStarting(false);
    }
  };

  const handleRegenerate = async () => {
    if (!params) return;
    try {
      setIsRegenerating(true);
      setError(null);
      const newMission = await generateMission(params);
      setMission(newMission);
      savePreviewMission(newMission, params);
    } catch (err: any) {
      console.error('Failed to regenerate mission', err);
      setError(err.message || 'Failed to regenerate. Local AI might be unavailable.');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/create')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit Preferences</span>
        </button>

        <span className="text-xs font-mono font-medium text-nature-700 bg-nature-100/70 px-2.5 py-1 rounded-full">
          Mission Ready
        </span>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Mission Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-lifted overflow-hidden">
        {/* Card Header Banner */}
        <div className="bg-gradient-to-r from-nature-900 via-nature-800 to-nature-900 text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                Your Outdoor Assignment
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
              {mission.title}
            </h1>

            <p className="text-sm sm:text-base text-stone-300 italic font-serif">
              "{mission.tagline}"
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              <NatureBadge type="duration" value={mission.duration_minutes} />
              <NatureBadge type="difficulty" value={mission.difficulty} />
              <NatureBadge type="activity" value={mission.activity} />
              <NatureBadge type="screen-free" value={mission.screen_free_minutes} />
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 sm:p-8 space-y-8">
          {/* Mission Objective */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-nature-800 block mb-2">
              Mission Objective
            </span>
            <p className="text-stone-800 text-base leading-relaxed bg-nature-50/60 p-4 rounded-2xl border border-nature-100">
              {mission.mission}
            </p>
          </div>

          {/* Today's Challenges Progression */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-nature-800">
                Today's Challenges
              </span>
              <span className="text-[11px] text-stone-500">
                {mission.steps.length} sequential steps
              </span>
            </div>

            <div className="space-y-3">
              {mission.steps.map((step, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-canvas border border-stone-200/80 flex items-start gap-4 transition-all hover:border-nature-300"
                >
                  <div className="w-7 h-7 rounded-full bg-nature-700 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-0.5 shadow-xs">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm text-stone-900">{step.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Screen-Free Focus Callout */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
              <PhoneOff className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-900">
                  Screen-Free Goal
                </span>
                <span className="text-xs font-bold text-emerald-800">
                  ({mission.screen_free_minutes} Minutes)
                </span>
              </div>
              <p className="text-xs text-emerald-950 leading-relaxed">
                {mission.challenge}
              </p>
            </div>
          </div>

          {/* Safety Note */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5 text-xs text-stone-600">
            <ShieldAlert className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-stone-700 font-semibold">Safety Reminder: </strong>
              {mission.safety_note}
            </span>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating || isStarting}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-sm font-semibold transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Asking Local AI...' : 'Regenerate Mission'}</span>
            </button>

            <button
              onClick={handleStartMission}
              disabled={isStarting || isRegenerating}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl bg-nature-800 hover:bg-nature-900 text-white font-bold text-sm shadow-lifted hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{isStarting ? 'Preparing Session...' : 'Start Mission'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
