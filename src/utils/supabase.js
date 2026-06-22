import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Submit complete survey response to Supabase.
 * Called ONLY at Step 5 completion.
 */
export async function submitResponse(data) {
  const { error } = await supabase.from('responses').upsert(
    {
      session_id: data.session_id,
      completed_at: new Date().toISOString(),

      // Step 1
      pre_concern: data.pre_concern,
      prior_awareness: data.prior_awareness,
      knows_water_cooling: data.knows_water_cooling,
      ai_vs_search: data.ai_vs_search_estimate,

      // Step 2
      prompts_simple: data.daily_prompts.simple,
      prompts_reasoning: data.daily_prompts.reasoning,
      prompts_coding: data.daily_prompts.coding,
      prompts_image: data.daily_prompts.image,
      total_daily_prompts:
        data.daily_prompts.simple +
        data.daily_prompts.reasoning +
        data.daily_prompts.coding +
        data.daily_prompts.image,

      // Step 3
      aei_q1: data.aei_scores.q1,
      aei_q2: data.aei_scores.q2,
      aei_q3: data.aei_scores.q3,
      aei_q4: data.aei_scores.q4,
      aei_q5: data.aei_scores.q5,
      aei_total: data.aei_total,
      persona: data.persona,

      // Step 4
      daily_carbon_mid: data.footprint.daily_carbon.mid,
      annual_carbon_mid: data.footprint.annual_carbon_mid,
      annual_water_mid: data.footprint.annual_water_mid,

      // Step 5
      post_concern: data.post_concern,
      concern_delta: data.concern_delta,
      behavior_intention: data.behavior_intention,
      pledges: data.pledges,
      change_likelihood: data.change_likelihood,
    },
    { onConflict: 'session_id' }
  );

  if (error) {
    console.error('Supabase submission error:', error);
    throw error;
  }
  return true;
}

/**
 * Get total number of completed responses for participant count.
 */
export async function getParticipantCount() {
  const { count, error } = await supabase
    .from('responses')
    .select('*', { count: 'exact', head: true });

  if (error) {
    console.error('Supabase count error:', error);
    return 0;
  }
  return count || 0;
}
