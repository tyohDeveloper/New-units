import type { DerivedUnitInfo } from './derivedUnitInfo';

export const NON_SI_UNITS_CATALOG: DerivedUnitInfo[] = [
  { symbol: 'dyn', category: 'force', unitId: 'dyn', dimensions: { mass: 1, length: 1, time: -2 }, allowPrefixes: true },
  { symbol: 'erg', category: 'energy', unitId: 'erg', dimensions: { mass: 1, length: 2, time: -2 }, allowPrefixes: true },
  { symbol: 'cal', category: 'energy', unitId: 'cal', dimensions: { mass: 1, length: 2, time: -2 }, allowPrefixes: true },
  { symbol: 'BTU', category: 'energy', unitId: 'btu', dimensions: { mass: 1, length: 2, time: -2 }, allowPrefixes: false },
  { symbol: 'Ba', category: 'pressure', unitId: 'barye', dimensions: { mass: 1, length: -1, time: -2 }, allowPrefixes: true },
  { symbol: 'atm', category: 'pressure', unitId: 'atm', dimensions: { mass: 1, length: -1, time: -2 }, allowPrefixes: false },
  { symbol: 'bar', category: 'pressure', unitId: 'bar', dimensions: { mass: 1, length: -1, time: -2 }, allowPrefixes: true },
  { symbol: 'psi', category: 'pressure', unitId: 'psi', dimensions: { mass: 1, length: -1, time: -2 }, allowPrefixes: false },
  { symbol: 'erg⋅s⁻¹', category: 'power', unitId: 'erg_per_s', dimensions: { mass: 1, length: 2, time: -3 }, allowPrefixes: false },
  { symbol: 'hp', category: 'power', unitId: 'hp', dimensions: { mass: 1, length: 2, time: -3 }, allowPrefixes: false },
  { symbol: 'Po', category: 'viscosity', unitId: 'poise', dimensions: { mass: 1, length: -1, time: -1 }, allowPrefixes: true },
  { symbol: 'St', category: 'kinematic_viscosity', unitId: 'stokes', dimensions: { length: 2, time: -1 }, allowPrefixes: true },
  { symbol: 'rayl', category: 'acoustic_impedance', unitId: 'rayl', dimensions: { mass: 1, length: -2, time: -1 }, allowPrefixes: true },
  { symbol: 'G', category: 'magnetic_density', unitId: 'gauss', dimensions: { mass: 1, time: -2, current: -1 }, allowPrefixes: true },
  { symbol: 'Mx', category: 'magnetic_flux', unitId: 'maxwell', dimensions: { mass: 1, length: 2, time: -2, current: -1 }, allowPrefixes: true },
  { symbol: 'Oe', category: 'magnetic_field_h', unitId: 'oersted', dimensions: { current: 1, length: -1 }, allowPrefixes: true },
  { symbol: 'ft²', category: 'area', unitId: 'ft2', dimensions: { length: 2 }, allowPrefixes: false },
  { symbol: 'ac', category: 'area', unitId: 'acre', dimensions: { length: 2 }, allowPrefixes: false },
  { symbol: 'gal', category: 'volume', unitId: 'gal', dimensions: { length: 3 }, allowPrefixes: false },
  { symbol: 'ft³', category: 'volume', unitId: 'ft3', dimensions: { length: 3 }, allowPrefixes: false },
];
