import AnimatedNumber from './AnimatedNumber';

const colorMap = {
  emerald: {
    border: 'border-l-emerald-500',
    text: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    glow: 'shadow-emerald-500/10',
  },
  cyan: {
    border: 'border-l-cyan-500',
    text: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    glow: 'shadow-cyan-500/10',
  },
};

export default function MetricCard({
  icon: Icon,
  title,
  midValue,
  lowValue,
  highValue,
  unit,
  color = 'emerald',
}) {
  const palette = colorMap[color] || colorMap.emerald;

  return (
    <div
      className={`
        bg-slate-800 border border-slate-700 rounded-xl p-6
        border-l-4 ${palette.border}
        shadow-lg ${palette.glow}
      `}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${palette.bg}`}>
          {Icon && <Icon className={`w-5 h-5 ${palette.text}`} />}
        </div>
        <h3 className="text-slate-200 font-semibold text-sm uppercase tracking-wide">
          {title}
        </h3>
      </div>

      {/* Main value */}
      <div className="mb-2">
        <span className={`text-4xl font-bold ${palette.text}`}>
          <AnimatedNumber value={midValue} decimals={midValue % 1 !== 0 ? 1 : 0} prefix="~" />
        </span>
        <span className="text-slate-400 text-lg ml-2">{unit}</span>
      </div>

      {/* Range */}
      <p className="text-slate-500 text-sm">
        Estimated range:{' '}
        <span className="text-slate-400">
          {lowValue} – {highValue} {unit}
        </span>
      </p>
    </div>
  );
}
