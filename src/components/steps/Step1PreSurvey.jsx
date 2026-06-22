import React from 'react';
import SliderInput from '../ui/SliderInput';
import PillSelect from '../ui/PillSelect';

export default function Step1PreSurvey({ state, dispatch }) {
  const isComplete =
    state.pre_concern !== null &&
    state.prior_awareness !== null &&
    state.knows_water_cooling !== null &&
    state.ai_vs_search_estimate !== null;

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-100">Before we begin — a few quick questions</h2>
        <p className="mt-2 text-slate-400">This survey is fully anonymous. There are no right or wrong answers.</p>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-lg text-slate-200">How concerned are you about the environmental impact of technology in your daily life?</h3>
        <SliderInput
          value={state.pre_concern}
          onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'pre_concern', value: val })}
          min={1}
          max={10}
          leftLabel="Not at all"
          rightLabel="Extremely concerned"
        />
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-lg text-slate-200">How much do you currently know about AI's environmental footprint?</h3>
        <PillSelect
          selected={state.prior_awareness}
          onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'prior_awareness', value: val })}
          columns={2}
          options={[
            { value: 'none', label: '😶 I had no idea it had one' },
            { value: 'some', label: '🤔 I\'ve heard a little about it' },
            { value: 'good', label: '📖 I have a decent understanding' },
            { value: 'expert', label: '🎓 I know a lot about it' },
          ]}
        />
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-lg text-slate-200">Were you aware that AI data centers require large-scale water-cooling systems to prevent overheating?</h3>
        <PillSelect
          selected={state.knows_water_cooling}
          onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'knows_water_cooling', value: val })}
          columns={2}
          options={[
            { value: true, label: '💧 Yes' },
            { value: false, label: '❓ No' },
          ]}
        />
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-lg text-slate-200">Compared to a standard Google search, how much energy do you think a single ChatGPT prompt uses?</h3>
        <PillSelect
          selected={state.ai_vs_search_estimate}
          onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'ai_vs_search_estimate', value: val })}
          columns={1}
          options={[
            { value: 'same', label: '⚡ About the same amount' },
            { value: 'slightly', label: '⚡⚡ Slightly more (2–3×)' },
            { value: 'much_more', label: '⚡⚡⚡⚡ Much more (5–10×)' },
            { value: 'no_idea', label: '🤷 I have no idea' },
          ]}
        />
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={() => dispatch({ type: 'NEXT_STEP' })}
          disabled={!isComplete}
          className={`px-8 py-3 rounded-xl font-semibold transition-all ${
            isComplete
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-glow-emerald'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
