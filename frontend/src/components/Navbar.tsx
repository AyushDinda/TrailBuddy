import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Trees, Menu, X, AlertCircle } from 'lucide-react';
import { fetchHealth, HealthStatus } from '../services/api';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const check = async () => {
      try {
        const data = await fetchHealth();
        if (isMounted) {
          setHealth(data);
          setIsBackendHealthy(true);
        }
      } catch {
        if (isMounted) {
          setIsBackendHealthy(false);
        }
      }
    };
    check();
    const interval = setInterval(check, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Create Mission', path: '/create' },
    { name: 'History', path: '/history' },
    { name: 'About & Open AI', path: '/about' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-nature-900 group transition-all"
            aria-label="TrailBuddy Home"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-nature-700 to-nature-900 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Trees className="w-5 h-5 text-nature-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-nature-950 font-sans">
                TrailBuddy
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-nature-700">
                Touch Grass AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'bg-nature-100 text-nature-900 font-semibold shadow-xs'
                    : 'text-stone-600 hover:text-nature-900 hover:bg-stone-100/80'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* AI Status Badge */}
          <div className="hidden lg:flex items-center gap-3">
            {isBackendHealthy === true ? (
              <div
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-nature-50 border border-nature-200 text-nature-800"
                title={`Model: ${health?.ollama_model || 'qwen3'} (Mock: ${health?.mock_ai ? 'enabled' : 'disabled'})`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-mono text-[11px]">
                  {health?.mock_ai ? 'Mock AI Mode' : `Local ${health?.ollama_model || 'Qwen3'}`}
                </span>
              </div>
            ) : isBackendHealthy === false ? (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 border border-amber-200 text-amber-800">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[11px]">Backend Connecting...</span>
              </div>
            ) : null}

            <Link
              to="/create"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-nature-800 hover:bg-nature-900 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
            >
              <Compass className="w-4 h-4 text-nature-300" />
              <span>New Mission</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-700 hover:bg-stone-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-surface px-4 pt-2 pb-4 space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-nature-100 text-nature-900 font-semibold'
                  : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              {health?.mock_ai ? 'Mock AI Mode' : `Local ${health?.ollama_model || 'Qwen3'}`}
            </span>
            <Link
              to="/create"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-1.5 rounded-md bg-nature-800 text-white text-xs font-semibold"
            >
              Start Mission
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
