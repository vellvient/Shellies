import { useMemo } from 'react';

export default function PeerBenchmarkChart({ userPrompts, sandboxData }) {
  const { average, top20 } = useMemo(() => {
    if (!sandboxData || sandboxData.length === 0) {
      return { average: 0, top20: 0 };
    }

    const prompts = sandboxData.map((d) => d.prompts ?? d.promptsPerDay ?? d.value ?? 0);
    const sum = prompts.reduce((a, b) => a + b, 0);
    const avg = sum / prompts.length;

    // Top 20% = 80th percentile (lowest prompts = most efficient)
    const sorted = [...prompts].sort((a, b) => a - b);
    const p20Index = Math.floor(sorted.length * 0.2);
    const t20 = sorted[p20Index] || sorted[0];

    return { average: Math.round(avg), top20: Math.round(t20) };
  }, [sandboxData]);

  // Scale for the bar — find max of all 3 values, add 20% padding
  const maxVal = Math.max(userPrompts, average, top20, 1);
  const scaleMax = Math.ceil(maxVal * 1.3);

  const toPercent = (val) => Math.min((val / scaleMax) * 100, 100);

  const markers = [
    {
      label: 'Study Average',
      value: average,
      color: 'bg-slate-500',
      textColor: 'text-slate-400',
      dotColor: 'bg-slate-400',
    },
    {
      label: 'You',
      value: userPrompts,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400',
      dotColor: 'bg-emerald-500',
    },
    {
      label: 'Top 20%',
      value: top20,
      color: 'bg-amber-500',
      textColor: 'text-amber-400',
      dotColor: 'bg-amber-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Horizontal scale bar */}
      <div className="relative">
        {/* Track */}
        <div className="h-3 bg-slate-700 rounded-full relative overflow-visible">
          {/* Markers on the track */}
          {markers.map((marker) => (
            <div
              key={marker.label}
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
              style={{ left: `${toPercent(marker.value)}%` }}
            >
              <div
                className={`w-5 h-5 rounded-full ${marker.dotColor} border-2 border-slate-900 shadow-lg`}
              />
            </div>
          ))}
        </div>

        {/* Labels below */}
        <div className="relative h-14 mt-3">
          {markers.map((marker) => (
            <div
              key={marker.label}
              className="absolute -translate-x-1/2 text-center"
              style={{ left: `${toPercent(marker.value)}%` }}
            >
              <div className={`text-sm font-bold ${marker.textColor}`}>
                {marker.value}
              </div>
              <div className="text-[10px] text-slate-500 whitespace-nowrap">
                {marker.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-4">
        {markers.map((marker) => (
          <div key={marker.label} className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${marker.dotColor}`} />
            <span className="text-xs text-slate-400">
              {marker.label}: <span className={marker.textColor}>{marker.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
