import { useReducer, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import ProgressBar from './components/ProgressBar';
import StepWrapper from './components/StepWrapper';
import Step1PreSurvey from './components/steps/Step1PreSurvey';
import Step2UsageProfile from './components/steps/Step2UsageProfile';
import Step3Fluency from './components/steps/Step3Fluency';
import Step4Visualizer from './components/steps/Step4Visualizer';
import Step5PostSurvey from './components/steps/Step5PostSurvey';

// ── Initial State ──
const getInitialState = () => {
  const saved = localStorage.getItem('ai_footprint_data');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // corrupted data — start fresh
    }
  }

  return {
    session_id: crypto.randomUUID(),
    current_step: 1,

    // Step 1 — Pre-Survey
    pre_concern: null,
    prior_awareness: null,
    knows_water_cooling: null,
    ai_vs_search_estimate: null,

    // Step 2 — Usage Profile
    daily_prompts: {
      simple: 0,
      reasoning: 0,
      coding: 0,
      image: 0,
    },

    // Step 3 — AI Fluency (AEI)
    aei_scores: { q1: null, q2: null, q3: null, q4: null, q5: null },
    aei_total: null,
    persona: null,

    // Step 4 — Calculated Footprint
    footprint: {
      daily_carbon: { low: 0, mid: 0, high: 0 },
      daily_water:  { low: 0, mid: 0, high: 0 },
      weekly_carbon_mid: 0,
      monthly_carbon_mid: 0,
      annual_carbon_mid: 0,
      weekly_water_mid: 0,
      monthly_water_mid: 0,
      annual_water_mid: 0,
    },

    // Step 5 — Post-Survey
    post_concern: null,
    concern_delta: null,
    change_likelihood: null,
    pledges: [],
    behavior_intention: '',
    submitted: false,
  };
};

// ── Reducer ──
function reducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_DAILY_PROMPTS':
      return {
        ...state,
        daily_prompts: { ...state.daily_prompts, [action.category]: action.value },
      };
    case 'SET_AEI_SCORE':
      return {
        ...state,
        aei_scores: { ...state.aei_scores, [action.question]: action.value },
      };
    case 'SET_FOOTPRINT':
      return { ...state, footprint: action.value };
    case 'SET_PLEDGES':
      return { ...state, pledges: action.value };
    case 'NEXT_STEP':
      return { ...state, current_step: Math.min(state.current_step + 1, 5) };
    case 'PREV_STEP':
      return { ...state, current_step: Math.max(state.current_step - 1, 1) };
    case 'RESET':
      localStorage.removeItem('ai_footprint_data');
      return getInitialState();
    default:
      return state;
  }
}

// ── Step Components Map ──
const STEPS = {
  1: Step1PreSurvey,
  2: Step2UsageProfile,
  3: Step3Fluency,
  4: Step4Visualizer,
  5: Step5PostSurvey,
};

const STEP_LABELS = [
  'Pre-Survey',
  'Usage Profile',
  'AI Fluency',
  'Your Footprint',
  'Post-Survey',
];

export default function App() {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  // Persist to localStorage on every state change
  useEffect(() => {
    localStorage.setItem('ai_footprint_data', JSON.stringify(state));
  }, [state]);

  const CurrentStep = STEPS[state.current_step];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Progress Bar */}
      <ProgressBar
        currentStep={state.current_step}
        labels={STEP_LABELS}
      />

      {/* Main Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-wizard">
          <AnimatePresence mode="wait">
            <StepWrapper key={state.current_step}>
              <CurrentStep state={state} dispatch={dispatch} />
            </StepWrapper>
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center text-slate-500 text-xs py-4 px-4">
        <p>Built for KYUEM KYRI Symposium · AI Educational Research Track</p>
        <p className="mt-1">Aligned with UN SDGs 4, 9, 12 & 13</p>
      </footer>
    </div>
  );
}
