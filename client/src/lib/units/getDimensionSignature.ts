import type { DimensionalFormula } from './dimensionalFormula';

export const getDimensionSignature = (dims: DimensionalFormula): string => {
  const entries = Object.entries(dims)
    .filter(([_, exp]) => exp !== 0)
    .sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([dim, exp]) => `${dim}:${exp}`).join(',');
};
