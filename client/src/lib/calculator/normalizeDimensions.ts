import type { DimensionalFormula } from '../units/shared-types';
import { isDimensionEmpty } from './isDimensionEmpty';
import { canApplyDerivedUnit } from './canApplyDerivedUnit';
import { subtractDerivedUnit } from './subtractDerivedUnit';
import { formatDimensions } from './formatDimensions';
import { toSuperscript } from './toSuperscript';
import { NORMALIZABLE_DERIVED_UNITS } from './siDerivedUnits';

export const normalizeDimensions = (dims: DimensionalFormula): string => {
  if (isDimensionEmpty(dims)) return '';

  let remaining = { ...dims };
  const usedUnits: Map<string, number> = new Map();

  let foundMatch = true;
  while (foundMatch && !isDimensionEmpty(remaining)) {
    foundMatch = false;
    for (const derivedUnit of NORMALIZABLE_DERIVED_UNITS) {
      if (canApplyDerivedUnit(remaining, derivedUnit.dimensions)) {
        remaining = subtractDerivedUnit(remaining, derivedUnit.dimensions);
        usedUnits.set(derivedUnit.symbol, (usedUnits.get(derivedUnit.symbol) || 0) + 1);
        foundMatch = true;
        break;
      }
    }
  }

  return buildNormalizedSymbol(remaining, usedUnits) || formatDimensions(dims);
};

function buildNormalizedSymbol(
  remaining: DimensionalFormula,
  usedUnits: Map<string, number>
): string {
  const parts: string[] = [];
  const sortedDerivedUnits = Array.from(usedUnits.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  const remainingSymbol = formatDimensions(remaining);
  if (remainingSymbol) {
    const positiveDims: DimensionalFormula = {};
    const negativeDims: DimensionalFormula = {};
    for (const [dim, exp] of Object.entries(remaining)) {
      if (exp > 0) positiveDims[dim as keyof DimensionalFormula] = exp;
      else if (exp < 0) negativeDims[dim as keyof DimensionalFormula] = exp;
    }

    const positiveSymbol = formatDimensions(positiveDims);
    if (positiveSymbol) parts.push(positiveSymbol);

    sortedDerivedUnits.forEach(([symbol, count]) => {
      parts.push(count === 1 ? symbol : symbol + toSuperscript(count));
    });

    const negativeSymbol = formatDimensions(negativeDims);
    if (negativeSymbol) parts.push(negativeSymbol);
  } else {
    sortedDerivedUnits.forEach(([symbol, count]) => {
      parts.push(count === 1 ? symbol : symbol + toSuperscript(count));
    });
  }

  return parts.join('⋅');
}
