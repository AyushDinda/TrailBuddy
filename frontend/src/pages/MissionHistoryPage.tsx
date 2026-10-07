import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  History, 
  Trees, 
  Compass, 
  Trash2, 
  Calendar, 
  Smile, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle 
} from 'lucide-react';
import { getMissions, deleteMission } from '../services/api';
import { MissionResponse } from '../types/mission';
import { NatureBadge } from '../components/NatureBadge';

export const MissionHistoryPage: React.FC = () => {
  const [missions, setMissions] = useState<MissionResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMissions();
      setMissions(data);
    } catch (err: any) {
      console.error('Failed to load history', err);
      setError(err.message || 'Could not load missions from SQLite database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to remove this mission record?')) return;
    try {
      await deleteMission(id);
      setMissions(missions.filter((m) => m.id !== id));
    } catch (err: any) {
      alert(`Failed to delete mission: ${err.message}`);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-nature-700 mb-1">
            <History className="w-3.5 h-3.5" />
            <span>Offline Archive</span>
          </div>
          <h1 className="text-3xl font-extrabold text-stone-900">
            Mission History
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Persisted locally in your SQLite database. Private to your machine.
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nature-800 hover:bg-nature-900 text-white text-xs font-bold shadow-sm transition-all self-start sm:self-auto"
        >
          <Compass className="w-4 h-4 text-nature-300" />
          <span>New Mission</span>
        </Link>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-nature-700 border-t-transparent animate-spin mx-auto" />
          <p className="text-xs text-stone-500">Loading your outdoor history...</p>
        </div>
      ) : missions.length === 0 ? (
        /* Empty state */
        <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-stone-200/80 p-8 shadow-card max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-3xl bg-nature-50 flex items-center justify-center text-nature-700 mx-auto">
            <Trees className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-stone-900 font-serif">
              No adventures yet.
            </h3>
            <p className="text-sm text-stone-600">
              Your first one is waiting outside.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-nature-800 hover:bg-nature-900 text-white text-xs font-bold shadow-sm transition-all"
            >
              <Compass className="w-4 h-4 text-nature-300" />
              <span>Create My First Mission</span>
            </Link>
          </div>
        </div>
      ) : (
        /* List of Missions */
        <div className="space-y-4">
          {missions.map((m) => {
            const isExpanded = expandedId === m.id;
            const steps = m.mission_data?.steps || [];

            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-stone-200/90 shadow-card hover:shadow-soft transition-all overflow-hidden"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-stone-900">
                          {m.title}
                        </span>
                        {m.completed && (
                          <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-500 italic">
                        "{m.tagline}"
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete record"
                        aria-label="Delete mission"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => toggleExpand(m.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
                        aria-label="Toggle details"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Metadata Badges */}
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <NatureBadge type="activity" value={m.activity} />
                    <NatureBadge type="duration" value={m.duration_minutes} />
                    <NatureBadge type="difficulty" value={m.difficulty} />
                    <span className="text-stone-400">·</span>
                    <span className="text-stone-500 flex items-center gap-1 font-mono text-[11px]">
                      <Calendar className="w-3.5 h-3.5" />
                      {formatDate(m.completed_at || m.created_at)}
                    </span>
                  </div>

                  {/* User Feeling & Reflection */}
                  {(m.feeling || m.reflection) && (
                    <div className="p-3.5 rounded-xl bg-canvas border border-stone-200/80 space-y-1.5 text-xs">
                      {m.feeling && (
                        <div className="flex items-center gap-1.5 font-semibold text-nature-900">
                          <Smile className="w-3.5 h-3.5 text-nature-700" />
                          <span>Felt: "{m.feeling}"</span>
                        </div>
                      )}
                      {m.reflection && (
                        <p className="text-stone-600 italic leading-relaxed">
                          "{m.reflection}"
                        </p>
                      )}
                    </div>
                  )}

                  {/* Expanded Mission Steps */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-stone-100 space-y-3 animate-in fade-in duration-150">
                      <div className="text-xs font-bold uppercase tracking-wider text-nature-800">
                        Mission Steps & Challenges
                      </div>

                      <div className="space-y-2">
                        {steps.map((st, sidx) => (
                          <div key={sidx} className="p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
                            <span className="font-bold text-stone-900 block mb-0.5">
                              {sidx + 1}. {st.title}
                            </span>
                            <span className="text-stone-600">{st.description}</span>
                          </div>
                        ))}
                      </div>

                      {m.mission_data?.safety_note && (
                        <p className="text-[11px] text-stone-500 pt-1">
                          <strong>Safety note: </strong> {m.mission_data.safety_note}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
