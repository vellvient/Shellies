import { useState, useEffect } from 'react';

const PERSONA_DATA = {
  searcher: {
    icon: '🔍',
    name: 'The Searcher',
    color: 'amber',
    description:
      'You treat AI like a search engine — broad, single prompts with high regeneration and low context. This style has the highest token overhead, meaning more energy per useful answer.',
  },
  automator: {
    icon: '⚙️',
    name: 'The Automator',
    color: 'cyan',
    description:
      "You use AI regularly with moderate efficiency. You refine prompts sometimes but haven't fully optimised your workflow yet. There's room to reduce your footprint with small habit changes.",
  },
  director: {
    icon: '🎯',
    name: 'The Director',
    color: 'emerald',
    description:
      "You're a strategic, context-aware prompter. Iterative, precise, and efficient — your style generates the least environmental waste per useful output.",
  },
};

const COLOR_MAP = {
  amber: {
    border: 'border-amber-500',
    text: 'text-amber-400',
    bg: 'bg-amber-500',
    bgMuted: 'bg-amber-500/20',
    shadow: 'shadow-amber-500/30',
    ring: 'ring-amber-500/40',
  },
  cyan: {
    border: 'border-cyan-500',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500',
    bgMuted: 'bg-cyan-500/20',
    shadow: 'shadow-cyan-500/30',
    ring: 'ring-cyan-500/40',
  },
  emerald: {
    border: 'border-emerald-500',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500',
    bgMuted: 'bg-emerald-500/20',
    shadow: 'shadow-emerald-500/30',
    ring: 'ring-emerald-500/40',
  },
};

export default function PersonaBadge({ persona, aeiTotal }) {
  const [glowing, setGlowing] = useState(true);
  const data = PERSONA_DATA[persona];
  const colors = COLOR_MAP[data.color];

  // AEI gauge: scale 0-25
  const gaugePercent = Math.min((aeiTotal / 25) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => setGlowing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`
        w-full bg-slate-800 rounded-xl p-6 sm:p-8 border-2
        ${colors.border}
        ${glowing ? 'animate-glow-pulse' : ''}
        transition-shadow duration-500
      `}
      style={
        glowing
          ? {
              boxShadow: `0 0 30px ${
                data.color === 'amber'
                  ? 'rgba(245, 158, 11, 0.3)'
                  : data.color === 'cyan'
                  ? 'rgba(6, 182, 212, 0.3)'
                  : 'rgba(16, 185, 129, 0.3)'
              }`,
            }
          : undefined
      }
    >
      {/* Icon and Name */}
      <div className="text-center mb-5">
        <div className="text-5xl mb-3">{data.icon}</div>
        <h2 className={`text-2xl font-bold ${colors.text}`}>{data.name}</h2>
      </div>

      {/* Description */}
      <p className="text-slate-400 text-sm sm:text-base leading-relaxed text-center mb-6">
        {data.description}
      </p>

      {/* AEI Gauge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>AEI Score</span>
          <span className={`font-semibold ${colors.text}`}>{aeiTotal} / 25</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${colors.bg} transition-all duration-1000 ease-out`}
            style={{ width: `${gaugePercent}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-600">
          <span>0</span>
          <span>5</span>
          <span>10</span>
          <span>15</span>
          <span>20</span>
          <span>25</span>
        </div>
      </div>
    </div>
  );
}
