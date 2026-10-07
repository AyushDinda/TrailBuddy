import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  Trees, 
  Check, 
  MapPin, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
import { StepIndicator } from '../components/StepIndicator';
import { generateMission } from '../services/api';
import { savePreviewMission } from '../utils/storage';
import { MissionGenerateRequest } from '../types/mission';

const DURATION_OPTIONS = [
  { label: '15 minutes', value: 15, hint: 'Quick screen break' },
  { label: '30 minutes', value: 30, hint: 'Sensory refresh' },
  { label: '45 minutes', value: 45, hint: 'Good walk & observe' },
  { label: '60 minutes', value: 60, hint: 'Standard outdoor outing' },
  { label: '90 minutes', value: 90, hint: 'Immersive exploration' },
  { label: '2+ hours', value: 120, hint: 'Full wilderness immersion' },
];

const ACTIVITY_OPTIONS = [
  'Walking',
  'Running',
  'Hiking',
  'Nature Exploration',
  'Photography Walk',
  'Bird Watching',
  'Gardening',
  'Mindful Outdoor Time',
  'Free Exploration',
];

const MOOD_OPTIONS = [
  'Relaxing',
  'Adventurous',
  'Curious',
  'Energetic',
  'Peaceful',
  'Social',
  'Challenging',
];

const DIFFICULTY_OPTIONS = [
  { label: 'Easy', desc: 'Gentle, accessible pace without strenuous physical strain' },
  { label: 'Moderate', desc: 'Active cadence with some intentional challenge or distance' },
  { label: 'Challenging', desc: 'Higher intensity, ambitious pace or terrain engagement' },
];

const INTEREST_OPTIONS = [
  'Nature',
  'Photography',
  'Wildlife',
  'Plants',
  'Architecture',
  'Local Exploration',
  'Fitness',
  'Mindfulness',
  'Discovery',
];

const LOADING_MESSAGES = [
  'TrailBuddy is planning your adventure...',
  'Asking your local AI...',
  'Creating something worth leaving the screen for...',
  'Calibrating your sensory challenges...',
  'Preparing your offline outdoor mission...',
];

export const CreateMissionPage: React.FC = () => {
  const navigate = useNavigate();

  // Multi-step form state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const stepTitles = ['Time', 'Activity', 'Mood', 'Difficulty', 'Interests', 'Context'];

  // Form selections
  const [duration, setDuration] = useState<number>(30);
  const [activity, setActivity] = useState<string>('Walking');
  const [mood, setMood] = useState<string>('Curious');
  const [difficulty, setDifficulty] = useState<string>('Easy');
  const [interests, setInterests] = useState<string[]>(['Nature', 'Mindfulness']);
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [locationContext, setLocationContext] = useState<string>('');

  // Generation state
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cycle loading messages smoothly
  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const toggleInterest = (item: string) => {
    if (interests.includes(item)) {
      setInterests(interests.filter((i) => i !== item));
    } else {
      setInterests([...interests, item]);
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const payload: MissionGenerateRequest = {
      duration,
      activity,
      mood,
      difficulty,
      interests,
      additional_context: additionalContext.trim() || undefined,
      location_context: locationContext.trim() || undefined,
    };

    try {
      const generatedMission = await generateMission(payload);
      savePreviewMission(generatedMission, payload);
      navigate('/preview');
    } catch (err: any) {
      console.error('Mission generation failed', err);
      setErrorMessage(
        err.message ||
          "TrailBuddy's local AI is unavailable. Start Ollama and make sure the configured model is installed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      {/* Top Heading */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-nature-700">
          Touch Grass Planner
        </span>
        <h1 className="text-3xl font-extrabold text-stone-900 mt-1">
          Plan Your Outdoor Mission
        </h1>
        <p className="text-stone-600 text-sm mt-1 max-w-md mx-auto">
          Configure your preferences in 30 seconds, then put your screen away and experience the world.
        </p>
      </div>

      {/* Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        totalSteps={totalSteps}
        stepTitles={stepTitles}
        onSelectStep={(step) => setCurrentStep(step)}
      />

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-6 sm:p-10 shadow-card relative">
        {loading ? (
          /* Loading Animation View */
          <div className="py-16 text-center space-y-6">
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-nature-200 border-t-nature-700 animate-spin" />
              <Trees className="w-8 h-8 text-nature-800 animate-nature-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-900 transition-all duration-300">
                {LOADING_MESSAGES[loadingMessageIndex]}
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                Running locally via Qwen3 & Ollama · Private & Offline
              </p>
            </div>

            <div className="inline-block p-4 rounded-xl bg-nature-50 border border-nature-200 text-xs text-stone-600 max-w-md">
              "Your screen time is almost over. Get ready to step into real weather and natural light."
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error Notification */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-sm flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold">Local AI Notice</p>
                  <p className="text-xs leading-relaxed text-amber-800">{errorMessage}</p>
                  <p className="text-[11px] text-amber-700 pt-1">
                    Tip: If running without Ollama, you can set <code className="font-mono bg-amber-100 px-1 rounded">MOCK_AI=true</code> in your backend .env file.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 1: DURATION */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    How much time do you have?
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Select the window you want to dedicate to outdoor exploration today.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {DURATION_OPTIONS.map((opt) => {
                    const isSelected = duration === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setDuration(opt.value)}
                        className={`p-4 rounded-2xl text-left border-2 transition-all flex flex-col justify-between ${
                          isSelected
                            ? 'border-nature-700 bg-nature-50/70 text-nature-950 shadow-sm'
                            : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <Clock className={`w-4 h-4 ${isSelected ? 'text-nature-700' : 'text-stone-400'}`} />
                          {isSelected && <Check className="w-4 h-4 text-nature-700" />}
                        </div>
                        <span className="font-bold text-base block">{opt.label}</span>
                        <span className="text-[11px] text-stone-500 mt-0.5">{opt.hint}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: ACTIVITY */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    What do you want to do?
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Choose an outdoor activity that matches your energy and intention.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {ACTIVITY_OPTIONS.map((item) => {
                    const isSelected = activity === item;
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setActivity(item)}
                        className={`p-3.5 rounded-2xl text-left border-2 font-medium text-sm transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-nature-700 bg-nature-50 text-nature-950 font-bold shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                        }`}
                      >
                        <span>{item}</span>
                        {isSelected && <Check className="w-4 h-4 text-nature-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 3: MOOD */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    What's your mood?
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    TrailBuddy shapes the nature tasks and observations around your headspace.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {MOOD_OPTIONS.map((m) => {
                    const isSelected = mood === m;
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMood(m)}
                        className={`p-3.5 rounded-2xl text-left border-2 font-medium text-sm transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-nature-700 bg-nature-50 text-nature-950 font-bold shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                        }`}
                      >
                        <span>{m}</span>
                        {isSelected && <Check className="w-4 h-4 text-nature-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 4: DIFFICULTY */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    How difficult should it be?
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Set the physical and attentional intensity of your mission.
                  </p>
                </div>

                <div className="space-y-3">
                  {DIFFICULTY_OPTIONS.map((item) => {
                    const isSelected = difficulty === item.label;
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setDifficulty(item.label)}
                        className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-nature-700 bg-nature-50 text-nature-950 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white text-stone-800'
                        }`}
                      >
                        <div>
                          <span className="font-bold text-base block">{item.label}</span>
                          <span className="text-xs text-stone-500 mt-0.5 block">{item.desc}</span>
                        </div>
                        {isSelected && <Check className="w-5 h-5 text-nature-700 shrink-0 ml-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5: INTERESTS */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    What are you interested in?
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Select multiple areas of curiosity for your observation challenges.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {INTEREST_OPTIONS.map((item) => {
                    const isSelected = interests.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleInterest(item)}
                        className={`p-3 rounded-2xl text-left border-2 font-medium text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-nature-700 bg-nature-50 text-nature-950 font-bold shadow-xs'
                            : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                        }`}
                      >
                        <span>{item}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-nature-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 6: CONTEXT & GENERATION */}
            {currentStep === 6 && (
              <div className="space-y-5 animate-in fade-in duration-200">
                <div>
                  <h2 className="text-xl font-bold text-stone-900">
                    Anything else?
                  </h2>
                  <p className="text-xs text-stone-500 mt-1">
                    Add optional notes so the AI tailors the mission specifically for you.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Tell TrailBuddy anything it should know...
                    </label>
                    <textarea
                      rows={3}
                      value={additionalContext}
                      onChange={(e) => setAdditionalContext(e.target.value)}
                      placeholder='e.g., "I want something relaxing." or "I want to explore somewhere I haven&#39;t noticed before." or "I want to take photos."'
                      className="w-full px-4 py-3 rounded-2xl border border-stone-200 focus:outline-hidden focus:border-nature-600 focus:ring-2 focus:ring-nature-100 text-sm text-stone-800 placeholder:text-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                      Surrounding Environment (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="text"
                        value={locationContext}
                        onChange={(e) => setLocationContext(e.target.value)}
                        placeholder="e.g. Local park, quiet suburb, wooded trail, lake shore"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-stone-200 focus:outline-hidden focus:border-nature-600 focus:ring-2 focus:ring-nature-100 text-sm text-stone-800 placeholder:text-stone-400"
                      />
                    </div>
                    <span className="text-[11px] text-stone-400 block mt-1">
                      No GPS coordinates or personal tracking required. Complete privacy.
                    </span>
                  </div>

                  {/* Summary of selections */}
                  <div className="p-4 rounded-2xl bg-canvas border border-stone-200 text-xs text-stone-600 space-y-1">
                    <span className="font-bold text-stone-800 block mb-1">Your Configuration Summary:</span>
                    <p>• {duration} minutes · {activity} · {mood} mood · {difficulty} difficulty</p>
                    <p>• Interests: {interests.length > 0 ? interests.join(', ') : 'Open exploration'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation & Submit Buttons */}
            <div className="pt-6 border-t border-stone-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 text-sm font-semibold transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-nature-800 hover:bg-nature-900 text-white text-sm font-semibold shadow-sm transition-all"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-nature-800 hover:bg-nature-900 text-white text-sm font-bold shadow-lifted hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Sparkles className="w-4 h-4 text-nature-300" />
                  <span>Generate My Mission</span>
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
