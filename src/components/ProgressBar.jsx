import { Check } from 'lucide-react';

export default function ProgressBar({ currentStep, labels }) {
  const steps = [1, 2, 3, 4, 5];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between relative">
          {steps.map((step, i) => {
            const isCompleted = step < currentStep;
            const isCurrent = step === currentStep;
            const isFuture = step > currentStep;

            return (
              <div key={step} className="flex flex-col items-center relative z-10 flex-1">
                {/* Connector line (not on first step) */}
                {i > 0 && (
                  <div
                    className="absolute top-4 right-1/2 h-0.5 w-full -translate-y-1/2"
                    style={{ zIndex: -1 }}
                  >
                    <div
                      className={`h-full transition-colors duration-500 ${
                        step <= currentStep ? 'bg-emerald-500' : 'bg-slate-700'
                      }`}
                    />
                  </div>
                )}

                {/* Step circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    transition-all duration-300
                    ${
                      isCompleted
                        ? 'bg-emerald-500 text-slate-950'
                        : isCurrent
                        ? 'bg-transparent border-2 border-emerald-500 text-emerald-400 ring-4 ring-emerald-500/30 animate-pulse'
                        : 'bg-slate-700 text-slate-400'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" strokeWidth={3} />
                  ) : (
                    step
                  )}
                </div>

                {/* Label — hidden on mobile */}
                {labels && labels[i] && (
                  <span
                    className={`
                      hidden sm:block mt-2 text-xs text-center max-w-[80px] leading-tight
                      ${
                        isCompleted || isCurrent
                          ? 'text-emerald-400 font-medium'
                          : 'text-slate-500'
                      }
                    `}
                  >
                    {labels[i]}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
