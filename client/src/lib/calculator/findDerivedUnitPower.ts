import type { DimensionalFormula } from '../units/shared-types';
import type { DerivedUnitPowerMatch } from './types';
import { isDimensionless } from './isDimensionless';
import { toSuperscript } from './toSuperscript';
import { SI_DERIVED_UNITS } from './siDerivedUnits';

export const findDerivedUnitPower = (
  dimensions: DimensionalFormula
): DerivedUnitPowerMatch | null => {
  if (isDimensionless(dimensions)) return null;

  const dimEntries = Object.entries(dimensions).filter(
    ([, exp]) => exp !== 0 && exp !== undefined
  ) as [keyof DimensionalFormula, number][];

  if (dimEntries.length === 0) return null;

  for (const derivedUnit of SI_DERIVED_UNITS) {
    if (derivedUnit.category === 'photon') continue;

    const unitDims = derivedUnit.dimensions;
    const unitEntries = Object.entries(unitDims).filter(
      ([, exp]) => exp !== 0 && exp !== undefined
    ) as [keyof DimensionalFormula, number][];

    if (unitEntries.length === 0) continue;

    const inputKeys = dimEntries.map(([k]) => k);
    const unitKeysSet = new Set(unitEntries.map(([k]) => k));

    if (inputKeys.length !== unitKeysSet.size) continue;

    let keysMatch = inputKeys.every(k => unitKeysSet.has(k));
    if (!keysMatch) continue;

    let power: number | null = null;
    let isMultiple = true;

    for (const [dim, inputExp] of dimEntries) {
      const unitExp = unitDims[dim] || 0;
      if (unitExp === 0) { isMultiple = false; break; }
      const ratio = inputExp / unitExp;
      if (!Number.isInteger(ratio) || ratio <= 1) { isMultiple = false; break; }
      if (power === null) power = ratio;
      else if (power !== ratio) { isMultiple = false; break; }
    }

    if (isMultiple && power !== null && power > 1) {
      return {
        symbol: `${derivedUnit.symbol}${toSuperscript(power)}`,
        baseSymbol: derivedUnit.symbol,
        power,
        category: derivedUnit.category
      };
    }
  }

  return null;
};
