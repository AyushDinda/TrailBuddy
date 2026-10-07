import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Compass, 
  Trees, 
  PhoneOff, 
  Cpu, 
  ShieldCheck, 
  ArrowRight, 
  CloudSun, 
  Footprints, 
  Sparkles,
  Timer
} from 'lucide-react';
import { NatureBadge } from '../components/NatureBadge';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-16 bg-gradient-to-b from-nature-50/70 via-canvas to-canvas border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-nature-100/90 border border-nature-200 text-nature-900 text-xs font-semibold tracking-wide shadow-xs">
                <span className="w-2 h-2 rounded-full bg-nature-600 animate-ping" />
                <span>HACKTOBERFEST 2026 · "TOUCH GRASS" CHALLENGE</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-nature-950 font-sans leading-[1.1]">
                  Use your screen to plan. <br />
                  <span className="text-nature-700 italic font-serif font-normal">
                    Then put it away.
                  </span>
                </h1>
                <p className="text-lg sm:text-xl text-stone-600 max-w-xl font-normal leading-relaxed">
                  An open-source AI outdoor companion that creates personalized missions designed to get you outside and away from digital noise.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/create"
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-nature-800 hover:bg-nature-900 text-white font-semibold text-base shadow-lifted hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  <Compass className="w-5 h-5 text-nature-300" />
                  <span>Create My Mission</span>
                  <ArrowRight className="w-4 h-4 text-white/70" />
                </Link>

                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-base border border-stone-200 shadow-card hover:border-stone-300 transition-all"
                >
                  <span>How It Works</span>
                </a>
              </div>

              {/* Trust & Ethics Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-4 text-xs font-medium text-stone-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-nature-600" />
                  <span>100% Local Inference (Ollama + Qwen3)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <PhoneOff className="w-4 h-4 text-nature-600" />
                  <span>Screen-Free by Design</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Trees className="w-4 h-4 text-nature-600" />
                  <span>Free & Open Source</span>
                </div>
              </div>
            </div>

            {/* Right Column: Nature Illustration & Live Sample Card */}
            <div className="lg:col-span-5 relative">
              {/* CSS Art Graphic: Ambient Outdoor Landscape Card */}
              <div className="relative mx-auto max-w-md bg-white rounded-3xl p-6 shadow-lifted border border-stone-200/90 overflow-hidden">
                {/* Visual Sun and Mountain Crest Illustration built entirely with CSS */}
                <div className="h-44 w-full rounded-2xl bg-gradient-to-b from-skycalm-100 via-nature-100/60 to-nature-200 relative overflow-hidden mb-5 border border-nature-100">
                  {/* Glowing sun */}
                  <div className="absolute top-4 right-8 w-14 h-14 rounded-full bg-gradient-to-tr from-amber-300 to-amber-200 shadow-lg shadow-amber-200/50 opacity-90" />
                  
                  {/* Subtle Cloud */}
                  <div className="absolute top-7 left-8 bg-white/70 backdrop-blur-xs rounded-full px-3 py-1 flex items-center gap-1 text-[11px] font-semibold text-stone-600 shadow-xs">
                    <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                    <span>Pure Outdoor Air</span>
                  </div>

                  {/* Geometric Hill Layer 1 */}
                  <div className="absolute -bottom-10 -left-12 w-64 h-40 rounded-[100%] bg-nature-400/40 transform rotate-6" />
                  {/* Geometric Hill Layer 2 */}
                  <div className="absolute -bottom-14 -right-10 w-72 h-48 rounded-[100%] bg-nature-600/70 transform -rotate-12" />
                  {/* Geometric Hill Layer 3 Front */}
                  <div className="absolute -bottom-16 left-6 w-80 h-44 rounded-[100%] bg-nature-800" />

                  {/* Stylized CSS Pine Trees */}
                  <div className="absolute bottom-4 left-14 text-emerald-200">
                    <Trees className="w-7 h-7 fill-nature-900 text-nature-950" />
                  </div>
                  <div className="absolute bottom-5 left-24 text-emerald-100">
                    <Trees className="w-9 h-9 fill-nature-900 text-nature-950" />
                  </div>
                  <div className="absolute bottom-3 right-16 text-emerald-100">
                    <Trees className="w-8 h-8 fill-nature-900 text-nature-950" />
                  </div>
                  
                  {/* Walking Path Motif */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-8 border-b-2 border-dashed border-amber-200/70" />
                </div>

                {/* Sample Mission Snippet */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-nature-800">
                      Sample Generated Mission
                    </span>
                    <NatureBadge type="screen-free" value={40} />
                  </div>

                  <h3 className="font-bold text-lg text-stone-900 font-sans">
                    The Hidden Details Walk
                  </h3>
                  <p className="text-xs text-stone-600 italic">
                    "Slow down and notice what you normally miss."
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <NatureBadge type="duration" value={60} />
                    <NatureBadge type="difficulty" value="Easy" />
                    <NatureBadge type="activity" value="Walking" />
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Timer className="w-3.5 h-3.5 text-nature-700" />
                      Minimal Screen Mode
                    </span>
                    <span className="font-mono text-nature-800 font-semibold">Ready in 2s</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-nature-700">
            Why TrailBuddy Exists
          </span>
          <h2 className="text-3xl font-bold text-stone-900 mt-1">
            Built to liberate you from digital inertia
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            Most technology wants you to stay glued to your screen forever. TrailBuddy does the exact opposite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: LOCAL AI */}
          <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-card hover:shadow-soft transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-nature-100 flex items-center justify-center text-nature-800">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">LOCAL AI</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Your mission is generated locally using an open-weight AI model. Zero data leaves your computer, zero subscriptions, and complete offline sovereignty.
            </p>
            <div className="pt-2 text-xs font-mono text-nature-700 font-semibold flex items-center gap-1">
              <span>Qwen3 + Ollama</span>
            </div>
          </div>

          {/* Card 2: REAL-WORLD MISSIONS */}
          <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-card hover:shadow-soft transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-earth-100 flex items-center justify-center text-earth-800">
              <Footprints className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">REAL-WORLD MISSIONS</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              Every mission is designed to be completed outside the screen. No endless chat bubbles or infinite feeds — just concrete sensory adventures in the fresh air.
            </p>
            <div className="pt-2 text-xs font-mono text-earth-800 font-semibold flex items-center gap-1">
              <span>Physical Presence First</span>
            </div>
          </div>

          {/* Card 3: SCREEN-FREE BY DESIGN */}
          <div className="bg-white rounded-2xl p-7 border border-stone-200/80 shadow-card hover:shadow-soft transition-all space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <PhoneOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900 tracking-tight">SCREEN-FREE BY DESIGN</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              The app intentionally becomes minimal once your mission begins. The countdown runs in the background so you can safely tuck your phone away in your pocket.
            </p>
            <div className="pt-2 text-xs font-mono text-emerald-800 font-semibold flex items-center gap-1">
              <span>Touch Grass Philosophy</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-surface rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-card">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-nature-700">
              The TrailBuddy Flow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              How You Escape The Screen
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            <div className="text-center space-y-2 p-4">
              <div className="w-10 h-10 rounded-full bg-nature-700 text-white font-bold flex items-center justify-center mx-auto text-sm">
                1
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Tell Your Availability</h4>
              <p className="text-xs text-stone-600">Pick your time, desired activity, mood, and outdoor interests.</p>
            </div>

            <div className="text-center space-y-2 p-4">
              <div className="w-10 h-10 rounded-full bg-nature-700 text-white font-bold flex items-center justify-center mx-auto text-sm">
                2
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Local AI Generates</h4>
              <p className="text-xs text-stone-600">Qwen3 crafts a tailored mission with observation steps and a screen-free goal.</p>
            </div>

            <div className="text-center space-y-2 p-4">
              <div className="w-10 h-10 rounded-full bg-nature-700 text-white font-bold flex items-center justify-center mx-auto text-sm">
                3
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Screen Goes Minimal</h4>
              <p className="text-xs text-stone-600">Press Start, stow your device, and immerse yourself in real weather and soil.</p>
            </div>

            <div className="text-center space-y-2 p-4">
              <div className="w-10 h-10 rounded-full bg-nature-700 text-white font-bold flex items-center justify-center mx-auto text-sm">
                4
              </div>
              <h4 className="font-bold text-stone-900 text-sm">Reflect & Save</h4>
              <p className="text-xs text-stone-600">Return refreshed. Record what you noticed and archive it to your offline history.</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/create"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-nature-800 hover:bg-nature-900 text-white font-semibold text-sm shadow-sm transition-all"
            >
              <span>Begin Your Outdoor Quest</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Powered By Open-Source AI Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-nature-900 text-white rounded-3xl p-8 sm:p-12 shadow-lifted relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-nature-700/30 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-nature-800 border border-nature-700 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Powered by Open-Source AI</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-4">
              No Big Tech Cloud APIs. Fully Open-Weight & Local.
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6">
              TrailBuddy pairs the power of modern open weights with complete local control. It communicates directly with Ollama on your machine without telemetry or cloud dependency.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              <div className="p-3.5 rounded-xl bg-nature-950/60 border border-nature-800">
                <span className="text-xs font-mono text-emerald-400 block font-semibold">Model</span>
                <span className="text-sm font-bold text-white">Qwen3 Open-Weight</span>
              </div>
              <div className="p-3.5 rounded-xl bg-nature-950/60 border border-nature-800">
                <span className="text-xs font-mono text-emerald-400 block font-semibold">Engine</span>
                <span className="text-sm font-bold text-white">Ollama (Port 11434)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-nature-950/60 border border-nature-800">
                <span className="text-xs font-mono text-emerald-400 block font-semibold">Backend</span>
                <span className="text-sm font-bold text-white">FastAPI + SQLite</span>
              </div>
              <div className="p-3.5 rounded-xl bg-nature-950/60 border border-nature-800">
                <span className="text-xs font-mono text-emerald-400 block font-semibold">Frontend</span>
                <span className="text-sm font-bold text-white">React + Vite + Tailwind</span>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                to="/about"
                className="text-xs font-semibold text-emerald-300 hover:text-emerald-200 underline underline-offset-4 flex items-center gap-1"
              >
                <span>Read the full open-source architecture & challenge alignment</span>
                <ArrowRight className="w-3.5 h-3.5 inline" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
