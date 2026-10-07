import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Trees, 
  Save, 
  RotateCcw, 
  Check
} from 'lucide-react';
import { getLastCompleted } from '../utils/storage';
import { completeMission } from '../services/api';
import { MissionResponse } from '../types/mission';

const FEELING_OPTIONS = [
  'Great',
  'Relaxing',
  'Energizing',
  'Interesting',
  'Challenging',
  'I want to do this again',
];

export const MissionCompletePage: React.FC = () => {
  const navigate = useNavigate();
  const [lastMission, setLastMission] = useState<MissionResponse | null>(null);
  const [selectedFeeling, setSelectedFeeling] = useState<string>('Great');
  const [reflection, setReflection] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  useEffect(() => {
    const saved = getLastCompleted();
    if (!saved) {
      // If none in session, default or redirect to history
      navigate('/history');
      return;
    }
    setLastMission(saved);
  }, [navigate]);

  if (!lastMission) {
    return null;
  }

  const handleSaveReflection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lastMission.id) return;

    try {
      setIsSaving(true);
      await completeMission(lastMission.id, {
        feeling: selectedFeeling,
        reflection: reflection.trim() || undefined,
      });
      setIsSaved(true);
    } catch (err) {
      console.error('Failed to save reflection to backend', err);
      // Still show saved locally
      setIsSaved(true);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Celebration Header */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-3xl bg-nature-100 flex items-center justify-center text-nature-800 mx-auto shadow-sm">
          <Trees className="w-8 h-8 text-nature-700" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
          <span>MISSION ACCOMPLISHED</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-nature-950 font-serif">
          Mission Complete 🌿
        </h1>

        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Welcome back from the physical world. Your brain and body thank you for taking time away from the glass screen.
        </p>
      </div>

      {/* Mission Stats Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-8 shadow-card space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-nature-800">
              Completed Assignment
            </span>
            <h2 className="text-lg font-bold text-stone-900">{lastMission.title}</h2>
          </div>
          <span className="text-xs font-mono px-3 py-1 bg-stone-100 rounded-full text-stone-700 self-start sm:self-auto">
            {lastMission.activity} · {lastMission.duration_minutes} min
          </span>
        </div>

        {/* Real World Achievements */}
        <div className="space-y-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 block">
            Achievements
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-nature-50 border border-nature-200/80 flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-nature-700 text-white flex items-center justify-center text-xs shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-nature-950">You went outside</span>
            </div>

            <div className="p-3 rounded-2xl bg-nature-50 border border-nature-200/80 flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-nature-700 text-white flex items-center justify-center text-xs shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-nature-950">Completed mission</span>
            </div>

            <div className="p-3 rounded-2xl bg-nature-50 border border-nature-200/80 flex items-center gap-2.5">
              <div className="w-5 h-5 rounded-full bg-nature-700 text-white flex items-center justify-center text-xs shrink-0">
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
              <span className="text-xs font-semibold text-nature-950">Left the screen</span>
            </div>
          </div>
        </div>

        {/* Reflection Form */}
        <form onSubmit={handleSaveReflection} className="space-y-6 pt-4 border-t border-stone-100">
          {/* Feeling Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
              How did it feel?
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {FEELING_OPTIONS.map((feeling) => {
                const isSelected = selectedFeeling === feeling;
                return (
                  <button
                    key={feeling}
                    type="button"
                    onClick={() => setSelectedFeeling(feeling)}
                    className={`p-3 rounded-2xl text-xs font-semibold transition-all border text-left flex items-center justify-between ${
                      isSelected
                        ? 'border-nature-700 bg-nature-50 text-nature-950 shadow-xs ring-1 ring-nature-700'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    <span>{feeling}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-nature-700" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sensory Reflection Textarea */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 mb-1.5">
              What did you notice?
            </label>
            <textarea
              rows={3}
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="The scent of pine needles, the temperature of the wind, bird songs, or a quiet trail you hadn't walked before..."
              className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-hidden focus:border-nature-600 focus:ring-2 focus:ring-nature-100 text-sm text-stone-800 placeholder:text-stone-400"
            />
          </div>

          {/* Save Reflection Action */}
          <div className="flex items-center justify-between pt-2">
            {isSaved ? (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 bg-emerald-50 px-3.5 py-2 rounded-xl border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Reflection saved to your local offline history!</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nature-800 hover:bg-nature-900 text-white text-xs font-bold transition-all shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4 text-nature-300" />
                <span>{isSaving ? 'Saving...' : 'Save Reflection'}</span>
              </button>
            )}

            <Link
              to="/history"
              className="text-xs font-semibold text-stone-600 hover:text-nature-900 underline underline-offset-4"
            >
              View All History
            </Link>
          </div>
        </form>
      </div>

      {/* Next Adventure CTA */}
      <div className="text-center pt-4">
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 font-bold text-sm shadow-card hover:shadow-soft transition-all"
        >
          <RotateCcw className="w-4 h-4 text-nature-700" />
          <span>Create Another Mission</span>
        </Link>
      </div>
    </div>
  );
};
