import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepTitles: string[];
  onSelectStep?: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepTitles,
  onSelectStep,
}) => {
  return (
    <div className="w-full mb-8">
      {/* Mobile progress bar */}
      <div className="block sm:hidden">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-600 mb-2">
          <span className="text-nature-800 uppercase tracking-wider">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-stone-500">{stepTitles[currentStep - 1]}</span>
        </div>
        <div className="w-full bg-nature-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-nature-600 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Desktop step dots */}
      <div className="hidden sm:flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-stone-200 z-0" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-nature-600 z-0 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
        />

        {stepTitles.map((title, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <button
              key={title}
              type="button"
              disabled={!onSelectStep || stepNumber > currentStep}
              onClick={() => onSelectStep && stepNumber <= currentStep && onSelectStep(stepNumber)}
              className={`relative z-10 flex flex-col items-center group transition-all ${
                onSelectStep && stepNumber <= currentStep ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs transition-all duration-200 border-2 ${
                  isCompleted
                    ? 'bg-nature-700 border-nature-700 text-white shadow-sm'
                    : isCurrent
                    ? 'bg-white border-nature-700 text-nature-800 shadow-md ring-4 ring-nature-100 scale-110 font-bold'
                    : 'bg-stone-50 border-stone-300 text-stone-400'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : stepNumber}
              </div>
              <span
                className={`text-[11px] mt-2 font-medium tracking-tight whitespace-nowrap transition-colors ${
                  isCurrent
                    ? 'text-nature-900 font-bold'
                    : isCompleted
                    ? 'text-stone-700'
                    : 'text-stone-400'
                }`}
              >
                {title}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
