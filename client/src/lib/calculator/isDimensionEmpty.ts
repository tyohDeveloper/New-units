import type { DimensionalFormula } from '../units/shared-types';

export const isDimensionEmpty = (dims: DimensionalFormula): boolean => {
  return Object.values(dims).every(v => v === 0 || v === undefined);
};
