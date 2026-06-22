import React from 'react';
import LikertRow from '../ui/LikertRow';
import { calculateAEI, calculateFootprint } from '../../utils/calculator';

export default function Step3Fluency({ state, dispatch }) {
  const { q1, q2, q3, q4, q5 } = state.aei_scores;
  const isComplete = q1 !== null && q2 !== null && q3 !== null && q4 !== null && q5 !== null;

  const handleNext = () => {
    const { total, persona } = calculateAEI(state.aei_scores);
    dispatch({ type: 'SET_FIELD', field: 'aei_total', value: total });
    dispatch({ type: 'SET_FIELD', field: 'persona', value: persona });

    const footprint = calculateFootprint(state.daily_prompts);
    dispatch({ type: 'SET_FOOTPRINT', value: footprint });

    dispatch({ type: 'NEXT_STEP' });
  };

  const statements = [
    { id: 'q1', text: 'I break complex tasks into smaller, sequential prompts.' },
    { id: 'q2', text: 'I refine or rewrite my prompt when I get an unsatisfactory answer.' },
    { id: 'q3', text: 'I provide background context or examples before asking AI for help.' },
    { id: 'q4', text: 'I specify the format or structure I want in the output.' },
    { id: 'q5', text: 'I repeatedly regenerate or retry AI responses until I\'m happy.' },
  ];

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-100">How do you use AI?</h2>
        <p className="mt-2 text-slate-400">Tell us about your natural prompting style. This helps us understand usage patterns across students.</p>
      </div>

      <div className="space-y-6">
        {statements.map(({ id, text }) => (
          <LikertRow
            key={id}
            statement={text}
            selected={state.aei_scores[id]}
            onChange={(val) => dispatch({ type: 'SET_AEI_SCORE', question: id, value: val })}
          />
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          className="px-8 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
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
