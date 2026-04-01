import type { DimensionalFormula } from '../units/shared-types';
import { formatDimensions } from './formatDimensions';

export const formatSIComposition = (
  derivedSymbols: string[],
  remainingDims: DimensionalFormula
): string => {
  const parts: string[] = [];

  const positiveDims: DimensionalFormula = {};
  const negativeDims: DimensionalFormula = {};
  for (const [dim, exp] of Object.entries(remainingDims)) {
    if (exp > 0) positiveDims[dim as keyof DimensionalFormula] = exp;
    else if (exp < 0) negativeDims[dim as keyof DimensionalFormula] = exp;
  }

  const positiveBase = formatDimensions(positiveDims);
  if (positiveBase) parts.push(positiveBase);

  parts.push(...derivedSymbols);

  const negativeBase = formatDimensions(negativeDims);
  if (negativeBase) parts.push(negativeBase);

  return parts.join('⋅');
};
