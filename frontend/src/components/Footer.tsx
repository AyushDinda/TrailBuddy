import React from 'react';
import { Trees, ShieldCheck, Cpu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-nature-950 text-stone-300 border-t border-nature-900 mt-20 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Column 1: Philosophy */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-nature-800 flex items-center justify-center text-nature-200">
                <Trees className="w-4 h-4" />
              </div>
              <span className="font-bold text-white text-base tracking-tight">TrailBuddy</span>
            </div>
            <p className="text-stone-300 text-sm leading-relaxed mb-4">
              An open-source AI outdoor companion created for Hacktoberfest Week 1: "Touch Grass".
              Designed to get you off your screen and out into the living world.
            </p>
            <div className="inline-block p-2.5 rounded-lg bg-nature-900/80 border border-nature-800 text-xs font-mono text-nature-300">
              "Use the screen to plan. Then put the screen away."
            </div>
          </div>

          {/* Column 2: Tech & Open Weights */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
              Open-Weight AI Stack
            </h4>
            <ul className="space-y-2 text-sm text-stone-300">
              <li className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Qwen3 Open-Weight Model</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Local Ollama Inference (Zero Cloud Leak)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>FastAPI + SQLite Backend</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>React + Vite + Tailwind CSS</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation & Hacktoberfest */}
          <div>
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/create" className="text-stone-300 hover:text-white transition-colors">
                  Create an Outdoor Mission
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-stone-300 hover:text-white transition-colors">
                  Mission History & Reflections
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-stone-300 hover:text-white transition-colors">
                  About the Touch Grass Challenge
                </Link>
              </li>
              <li className="pt-2 text-xs text-stone-400">
                MIT License · Open Source · Free & Privacy First
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-nature-900 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} TrailBuddy. Built for outdoor lovers and screen-free minds.</p>
          <div className="flex items-center gap-1.5">
            <span>Powered by open weights & genuine fresh air</span>
            <Trees className="w-3.5 h-3.5 text-emerald-400 inline" />
          </div>
        </div>
      </div>
    </footer>
  );
};
