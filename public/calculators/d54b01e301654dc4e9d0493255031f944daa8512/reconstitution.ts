/**
 * Reconstitution dilution math.
 *
 * Published reference implementation for the calculator at
 * https://americanpeptide.com/tools/reconstitution-calculator
 *
 * Pure and unit-agnostic: pass vial mass and target dose in the SAME unit
 * (micrograms for a milligram vial, or IU for an IU-labeled biologic).
 * This module does not convert milligrams to micrograms.
 *
 * U-100 scale only: 100 units = 1 mL, so one unit is 0.01 mL.
 * `concentrationPerTick` is the amount per 0.1 mL (ten units).
 *
 * MIT License. Copyright American Peptide.
 */

export interface ReconInput {
  /** Peptide mass in the vial, in the dose unit (mcg or IU). */
  vialAmount: number;
  /** Target amount per administration, in the same unit as `vialAmount`. */
  dose: number;
  /** Diluent volume, in mL. */
  waterMl: number;
}

export interface ReconResult {
  /** Amount per mL. */
  concentrationPerMl: number;
  /** Amount per 0.1 mL (ten U-100 units). */
  concentrationPerTick: number;
  /** Volume to draw for one dose, in mL. */
  volumePerInjectionMl: number;
  /** Draw volume as U-100 syringe units. */
  unitsPerInjection: number;
  /** Whole doses obtainable from the vial mass (rounded down). Independent of diluent volume. */
  dosesPerVial: number;
}

export function reconstitute(input: ReconInput): ReconResult {
  const { vialAmount, dose, waterMl } = input;
  const concentrationPerMl = waterMl > 0 ? vialAmount / waterMl : 0;
  const concentrationPerTick = concentrationPerMl / 10;
  const volumePerInjectionMl = concentrationPerMl > 0 ? dose / concentrationPerMl : 0;
  const unitsPerInjection = volumePerInjectionMl * 100;
  const dosesPerVial = dose > 0 ? Math.floor(vialAmount / dose) : 0;
  return {
    concentrationPerMl,
    concentrationPerTick,
    volumePerInjectionMl,
    unitsPerInjection,
    dosesPerVial,
  };
}

/**
 * Diluent volume (mL) so that `dose` draws exactly `drawUnits` on a U-100 syringe.
 *
 *   units = (dose / (vialAmount / water)) × 100
 *   water = vialAmount × (drawUnits × 0.01) / dose
 */
export function solveWaterForDraw(vialAmount: number, dose: number, drawUnits: number): number {
  return dose > 0 ? (vialAmount * (drawUnits * 0.01)) / dose : 0;
}
