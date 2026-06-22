/**
 * AI Footprint — Calculation Engine
 * All calculations are client-side. No region — uses a single global GEF.
 */

// Global Grid Emission Factor — kg CO2 per kWh
// US EPA eGRID 2023 national average (most AI data centres are US-based)
const GEF = 0.390;

// Energy per query — kWh
const ENERGY_KWH = {
  simple:    0.003,   // ~3 Wh per simple chat query
  reasoning: 0.010,   // ~10 Wh per GPT-4 level reasoning
  coding:    0.008,   // ~8 Wh per code generation task
  image:     0.176,   // ~176 Wh per image generation
};

// Water consumption per query — millilitres
const WATER_ML = {
  simple:    5,
  reasoning: 50,
  coding:    30,
  image:     500,
};

// Power Usage Effectiveness — industry standard for hyperscale DCs
const PUE = 1.3;

/**
 * Calculate carbon and water footprint from daily prompt volumes.
 * @param {{ simple: number, reasoning: number, coding: number, image: number }} dailyPrompts
 * @returns {Object} Footprint with daily/weekly/annual projections and confidence intervals
 */
export function calculateFootprint(dailyPrompts) {
  let dailyCarbonG = 0;
  let dailyWaterML = 0;

  Object.keys(dailyPrompts).forEach((type) => {
    const n = dailyPrompts[type];
    // Carbon: grams = N × E(kWh) × PUE × GEF(kg/kWh) × 1000
    dailyCarbonG += n * ENERGY_KWH[type] * PUE * GEF * 1000;
    dailyWaterML += n * WATER_ML[type];
  });

  return {
    daily_carbon: {
      low:  dailyCarbonG * 0.70,
      mid:  dailyCarbonG,
      high: dailyCarbonG * 1.50,
    },
    daily_water: {
      low:  dailyWaterML * 0.70,
      mid:  dailyWaterML,
      high: dailyWaterML * 1.50,
    },
    weekly_carbon_mid:  dailyCarbonG * 7,
    monthly_carbon_mid: dailyCarbonG * 30,
    annual_carbon_mid:  dailyCarbonG * 365,
    weekly_water_mid:   dailyWaterML * 7,
    monthly_water_mid:  dailyWaterML * 30,
    annual_water_mid:   dailyWaterML * 365,
  };
}

/**
 * Calculate AEI score and determine persona.
 * Q5 is reverse scored (6 - q5).
 */
export function calculateAEI({ q1, q2, q3, q4, q5 }) {
  const total = q1 + q2 + q3 + q4 + (6 - q5);
  let persona;
  if (total <= 10) persona = 'searcher';
  else if (total <= 18) persona = 'automator';
  else persona = 'director';
  return { total, persona };
}

/**
 * Midpoint values for prompt range buttons.
 */
export const PROMPT_MIDPOINTS = {
  0: 0,
  1: 3,    // 1–5  → midpoint 3
  2: 10,   // 6–15 → midpoint 10
  3: 23,   // 16–30 → midpoint 23
  4: 40,   // 30+  → value 40
};

export const PROMPT_LABELS = [
  'None (0)',
  '1 – 5',
  '6 – 15',
  '16 – 30',
  '30+',
];
