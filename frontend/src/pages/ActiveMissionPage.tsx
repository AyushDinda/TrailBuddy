import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  PhoneOff, 
  Trees, 
  ChevronRight, 
  ChevronLeft
} from 'lucide-react';
import { getActiveSession, saveActiveSession, clearActiveSession, saveLastCompleted } from '../utils/storage';
import { ActiveMissionSession } from '../types/mission';

export const ActiveMissionPage: React.FC = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<ActiveMissionSession | null>(null);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  // Initialize or restore session
  useEffect(() => {
    const active = getActiveSession();
    if (!active) {
      navigate('/create');
      return;
    }
    setSession(active);
  }, [navigate]);

  // Timer tick effect
  useEffect(() => {
    if (!session || !session.isRunning) return;

    const interval = setInterval(() => {
      setSession((prev) => {
        if (!prev) return null;
        if (prev.remainingSeconds <= 1) {
          clearInterval(interval);
          const finishedSession = {
            ...prev,
            remainingSeconds: 0,
            isRunning: false,
          };
          saveActiveSession(finishedSession);
          return finishedSession;
        }

        const updated = {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1,
        };
        saveActiveSession(updated);
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.isRunning]);

  if (!session) {
    return null;
  }

  const { mission, remainingSeconds, totalSeconds, isRunning, currentStepIndex, missionId } = session;

  const togglePauseResume = () => {
    const updated = {
      ...session,
      isRunning: !isRunning,
    };
    setSession(updated);
    saveActiveSession(updated);
  };

  const handleNextStep = () => {
    if (currentStepIndex < mission.steps.length - 1) {
      const updated = {
        ...session,
        currentStepIndex: currentStepIndex + 1,
      };
      setSession(updated);
      saveActiveSession(updated);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const updated = {
        ...session,
        currentStepIndex: currentStepIndex - 1,
      };
      setSession(updated);
      saveActiveSession(updated);
    }
  };

  const handleFinishMission = () => {
    // Record completion in storage and navigate to completion page
    if (missionId) {
      saveLastCompleted({
        id: missionId,
        title: mission.title,
        tagline: mission.tagline,
        activity: mission.activity,
        duration_minutes: mission.duration_minutes,
        difficulty: mission.difficulty,
        mission_data: mission,
        completed: true,
        reflection: null,
        feeling: null,
        created_at: new Date(session.startedAt).toISOString(),
        completed_at: new Date().toISOString(),
      });
    }

    clearActiveSession();
    navigate('/complete');
  };

  // Format time as MM:SS (or HH:MM:SS)
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hrs > 0) {
      return `${hrs}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  };

  const currentChallenge = mission.steps[currentStepIndex] || mission.steps[0];
  const progressPercent = Math.min(
    100,
    Math.max(0, ((totalSeconds - remainingSeconds) / totalSeconds) * 100)
  );

  return (
    <div className="min-h-[85vh] flex flex-col justify-between py-6 px-4 max-w-xl mx-auto">
      {/* Intentionally Minimal Header */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-100 text-nature-800 text-xs font-bold tracking-widest uppercase mb-3">
          <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
          <span>MISSION ACTIVE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          {mission.title}
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          {mission.activity} · {mission.duration_minutes} min goal
        </p>
      </div>

      {/* Center: Massive Countdown Timer & Core Minimalist Display */}
      <div className="my-auto py-8 text-center space-y-8">
        {/* Large Timer Display */}
        <div className="relative inline-block mx-auto">
          <div className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tighter text-nature-950 select-none py-2">
            {formatTime(remainingSeconds)}
          </div>

          {/* Progress Bar under timer */}
          <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden mt-2">
            <div
              className="bg-nature-700 h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Core Philosophy Callout: Put Screen Away */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-card text-center space-y-3 mx-2">
          <div className="w-12 h-12 rounded-2xl bg-nature-100 flex items-center justify-center text-nature-800 mx-auto">
            <PhoneOff className="w-6 h-6 animate-nature-pulse" />
          </div>
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-nature-950 font-serif">
              Your screen time is over.
            </h2>
            <p className="text-sm text-stone-600 font-sans leading-relaxed">
              Go outside. We'll be right here when you return.
            </p>
          </div>
          <div className="text-[11px] font-mono text-nature-700 uppercase tracking-wider pt-1">
            Put your phone in your pocket or backpack
          </div>
        </div>

        {/* Current Active Step/Challenge */}
        <div className="bg-canvas border border-stone-200 rounded-2xl p-4 text-left mx-2 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-500 mb-2">
            <span className="uppercase tracking-wider text-nature-800">
              Challenge {currentStepIndex + 1} of {mission.steps.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevStep}
                disabled={currentStepIndex === 0}
                className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextStep}
                disabled={currentStepIndex === mission.steps.length - 1}
                className="p-1 rounded-md hover:bg-stone-200 disabled:opacity-30"
                aria-label="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h3 className="font-bold text-sm text-stone-900 mb-1">
            {currentChallenge.title}
          </h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            {currentChallenge.description}
          </p>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="space-y-3 pt-4 border-t border-stone-200/80">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={togglePauseResume}
            className={`flex items-center justify-center gap-2 py-3.5 rounded-2xl border text-sm font-semibold transition-all ${
              isRunning
                ? 'border-stone-300 bg-white text-stone-700 hover:bg-stone-50'
                : 'border-nature-700 bg-nature-100 text-nature-900 font-bold'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-nature-900" />
                <span>Resume</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowExitConfirm(true)}
            className="flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-nature-800 hover:bg-nature-900 text-white text-sm font-bold shadow-md transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Finish Mission</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal before early completion */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-lifted animate-in fade-in zoom-in-95 duration-150">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Trees className="w-5 h-5" />
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-lg font-bold text-stone-900">
                Ready to wrap up?
              </h4>
              <p className="text-xs text-stone-600">
                {remainingSeconds > 60
                  ? `You still have ${Math.ceil(remainingSeconds / 60)} minutes left in your outdoor window. Want to complete now?`
                  : 'Great job getting outside! Ready to record your reflection?'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setShowExitConfirm(false)}
                className="py-2.5 rounded-xl border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50"
              >
                Keep Going
              </button>
              <button
                onClick={handleFinishMission}
                className="py-2.5 rounded-xl bg-nature-800 hover:bg-nature-900 text-white text-xs font-bold shadow-sm"
              >
                Yes, Finish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
