import type { DerivedUnitInfo } from '../units/shared-types';
import type { NormalizableDerivedUnit } from './types';

export const SI_DERIVED_UNITS: DerivedUnitInfo[] = [
  { symbol: 'Hz', category: 'frequency', unitId: 'hz', dimensions: { time: -1 }, allowPrefixes: true },
  { symbol: 'N', category: 'force', unitId: 'n', dimensions: { mass: 1, length: 1, time: -2 }, allowPrefixes: true },
  { symbol: 'Pa', category: 'pressure', unitId: 'pa', dimensions: { mass: 1, length: -1, time: -2 }, allowPrefixes: true },
  { symbol: 'J', category: 'energy', unitId: 'j', dimensions: { mass: 1, length: 2, time: -2 }, allowPrefixes: true },
  { symbol: 'W', category: 'power', unitId: 'w', dimensions: { mass: 1, length: 2, time: -3 }, allowPrefixes: true },
  { symbol: 'C', category: 'charge', unitId: 'c', dimensions: { current: 1, time: 1 }, allowPrefixes: true },
  { symbol: 'V', category: 'potential', unitId: 'v', dimensions: { mass: 1, length: 2, time: -3, current: -1 }, allowPrefixes: true },
  { symbol: 'F', category: 'capacitance', unitId: 'f', dimensions: { mass: -1, length: -2, time: 4, current: 2 }, allowPrefixes: true },
  { symbol: 'Ω', category: 'resistance', unitId: 'ohm', dimensions: { mass: 1, length: 2, time: -3, current: -2 }, allowPrefixes: true },
  { symbol: 'S', category: 'conductance', unitId: 's', dimensions: { mass: -1, length: -2, time: 3, current: 2 }, allowPrefixes: true },
  { symbol: 'Wb', category: 'magnetic_flux', unitId: 'wb', dimensions: { mass: 1, length: 2, time: -2, current: -1 }, allowPrefixes: true },
  { symbol: 'T', category: 'magnetic_density', unitId: 't', dimensions: { mass: 1, time: -2, current: -1 }, allowPrefixes: true },
  { symbol: 'H', category: 'inductance', unitId: 'h', dimensions: { mass: 1, length: 2, time: -2, current: -2 }, allowPrefixes: true },
  { symbol: 'lm', category: 'luminous_flux', unitId: 'lm', dimensions: { intensity: 1, solid_angle: 1 }, allowPrefixes: true },
  { symbol: 'lx', category: 'illuminance', unitId: 'lx', dimensions: { intensity: 1, solid_angle: 1, length: -2 }, allowPrefixes: true },
  { symbol: 'Bq', category: 'radioactivity', unitId: 'bq', dimensions: { time: -1 }, allowPrefixes: true },
  { symbol: 'Gy', category: 'absorbed_dose', unitId: 'gy', dimensions: { length: 2, time: -2 }, allowPrefixes: true },
  { symbol: 'Sv', category: 'equivalent_dose', unitId: 'sv', dimensions: { length: 2, time: -2 }, allowPrefixes: true },
  { symbol: 'kat', category: 'catalytic', unitId: 'kat', dimensions: { amount: 1, time: -1 }, allowPrefixes: true },
  { symbol: 'rad', category: 'angle', unitId: 'rad', dimensions: { angle: 1 }, allowPrefixes: true },
  { symbol: 'sr', category: 'solid_angle', unitId: 'sr', dimensions: { solid_angle: 1 }, allowPrefixes: true },
  { symbol: 'ν', category: 'photon', unitId: 'photon_freq', dimensions: { mass: 1, length: 2, time: -2 }, allowPrefixes: true },
  { symbol: 'λ', category: 'photon', unitId: 'photon_wavelength', dimensions: { mass: 1, length: 2, time: -2 }, allowPrefixes: true },
];

export const SPECIALTY_DERIVED_UNITS = new Set([
  'Gy', 'Sv', 'Bq', 'kat', 'lm', 'lx', 'rad', 'sr', 'ν', 'λ',
]);

export const SI_UNITS_BY_COMPLEXITY: DerivedUnitInfo[] = [...SI_DERIVED_UNITS].sort((a, b) => {
  const aSum = Object.values(a.dimensions).reduce((sum, exp) => sum + Math.abs(exp || 0), 0);
  const bSum = Object.values(b.dimensions).reduce((sum, exp) => sum + Math.abs(exp || 0), 0);
  return bSum - aSum;
});

export const GENERAL_SI_DERIVED: DerivedUnitInfo[] = SI_UNITS_BY_COMPLEXITY.filter(
  u => !['Hz', 'Bq'].includes(u.symbol)
);

export const NORMALIZABLE_DERIVED_UNITS: NormalizableDerivedUnit[] = [
  { symbol: 'F', dimensions: { mass: -1, length: -2, time: 4, current: 2 }, exponentSum: 9 },
  { symbol: 'Ω', dimensions: { mass: 1, length: 2, time: -3, current: -2 }, exponentSum: 8 },
  { symbol: 'S', dimensions: { mass: -1, length: -2, time: 3, current: 2 }, exponentSum: 8 },
  { symbol: 'V', dimensions: { mass: 1, length: 2, time: -3, current: -1 }, exponentSum: 7 },
  { symbol: 'H', dimensions: { mass: 1, length: 2, time: -2, current: -2 }, exponentSum: 7 },
  { symbol: 'Wb', dimensions: { mass: 1, length: 2, time: -2, current: -1 }, exponentSum: 6 },
  { symbol: 'W', dimensions: { mass: 1, length: 2, time: -3 }, exponentSum: 6 },
  { symbol: 'J', dimensions: { mass: 1, length: 2, time: -2 }, exponentSum: 5 },
  { symbol: 'lx', dimensions: { intensity: 1, solid_angle: 1, length: -2 }, exponentSum: 4 },
  { symbol: 'Gy', dimensions: { length: 2, time: -2 }, exponentSum: 4 },
  { symbol: 'Pa', dimensions: { mass: 1, length: -1, time: -2 }, exponentSum: 4 },
  { symbol: 'N', dimensions: { mass: 1, length: 1, time: -2 }, exponentSum: 4 },
  { symbol: 'T', dimensions: { mass: 1, time: -2, current: -1 }, exponentSum: 4 },
  { symbol: 'C', dimensions: { current: 1, time: 1 }, exponentSum: 2 },
  { symbol: 'kat', dimensions: { amount: 1, time: -1 }, exponentSum: 2 },
  { symbol: 'lm', dimensions: { intensity: 1, solid_angle: 1 }, exponentSum: 2 },
].sort((a, b) => b.exponentSum - a.exponentSum);
