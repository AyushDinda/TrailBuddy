import React from 'react';
import { 
  Trees, 
  Cpu, 
  ShieldCheck, 
  PhoneOff, 
  Code2, 
  Compass 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Page Hero */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-nature-100 text-nature-800 text-xs font-bold uppercase tracking-wider">
          <Trees className="w-3.5 h-3.5" />
          <span>Hacktoberfest 2026 · Week 1 Challenge</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-sans">
          The "Touch Grass" Philosophy
        </h1>

        <p className="text-base text-stone-600 leading-relaxed font-serif italic">
          "Build something with open-weight models or open-source AI that gets people off the screen and into the world."
        </p>
      </div>

      {/* Core Mission Banner */}
      <div className="bg-nature-900 text-white rounded-3xl p-8 sm:p-10 shadow-lifted space-y-4 relative overflow-hidden">
        <div className="text-emerald-400 font-mono text-xs uppercase tracking-widest font-semibold">
          Core Tenet
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif leading-snug">
          USE THE SCREEN TO PLAN.<br />
          THEN PUT THE SCREEN AWAY AND GO OUTSIDE.
        </h2>
        <p className="text-stone-300 text-sm leading-relaxed max-w-2xl">
          Most modern apps are engineered to maximize time-on-device through endless notifications, algorithmic feeds, and psychological hooks. TrailBuddy measures its success in the opposite metric: <strong>how quickly and effectively it gets you outdoors into the living world.</strong>
        </p>
      </div>

      {/* Why Open-Weight AI & Ollama Matters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-3xl border border-stone-200/90 p-7 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-nature-100 flex items-center justify-center text-nature-800">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Why Open-Weight Qwen3?</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Qwen3 is an open-weight foundation model offering remarkable instruction-following and JSON generation capabilities. Because the weights are freely available and hostable via Ollama, TrailBuddy requires zero closed proprietary cloud APIs.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 p-7 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-earth-100 flex items-center justify-center text-earth-800">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">100% Local Inference & Privacy</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Your location cues, mood, and outdoor reflections remain strictly on your machine. Ollama runs inference on localhost port 11434. No tracking cookies, no telemetry, and no telemetry data monetization.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 p-7 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
            <PhoneOff className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Screen-Free by Design</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            The moment you press "Start Mission", the UI drops all distractions and collapses to a clean countdown timer. It reminds you to tuck the phone in your pocket, listen to wind shifts, observe flora, and be present.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-stone-200/90 p-7 shadow-card space-y-3">
          <div className="w-10 h-10 rounded-xl bg-skycalm-100 flex items-center justify-center text-skycalm-700">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-stone-900">Developer Freedom</h3>
          <p className="text-xs text-stone-600 leading-relaxed">
            Built with modular architecture. Developers can easily swap Qwen3 for other open-weight models (Llama 3, Mistral, Gemma 2, Phi 3) simply by updating <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">OLLAMA_MODEL</code> in the backend config.
          </p>
        </div>
      </div>

      {/* Architecture Section */}
      <div className="bg-canvas border border-stone-200 rounded-3xl p-8 space-y-6">
        <h3 className="text-xl font-bold text-stone-900">Architecture Pipeline</h3>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 font-mono text-xs text-stone-700 overflow-x-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center">
            <div className="p-3 bg-nature-50 rounded-xl border border-nature-200 w-full">
              <span className="font-bold text-nature-900 block">Frontend</span>
              <span className="text-[11px] text-stone-500">React + TS + Vite + Tailwind</span>
            </div>
            <span className="text-stone-400 font-bold">→</span>
            <div className="p-3 bg-nature-50 rounded-xl border border-nature-200 w-full">
              <span className="font-bold text-nature-900 block">Backend</span>
              <span className="text-[11px] text-stone-500">FastAPI + SQLite DB</span>
            </div>
            <span className="text-stone-400 font-bold">→</span>
            <div className="p-3 bg-nature-50 rounded-xl border border-nature-200 w-full">
              <span className="font-bold text-nature-900 block">Inference Engine</span>
              <span className="text-[11px] text-stone-500">Ollama (localhost:11434)</span>
            </div>
            <span className="text-stone-400 font-bold">→</span>
            <div className="p-3 bg-nature-50 rounded-xl border border-nature-200 w-full">
              <span className="font-bold text-nature-900 block">Open Weights</span>
              <span className="text-[11px] text-stone-500">Qwen3 Open-Weight Model</span>
            </div>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          The FastAPI backend acts as the secure orchestration layer between the browser and Ollama. It applies strict JSON schema enforcement, sanitizes requests, and provides fallback deterministic generation for development or testing via <code className="bg-stone-100 px-1 py-0.5 rounded font-mono">MOCK_AI=true</code>.
        </p>
      </div>

      {/* Call to Action */}
      <div className="text-center pt-4">
        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-nature-800 hover:bg-nature-900 text-white font-bold text-sm shadow-lifted hover:shadow-lg transition-all"
        >
          <Compass className="w-5 h-5 text-nature-300" />
          <span>Launch Your First Outdoor Mission</span>
        </Link>
      </div>
    </div>
  );
};
