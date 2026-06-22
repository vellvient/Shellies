/**
 * AI Footprint — Analogies Engine
 * Translates abstract carbon/water metrics into relatable physical comparisons.
 */

/**
 * Generate real-world analogies from annual footprint data.
 * @param {{ annual_carbon_mid: number, annual_water_mid: number }} footprint
 * @returns {{ carbon: Array, water: Array }}
 */
export function getAnalogies(footprint) {
  const ac = footprint.annual_carbon_mid;  // grams CO2
  const aw = footprint.annual_water_mid;   // millilitres

  return {
    carbon: [
      {
        icon: '📱',
        label: 'Smartphone full charges',
        value: Math.round(ac / 10),
        context: 'to charge your phone from flat',
      },
      {
        icon: '🚗',
        label: 'Kilometres driven',
        value: parseFloat((ac / 150).toFixed(1)),
        context: 'driven in an average petrol car',
      },
      {
        icon: '💡',
        label: 'Hours of LED lighting',
        value: Math.round(ac / 7.85),
        context: 'of a 10W LED bulb running',
      },
    ],
    water: [
      {
        icon: '🍶',
        label: 'Water bottles',
        value: Math.round(aw / 500),
        context: 'standard 500mL bottles',
      },
      {
        icon: '🛁',
        label: 'Bathtubs',
        value: parseFloat((aw / 150000).toFixed(1)),
        context: 'standard bathtubs filled',
      },
      {
        icon: '🚿',
        label: 'Showers',
        value: parseFloat((aw / 60000).toFixed(1)),
        context: '8-minute showers',
      },
    ],
  };
}
