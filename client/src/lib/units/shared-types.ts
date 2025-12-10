export interface DimensionalFormula {
  length?: number;
  mass?: number;
  time?: number;
  current?: number;
  temperature?: number;
  amount?: number;
  intensity?: number;
  angle?: number;
  solid_angle?: number;
}

export interface CalcValue {
  value: number;
  dimensions: DimensionalFormula;
  prefix: string;
}

export interface DerivedUnitInfo {
  symbol: string;
  category: string;
  unitId: string;
  dimensions: DimensionalFormula;
  allowPrefixes: boolean;
}

export type NumberFormat = 
  | 'uk' 
  | 'europe-latin' 
  | 'period' 
  | 'comma' 
  | 'arabic' 
  | 'east-asian' 
  | 'south-asian' 
  | 'swiss';

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
  { symbol: 'Gy', category: 'radiation_dose', unitId: 'gy', dimensions: { length: 2, time: -2 }, allowPrefixes: true },
  { symbol: 'Sv', category: 'equivalent_dose', unitId: 'sv', dimensions: { length: 2, time: -2 }, allowPrefixes: true },
  { symbol: 'kat', category: 'catalytic', unitId: 'kat', dimensions: { amount: 1, time: -1 }, allowPrefixes: true },
  { symbol: 'rad', category: 'angle', unitId: 'rad', dimensions: { angle: 1 }, allowPrefixes: true },
  { symbol: 'sr', category: 'solid_angle', unitId: 'sr', dimensions: { solid_angle: 1 }, allowPrefixes: true },
];

export const ISO_LANGUAGES = [
  'ar', 'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'fi', 'fr', 'he', 'hi', 
  'hr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nl', 'no', 'pl', 'pt', 
  'ro', 'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'uk', 'vi', 'zh', 'zh_TW'
] as const;

export type SupportedLanguageCode = typeof ISO_LANGUAGES[number];

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
