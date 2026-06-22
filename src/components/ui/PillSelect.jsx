export default function PillSelect({ options, selected, onChange, columns }) {
  const gridStyle = columns
    ? { display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, gap: '0.5rem' }
    : undefined;

  return (
    <div
      className={columns ? '' : 'flex flex-wrap gap-2'}
      style={gridStyle}
    >
      {options.map((option) => {
        const isSelected = selected === option.value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              rounded-xl py-3 px-4 font-medium text-sm
              border transition-all duration-200 cursor-pointer
              flex items-center justify-center gap-2
              ${
                isSelected
                  ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-500 hover:text-slate-200'
              }
            `}
          >
            {option.icon && <span className="text-lg">{option.icon}</span>}
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
