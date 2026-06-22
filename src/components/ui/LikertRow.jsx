export default function LikertRow({
  statement,
  selected,
  onChange,
  labels = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
}) {
  return (
    <div className="space-y-3">
      {/* Statement */}
      <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
        {statement}
      </p>

      {/* Likert buttons */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        {labels.map((label, i) => {
          const value = i + 1;
          const isSelected = selected === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => onChange(value)}
              className={`
                rounded-lg py-2.5 px-2 text-xs sm:text-sm font-medium
                border transition-all duration-200 cursor-pointer
                ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                }
              `}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
