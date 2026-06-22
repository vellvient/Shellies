export default function SliderInput({
  value,
  onChange,
  min = 1,
  max = 10,
  leftLabel,
  rightLabel,
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full space-y-4">
      {/* Value indicator */}
      <div className="flex justify-center">
        <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center text-slate-950 text-xl font-bold shadow-lg shadow-emerald-500/25">
          {value}
        </div>
      </div>

      {/* Slider track */}
      <div className="relative px-1">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full"
        />
        {/* Fill overlay for left portion */}
        <div
          className="absolute top-1/2 left-1 h-2 rounded-l-full bg-emerald-500/30 pointer-events-none -translate-y-1/2"
          style={{ width: `calc(${percentage}% - 4px)` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-slate-400 px-1">
        <span>{leftLabel || min}</span>
        <span>{rightLabel || max}</span>
      </div>
    </div>
  );
}
