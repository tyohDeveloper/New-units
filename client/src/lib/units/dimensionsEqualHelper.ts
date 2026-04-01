import type { DimensionalFormula } from './shared-types';

export const dimensionsEqual = (a: DimensionalFormula, b: DimensionalFormula): boolean => {
  const normalize = (d: DimensionalFormula): DimensionalFormula => {
    const result: DimensionalFormula = {};
    for (const [key, value] of Object.entries(d)) {
      if (value !== 0 && value !== undefined) {
        result[key as keyof DimensionalFormula] = value;
      }
    }
    return result;
  };

  const normA = normalize(a);
  const normB = normalize(b);
  const keysA = Object.keys(normA) as (keyof DimensionalFormula)[];
  const keysB = Object.keys(normB) as (keyof DimensionalFormula)[];

  if (keysA.length !== keysB.length) return false;
  for (const key of keysA) {
    if (normA[key] !== normB[key]) return false;
  }
  return true;
};
