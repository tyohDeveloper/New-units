import type { DimensionalFormula } from '../units/shared-types';

export const isDimensionless = (d: DimensionalFormula): boolean => {
  return Object.keys(d).filter(k => d[k as keyof DimensionalFormula] !== 0).length === 0;
};
