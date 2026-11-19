/**
 * Single-compartment, first-order elimination.
 *
 * Published reference implementation for the bench calculators on
 * americanpeptide.com. Times are hours. This is a teaching model: one
 * half-life, no absorption lag, no multi-compartment kinetics.
 *
 * MIT License. Copyright American Peptide.
 */

const LN2 = Math.LN2;

/** Fraction of a single dose remaining after `hours`. */
export function fractionRemaining(halfLifeHours: number, hours: number): number {
  if (halfLifeHours <= 0 || hours < 0) return NaN;
  return 0.5 ** (hours / halfLifeHours);
}

/** Hours for a single dose to decay to `fraction` of its starting amount. `fraction` is in (0, 1). */
export function timeToFraction(halfLifeHours: number, fraction: number): number {
  if (halfLifeHours <= 0 || fraction <= 0 || fraction >= 1) return NaN;
  return halfLifeHours * (Math.log(1 / fraction) / LN2);
}

/**
 * Hours to reach `fraction` of steady state on repeated dosing (default 0.97).
 * Independent of the dosing interval: the approach to steady state mirrors
 * single-dose decay. About five half-lives for 97%.
 */
export function timeToSteadyState(halfLifeHours: number, fraction = 0.97): number {
  return timeToFraction(halfLifeHours, 1 - fraction);
}

/**
 * Steady-state accumulation ratio for a fixed dose every `intervalHours`:
 * 1 / (1 − 0.5^(τ / t½)). 1 means no accumulation.
 */
export function accumulationRatio(halfLifeHours: number, intervalHours: number): number {
  if (halfLifeHours <= 0 || intervalHours <= 0) return NaN;
  return 1 / (1 - 0.5 ** (intervalHours / halfLifeHours));
}

/** Peak-to-trough ratio at steady state, 2^(τ / t½). Near 1 is a flat profile. */
export function peakTroughRatio(halfLifeHours: number, intervalHours: number): number {
  if (halfLifeHours <= 0 || intervalHours <= 0) return NaN;
  return 2 ** (intervalHours / halfLifeHours);
}

/** Hours to decay to `fraction` remaining after the last dose (default 0.03). */
export function clearanceTime(halfLifeHours: number, fraction = 0.03): number {
  return timeToFraction(halfLifeHours, fraction);
}

/** Midpoint of a reported low–high half-life range. The curve uses this single number. */
export function halfLifeMidpoint(low: number, high: number): number {
  return (low + high) / 2;
}
