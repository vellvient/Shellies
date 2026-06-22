import React from 'react';
import PillSelect from '../ui/PillSelect';
import { PROMPT_MIDPOINTS, PROMPT_LABELS } from '../../utils/calculator';

export default function Step2UsageProfile({ state, dispatch }) {
  const totalPrompts =
    state.daily_prompts.simple +
    state.daily_prompts.reasoning +
    state.daily_prompts.coding +
    state.daily_prompts.image;

  const handlePromptChange = (category, selectedIndex) => {
    dispatch({
      type: 'SET_DAILY_PROMPTS',
      category,
      value: PROMPT_MIDPOINTS[selectedIndex],
    });
  };

  const getSelectedIndex = (val) => {
    return Object.keys(PROMPT_MIDPOINTS).find((key) => PROMPT_MIDPOINTS[key] === val) || 0;
  };

  const promptOptions = PROMPT_LABELS.map((label, i) => ({ value: i, label }));

  return (
    <div className="flex flex-col space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-100">Your AI Usage Profile</h2>
        <p className="mt-2 text-slate-400">Tell us about your typical daily AI usage.</p>
      </div>

      <div className="card flex items-center justify-between sticky top-4 z-10 shadow-lg border-emerald-500/30">
        <div>
          <p className="text-sm text-slate-400 font-medium">Estimated Daily Prompts</p>
          <p className="text-3xl font-bold text-emerald-400">~{totalPrompts}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="card space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💬</span>
            <div>
              <h3 className="font-semibold text-lg text-slate-200">Simple Chat</h3>
              <p className="text-sm text-slate-400">Quick questions, summaries, translations, casual chat</p>
            </div>
          </div>
          <PillSelect
            selected={parseInt(getSelectedIndex(state.daily_prompts.simple))}
            onChange={(val) => handlePromptChange('simple', val)}
            options={promptOptions}
            columns={5}
          />
        </div>

        <div className="card space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🧠</span>
            <div>
              <h3 className="font-semibold text-lg text-slate-200">Advanced Reasoning</h3>
              <p className="text-sm text-slate-400">Complex analysis, essays, research, long multi-step tasks</p>
            </div>
          </div>
          <PillSelect
            selected={parseInt(getSelectedIndex(state.daily_prompts.reasoning))}
            onChange={(val) => handlePromptChange('reasoning', val)}
            options={promptOptions}
            columns={5}
          />
        </div>

        <div className="card space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💻</span>
            <div>
              <h3 className="font-semibold text-lg text-slate-200">Coding & Development</h3>
              <p className="text-sm text-slate-400">Code generation, debugging, architecture review</p>
            </div>
          </div>
          <PillSelect
            selected={parseInt(getSelectedIndex(state.daily_prompts.coding))}
            onChange={(val) => handlePromptChange('coding', val)}
            options={promptOptions}
            columns={5}
          />
        </div>

        <div className="card space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">🎨</span>
            <div>
              <h3 className="font-semibold text-lg text-slate-200">Image Generation</h3>
              <p className="text-sm text-slate-400">DALL-E, Midjourney, Stable Diffusion, etc.</p>
            </div>
          </div>
          <PillSelect
            selected={parseInt(getSelectedIndex(state.daily_prompts.image))}
            onChange={(val) => handlePromptChange('image', val)}
            options={promptOptions}
            columns={5}
          />
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          className="px-8 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={() => dispatch({ type: 'NEXT_STEP' })}
          className="px-8 py-3 rounded-xl font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-glow-emerald transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
