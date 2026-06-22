import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-slate-200 text-sm font-medium">
        {payload[0].payload.name}: {payload[0].value}/10
      </p>
    </div>
  );
};

export default function ConcernDeltaChart({ preConcern, postConcern }) {
  const delta = postConcern - preConcern;

  const data = [
    { name: 'Before', value: preConcern },
    { name: 'After', value: postConcern },
  ];

  const barColors = ['#64748b', '#10b981']; // slate-500, emerald-500

  let deltaMessage = '';
  let deltaColor = '';
  let deltaEmoji = '';

  if (delta > 0) {
    deltaMessage = `Your concern increased by +${delta} point${delta !== 1 ? 's' : ''}`;
    deltaColor = 'text-emerald-400';
    deltaEmoji = '📈';
  } else if (delta === 0) {
    deltaMessage = 'Your concern level stayed the same';
    deltaColor = 'text-amber-400';
    deltaEmoji = '➡️';
  } else {
    deltaMessage = `Your concern decreased by ${delta} point${delta !== -1 ? 's' : ''}`;
    deltaColor = 'text-slate-400';
    deltaEmoji = '📉';
  }

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 13, fontWeight: 500 }}
            />
            <YAxis
              domain={[0, 10]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              ticks={[0, 2, 4, 6, 8, 10]}
              width={30}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(148, 163, 184, 0.08)' }}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 0, 0]}
              animationBegin={0}
              animationDuration={800}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={barColors[index]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Delta message */}
      <div className={`flex items-center gap-2 justify-center ${deltaColor}`}>
        <span className="text-lg">{deltaEmoji}</span>
        <span className="text-sm font-medium">{deltaMessage}</span>
      </div>
    </div>
  );
}
