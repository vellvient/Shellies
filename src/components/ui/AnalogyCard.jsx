import AnimatedNumber from './AnimatedNumber';

export default function AnalogyCard({ icon, value, label, context }) {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center transition-transform duration-300 hover:scale-105 hover:border-slate-600 cursor-default">
      {/* Emoji icon */}
      <div className="text-4xl mb-3">{icon}</div>

      {/* Animated value */}
      <div className="text-3xl font-bold text-emerald-400 mb-1">
        <AnimatedNumber value={value} decimals={value % 1 !== 0 ? 1 : 0} prefix="~" />
      </div>

      {/* Label */}
      <p className="text-slate-200 font-semibold text-sm mb-2">{label}</p>

      {/* Context */}
      <p className="text-slate-500 text-xs leading-relaxed">{context}</p>
    </div>
  );
}
