import type { DimensionalFormula } from './shared-types';

export const getDimensionSignature = (dims: DimensionalFormula): string => {
  const entries = Object.entries(dims)
    .filter(([_, exp]) => exp !== 0 && exp !== undefined)
    .sort(([a], [b]) => a.localeCompare(b));
  return entries.map(([dim, exp]) => `${dim}:${exp}`).join(',');
};
