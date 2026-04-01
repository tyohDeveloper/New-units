import type { DimensionalFormula } from './dimensionalFormula';

export const SI_BASE_UNIT_SYMBOLS = ['m', 'kg', 's', 'A', 'K', 'mol', 'cd', 'rad', 'sr'] as const;

export type SIBaseUnitSymbol = typeof SI_BASE_UNIT_SYMBOLS[number];

export const SI_BASE_TO_DIMENSION: Record<SIBaseUnitSymbol, keyof DimensionalFormula> = {
  m: 'length',
  kg: 'mass',
  s: 'time',
  A: 'current',
  K: 'temperature',
  mol: 'amount',
  cd: 'intensity',
  rad: 'angle',
  sr: 'solid_angle',
};

export const DIMENSION_TO_SI_SYMBOL: Record<keyof DimensionalFormula, string> = {
  length: 'm',
  mass: 'kg',
  time: 's',
  current: 'A',
  temperature: 'K',
  amount: 'mol',
  intensity: 'cd',
  angle: 'rad',
  solid_angle: 'sr',
};
