import React, { useState, useEffect } from 'react';
import SliderInput from '../ui/SliderInput';
import PillSelect from '../ui/PillSelect';
import ConcernDeltaChart from '../charts/ConcernDeltaChart';
import AnimatedNumber from '../ui/AnimatedNumber';
import { getAnalogies } from '../../utils/analogies';
import { submitResponse, getParticipantCount } from '../../utils/supabase';

export default function Step5PostSurvey({ state, dispatch }) {
  const [showDashboard, setShowDashboard] = useState(state.submitted);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participantCount, setParticipantCount] = useState('...');
  const [copied, setCopied] = useState(false);

  const analogies = getAnalogies(state.footprint);

  useEffect(() => {
    if (showDashboard) {
      getParticipantCount().then(setParticipantCount);
    }
  }, [showDashboard]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const delta = state.post_concern - state.pre_concern;
    dispatch({ type: 'SET_FIELD', field: 'concern_delta', value: delta });
    
    // Optimistically update local state so we don't wait for DB to show dashboard
    dispatch({ type: 'SET_FIELD', field: 'submitted', value: true });
    
    // Also attach delta directly so we can send immediately without waiting for state to sync
    const finalState = { ...state, concern_delta: delta, submitted: true };

    try {
      await submitResponse(finalState);
    } catch (e) {
      console.error('Failed to submit, but continuing to dashboard', e);
    }

    setIsSubmitting(false);
    setShowDashboard(true);
  };

  const handleShare = async () => {
    const text = `I just calculated my AI carbon footprint 🌿 — try it yourself: ${window.location.origin} #AIFootprint #Sustainability`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  if (showDashboard) {
    return (
      <div className="flex flex-col space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-emerald-400">Thank You!</h2>
          <p className="mt-2 text-slate-300 max-w-lg mx-auto">
            Your anonymous data contributes to Malaysia's first student-led study on AI's environmental footprint. Results will be presented at the KYUEM KYRI Symposium.
          </p>
          <div className="mt-4 inline-block bg-slate-800 border border-slate-700 px-4 py-2 rounded-full text-sm text-slate-400">
            You are participant <span className="text-slate-100 font-bold">#{participantCount}</span> in this study
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <h3 className="font-semibold text-lg text-slate-200">Concern Shift</h3>
            <div className="h-64">
              <ConcernDeltaChart preConcern={state.pre_concern} postConcern={state.post_concern} />
            </div>
          </div>

          <div className="card space-y-6 flex flex-col justify-between border-emerald-500/30">
            <div>
              <h3 className="font-semibold text-lg text-slate-200 mb-4">Your Footprint Summary</h3>
              <div className="flex justify-between items-center bg-slate-900 rounded-lg p-4 mb-4">
                <span className="text-slate-400 text-sm">Persona</span>
                <span className="text-emerald-400 font-bold capitalize">{state.persona}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-900 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">{analogies.carbon[1].icon}</div>
                  <div className="text-emerald-400 font-bold"><AnimatedNumber value={analogies.carbon[1].value} /></div>
                  <div className="text-xs text-slate-500 mt-1">{analogies.carbon[1].label} (annual)</div>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">{analogies.water[2].icon}</div>
                  <div className="text-cyan-400 font-bold"><AnimatedNumber value={analogies.water[2].value} /></div>
                  <div className="text-xs text-slate-500 mt-1">{analogies.water[2].label} (annual)</div>
                </div>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="w-full py-3 rounded-xl font-semibold bg-emerald-500 text-slate-950 hover:bg-emerald-400 transition-colors flex justify-center items-center gap-2"
            >
              {copied ? '✅ Copied to clipboard!' : '🔗 Share your result'}
            </button>
          </div>
        </div>

        <div className="text-center pt-8">
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="text-sm text-slate-500 hover:text-slate-300 underline"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const isSurveyComplete = state.post_concern !== null && state.change_likelihood !== null;

  return (
    <div className="flex flex-col space-y-8 animate-in slide-in-from-right duration-300">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-100">After Seeing Your Footprint...</h2>
        <p className="mt-2 text-slate-400">Your responses help us measure the real impact of this tool.</p>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-lg text-slate-200">Now, on a scale of 1–10, how concerned are you about the environmental impact of AI usage?</h3>
        <SliderInput
          value={state.post_concern}
          onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'post_concern', value: val })}
          min={1}
          max={10}
          leftLabel="Not at all"
          rightLabel="Extremely concerned"
        />
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-lg text-slate-200">How likely are you to change your AI usage habits after seeing your personal footprint?</h3>
        <PillSelect
          selected={state.change_likelihood}
          onChange={(val) => dispatch({ type: 'SET_FIELD', field: 'change_likelihood', value: val })}
          columns={1}
          options={[
            { value: 'not_at_all', label: '🚫 Not at all likely' },
            { value: 'slightly', label: '🤷 Slightly likely' },
            { value: 'moderately', label: '👍 Moderately likely' },
            { value: 'very', label: '🌱 Very likely — I\'m making changes' },
          ]}
        />
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-lg text-slate-200">In one sentence, what's one specific thing you'll do differently? <span className="text-slate-500 font-normal text-sm">(Optional)</span></h3>
        <textarea
          value={state.behavior_intention}
          onChange={(e) => dispatch({ type: 'SET_FIELD', field: 'behavior_intention', value: e.target.value })}
          maxLength={200}
          placeholder="e.g., I'll write clearer prompts so I don't need to regenerate as often..."
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none h-24"
        />
      </div>

      <div className="flex justify-between pt-4 pb-12">
        <button
          onClick={() => dispatch({ type: 'PREV_STEP' })}
          className="px-8 py-3 rounded-xl font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isSurveyComplete || isSubmitting}
          className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
            isSurveyComplete && !isSubmitting
              ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-glow-emerald'
              : 'bg-slate-700 text-slate-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Submitting...' : 'Submit & See Dashboard'}
        </button>
      </div>
    </div>
  );
}
