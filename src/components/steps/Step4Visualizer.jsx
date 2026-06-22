import React from 'react';
import { motion } from 'framer-motion';
import PersonaBadge from '../ui/PersonaBadge';
import MetricCard from '../ui/MetricCard';
import AnalogyCard from '../ui/AnalogyCard';
import PeerBenchmarkChart from '../charts/PeerBenchmarkChart';
import AnimatedNumber from '../ui/AnimatedNumber';
import { getAnalogies } from '../../utils/analogies';
import sandboxData from '../../data/sandbox.json';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Step4Visualizer({ state, dispatch }) {
  const userPrompts =
    state.daily_prompts.simple +
    state.daily_prompts.reasoning +
    state.daily_prompts.coding +
    state.daily_prompts.image;

  const analogies = getAnalogies(state.footprint);

  const pledgesList = [
    { id: 'specific', text: '✍️ Writing more specific, detailed prompts' },
    { id: 'noregen', text: '🔄 Avoiding unnecessary regenerations' },
    { id: 'purposeful', text: '🎯 Using AI only when it genuinely helps' },
    { id: 'learn', text: '📚 Learning more about sustainable AI habits' },
    { id: 'same', text: '➡️ I will continue my current habits' },
  ];

  const handlePledgeToggle = (id) => {
    let newPledges = [...state.pledges];

    if (id === 'same') {
      newPledges = newPledges.includes('same') ? [] : ['same'];
    } else {
      if (newPledges.includes('same')) {
        newPledges = newPledges.filter((p) => p !== 'same');
      }
      if (newPledges.includes(id)) {
        newPledges = newPledges.filter((p) => p !== id);
      } else {
        newPledges.push(id);
      }
    }

    dispatch({ type: 'SET_PLEDGES', value: newPledges });
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col space-y-12"
    >
      {/* Section A: Persona Reveal */}
      <motion.div variants={itemVariants}>
        <PersonaBadge persona={state.persona} aeiTotal={state.aei_total} />
      </motion.div>

      {/* Section B: Daily Footprint */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100">Your Daily Footprint</h3>
        <p className="text-sm text-slate-400">Range reflects variation in AI model energy efficiency</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <MetricCard
            icon="🌿"
            title="Carbon Footprint"
            midValue={state.footprint.daily_carbon.mid}
            lowValue={state.footprint.daily_carbon.low}
            highValue={state.footprint.daily_carbon.high}
            unit="g CO₂"
            color="emerald"
          />
          <MetricCard
            icon="💧"
            title="Water Consumption"
            midValue={state.footprint.daily_water.mid}
            lowValue={state.footprint.daily_water.low}
            highValue={state.footprint.daily_water.high}
            unit="mL"
            color="cyan"
          />
        </div>
      </motion.div>

      {/* Section C: Annual Projection */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100">Annual Projection</h3>
        <p className="text-sm text-slate-400">If you continue at your current pace...</p>
        <div className="card grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-center">
          <div>
            <p className="text-slate-400 text-sm">Daily</p>
            <p className="text-emerald-400 font-bold text-xl"><AnimatedNumber value={state.footprint.daily_carbon.mid} suffix="g" /></p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Weekly</p>
            <p className="text-emerald-400 font-bold text-xl"><AnimatedNumber value={state.footprint.weekly_carbon_mid} suffix="g" /></p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Monthly</p>
            <p className="text-emerald-400 font-bold text-xl"><AnimatedNumber value={state.footprint.monthly_carbon_mid} suffix="g" /></p>
          </div>
          <div>
            <p className="text-slate-400 text-sm">Annual</p>
            <p className="text-emerald-400 font-bold text-xl"><AnimatedNumber value={state.footprint.annual_carbon_mid} suffix="g" /></p>
          </div>
        </div>
      </motion.div>

      {/* Section D: Real-World Analogies */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100">What does this actually mean?</h3>
        <p className="text-sm text-slate-400">Over a year, your AI usage is equivalent to:</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {analogies.carbon.map((item, i) => (
            <motion.div key={`c-${i}`} variants={itemVariants}>
              <AnalogyCard {...item} />
            </motion.div>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800">
          {analogies.water.map((item, i) => (
            <motion.div key={`w-${i}`} variants={itemVariants}>
              <AnalogyCard {...item} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Section E: Peer Benchmark */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100">How do you compare?</h3>
        <p className="text-sm text-slate-400">Your daily prompts vs other students in the study.</p>
        <PeerBenchmarkChart userPrompts={userPrompts} sandboxData={sandboxData} />
      </motion.div>

      {/* Section F: Behavioural Pledge */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h3 className="text-xl font-bold text-slate-100">After seeing your results, I commit to:</h3>
        <div className="grid grid-cols-1 gap-3">
          {pledgesList.map(({ id, text }) => {
            const isSelected = state.pledges.includes(id);
            return (
              <button
                key={id}
                onClick={() => handlePledgeToggle(id)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 hover:border-slate-500 text-slate-200'
                }`}
              >
                {text}
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-between pt-8 pb-12">
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
      </motion.div>
    </motion.div>
  );
}
