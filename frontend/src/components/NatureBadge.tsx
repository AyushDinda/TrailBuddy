import React from 'react';
import { Clock, Compass, Shield, PhoneOff, Sparkles } from 'lucide-react';

interface NatureBadgeProps {
  type: 'duration' | 'activity' | 'difficulty' | 'screen-free' | 'mood';
  value: string | number;
  className?: string;
}

export const NatureBadge: React.FC<NatureBadgeProps> = ({ type, value, className = '' }) => {
  const getBadgeStyle = () => {
    switch (type) {
      case 'duration':
        return {
          icon: <Clock className="w-3.5 h-3.5 text-nature-700" />,
          bg: 'bg-nature-100/80 text-nature-900 border-nature-200',
          label: `${value} MIN`,
        };
      case 'activity':
        return {
          icon: <Compass className="w-3.5 h-3.5 text-earth-700" />,
          bg: 'bg-earth-100 text-earth-900 border-earth-200',
          label: String(value).toUpperCase(),
        };
      case 'difficulty':
        return {
          icon: <Shield className="w-3.5 h-3.5 text-amber-700" />,
          bg: 'bg-amber-50 text-amber-900 border-amber-200',
          label: String(value).toUpperCase(),
        };
      case 'screen-free':
        return {
          icon: <PhoneOff className="w-3.5 h-3.5 text-nature-700" />,
          bg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          label: `${value} MIN SCREEN-FREE`,
        };
      case 'mood':
        return {
          icon: <Sparkles className="w-3.5 h-3.5 text-skycalm-700" />,
          bg: 'bg-skycalm-100 text-skycalm-700 border-skycalm-200',
          label: String(value).toUpperCase(),
        };
    }
  };

  const { icon, bg, label } = getBadgeStyle();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wider border shadow-sm transition-all ${bg} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};
