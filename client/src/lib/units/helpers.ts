import {
  type DimensionalFormula,
  type CategoryDimensionInfo,
  type PreferredRepresentation,
  CATEGORY_DIMENSIONS,
  EXCLUDED_CROSS_DOMAIN_CATEGORIES,
  PREFERRED_REPRESENTATIONS,
  getDimensionSignature,
  dimensionsEqual,
} from './shared-types';
import { PREFIXES } from './prefixes';

export type { CategoryDimensionInfo, PreferredRepresentation };
export { CATEGORY_DIMENSIONS, EXCLUDED_CROSS_DOMAIN_CATEGORIES, PREFERRED_REPRESENTATIONS, getDimensionSignature, dimensionsEqual };

export const PREFIX_EXPONENTS: Record<string, number> = {
  'yotta': 24, 'zetta': 21, 'exa': 18, 'peta': 15, 'tera': 12,
  'giga': 9, 'mega': 6, 'kilo': 3, 'none': 0, 'centi': -2,
  'milli': -3, 'micro': -6, 'nano': -9, 'pico': -12,
  'femto': -15, 'atto': -18, 'zepto': -21, 'yocto': -24
};

export const EXPONENT_TO_PREFIX: Record<number, string> = {
  24: 'yotta', 21: 'zetta', 18: 'exa', 15: 'peta', 12: 'tera',
  9: 'giga', 6: 'mega', 3: 'kilo', 0: 'none', 
  [-2]: 'centi', [-3]: 'milli', [-6]: 'micro', [-9]: 'nano', [-12]: 'pico',
  [-15]: 'femto', [-18]: 'atto', [-21]: 'zepto', [-24]: 'yocto'
};

export const GRAM_TO_KG_UNIT_PAIRS: Record<string, string> = {
  'g': 'kg',
  'gm3': 'kgm3',
  'gms': 'kgms',
  'jgk': 'jkgk',
};

export const KG_TO_GRAM_UNIT_PAIRS: Record<string, string> = {
  'kg': 'g',
  'kgm3': 'gm3',
  'kgms': 'gms',
  'jkgk': 'jgk',
};

export const toTitleCase = (str: string): string => {
  return str.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export const applyRegionalSpelling = (unitName: string, language: string): string => {
  if (language !== 'en' && language !== 'en-us') {
    return unitName;
  }
  
  if (language === 'en-us') {
    return unitName
      .replace(/\s*\(Petrol\)/g, '')
      .replace(/\s*\(Paraffin\)/g, '');
  }
  
  return unitName
    .replace(/Gasoline\s*\(Petrol\)/g, 'Petrol')
    .replace(/Kerosene\s*\(Paraffin\)/g, 'Paraffin')
    .replace(/Gasoline/g, 'Petrol')
    .replace(/Kerosene/g, 'Paraffin')
    .replace(/Meter/g, 'Metre')
    .replace(/meter/g, 'metre')
    .replace(/Liter/g, 'Litre')
    .replace(/liter/g, 'litre');
};

export const normalizeMassUnit = (
  unit: string, 
  prefix: string
): { unit: string; prefix: string } => {
  const gEquivalent = KG_TO_GRAM_UNIT_PAIRS[unit];
  if (gEquivalent && prefix !== 'none' && prefix !== 'kilo') {
    return { unit: gEquivalent, prefix };
  }
  
  const kgEquivalent = GRAM_TO_KG_UNIT_PAIRS[unit];
  if (kgEquivalent && prefix === 'kilo') {
    return { unit: kgEquivalent, prefix: 'none' };
  }
  
  return { unit, prefix };
};

export interface MassDisplayResult {
  value: number; 
  unitSymbol: string; 
  prefixSymbol: string;
  normalizedPrefix: string;
  normalizedUnit: string;
  shouldNormalize: boolean;
}

export const normalizeMassDisplay = (
  valueInKg: number, 
  currentPrefix: string, 
  unitId: string | null,
  getUnitInfo: (unitId: string) => { factor: number; symbol: string; allowPrefixes: boolean } | undefined
): MassDisplayResult => {
  const isKgUnit = unitId === 'kg' || unitId === null;
  
  if (!isKgUnit) {
    const prefixData = PREFIXES.find(p => p.id === currentPrefix) || PREFIXES.find(p => p.id === 'none')!;
    const unit = unitId ? getUnitInfo(unitId) : undefined;
    return {
      value: unit ? valueInKg / (unit.factor * (unit.allowPrefixes ? prefixData.factor : 1)) : valueInKg,
      unitSymbol: unit?.symbol || 'kg',
      prefixSymbol: unit?.allowPrefixes ? prefixData.symbol : '',
      normalizedPrefix: currentPrefix,
      normalizedUnit: unitId || 'kg',
      shouldNormalize: false
    };
  }
  
  if (currentPrefix !== 'none' && currentPrefix !== 'kilo') {
    const prefixExp = PREFIX_EXPONENTS[currentPrefix] || 0;
    const combinedExp = prefixExp + 3;
    
    const newPrefix = EXPONENT_TO_PREFIX[combinedExp];
    if (newPrefix) {
      const newPrefixData = PREFIXES.find(p => p.id === newPrefix) || PREFIXES.find(p => p.id === 'none')!;
      const valueInGrams = valueInKg * 1000;
      const displayValue = valueInGrams / newPrefixData.factor;
      return {
        value: displayValue,
        unitSymbol: 'g',
        prefixSymbol: newPrefixData.symbol,
        normalizedPrefix: newPrefix,
        normalizedUnit: 'g',
        shouldNormalize: true
      };
    }
  }
  
  const prefixData = PREFIXES.find(p => p.id === currentPrefix) || PREFIXES.find(p => p.id === 'none')!;
  return {
    value: currentPrefix === 'kilo' ? valueInKg : valueInKg / prefixData.factor,
    unitSymbol: 'kg',
    prefixSymbol: currentPrefix === 'kilo' ? '' : prefixData.symbol,
    normalizedPrefix: currentPrefix === 'kilo' ? 'none' : currentPrefix,
    normalizedUnit: 'kg',
    shouldNormalize: false
  };
};

export const normalizeMassValue = (valueInKg: number): { 
  value: number; 
  unitSymbol: string; 
  prefixSymbol: string;
  prefixId: string;
} => {
  const valueInGrams = valueInKg * 1000;
  const absGrams = Math.abs(valueInGrams);
  
  const prefixOrder = [
    { id: 'yotta', exp: 24 }, { id: 'zetta', exp: 21 }, { id: 'exa', exp: 18 },
    { id: 'peta', exp: 15 }, { id: 'tera', exp: 12 }, { id: 'giga', exp: 9 },
    { id: 'mega', exp: 6 }, { id: 'kilo', exp: 3 }, { id: 'none', exp: 0 },
    { id: 'milli', exp: -3 }, { id: 'micro', exp: -6 }, { id: 'nano', exp: -9 },
    { id: 'pico', exp: -12 }, { id: 'femto', exp: -15 }, { id: 'atto', exp: -18 },
    { id: 'zepto', exp: -21 }, { id: 'yocto', exp: -24 }
  ];
  
  let bestPrefix = { id: 'none', exp: 0 };
  for (const p of prefixOrder) {
    const factor = Math.pow(10, p.exp);
    if (absGrams >= factor) {
      bestPrefix = p;
      break;
    }
  }
  
  if (bestPrefix.id === 'kilo') {
    return {
      value: valueInKg,
      unitSymbol: 'kg',
      prefixSymbol: '',
      prefixId: 'none'
    };
  }
  
  const prefixData = PREFIXES.find(p => p.id === bestPrefix.id) || PREFIXES.find(p => p.id === 'none')!;
  const displayValue = valueInGrams / prefixData.factor;
  
  return {
    value: displayValue,
    unitSymbol: 'g',
    prefixSymbol: prefixData.symbol,
    prefixId: bestPrefix.id
  };
};

export const applyPrefixToKgUnit = (
  unitSymbol: string, 
  prefixId: string
): { displaySymbol: string; effectivePrefixFactor: number; showPrefix: boolean } => {
  const containsKg = unitSymbol.includes('kg');
  
  if (!containsKg) {
    const prefixData = PREFIXES.find(p => p.id === prefixId) || PREFIXES.find(p => p.id === 'none')!;
    return {
      displaySymbol: unitSymbol,
      effectivePrefixFactor: prefixData.factor,
      showPrefix: prefixId !== 'none'
    };
  }
  
  if (prefixId === 'none' || prefixId === 'kilo') {
    return {
      displaySymbol: unitSymbol,
      effectivePrefixFactor: 1,
      showPrefix: false
    };
  }
  
  const prefixData = PREFIXES.find(p => p.id === prefixId) || PREFIXES.find(p => p.id === 'none')!;
  const transformedSymbol = unitSymbol.replace(/kg/g, prefixData.symbol + 'g');
  const effectivePrefixFactor = 1000 / prefixData.factor;
  
  return {
    displaySymbol: transformedSymbol,
    effectivePrefixFactor,
    showPrefix: false
  };
};

export const findCrossDomainMatches = (
  dimensions: DimensionalFormula, 
  _currentCategory?: string
): string[] => {
  const matches: string[] = [];
  
  if (Object.keys(dimensions).length === 0) return matches;
  
  for (const [catId, info] of Object.entries(CATEGORY_DIMENSIONS)) {
    if (info.isBase) continue;
    if (EXCLUDED_CROSS_DOMAIN_CATEGORIES.includes(catId)) continue;
    if (Object.keys(info.dimensions).length === 0) continue;
    
    if (dimensionsEqual(dimensions, info.dimensions)) {
      matches.push(info.name);
    }
  }
  
  return matches;
};

export const buildDimensionalSymbol = (dims: DimensionalFormula): string => {
  const siSymbols: Record<keyof DimensionalFormula, string> = {
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
  
  const superscripts: Record<string, string> = {
    '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
    '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻'
  };
  
  const toSuperscript = (n: number): string => {
    return String(n).split('').map(c => superscripts[c] || c).join('');
  };
  
  const parts: string[] = [];
  
  const positiveTerms = Object.entries(dims)
    .filter(([_, exp]) => exp !== undefined && exp > 0)
    .sort(([a], [b]) => a.localeCompare(b));
    
  const negativeTerms = Object.entries(dims)
    .filter(([_, exp]) => exp !== undefined && exp < 0)
    .sort(([a], [b]) => a.localeCompare(b));
  
  for (const [dim, exp] of positiveTerms) {
    const symbol = siSymbols[dim as keyof DimensionalFormula] || dim;
    parts.push(exp === 1 ? symbol : `${symbol}${toSuperscript(exp!)}`);
  }
  
  for (const [dim, exp] of negativeTerms) {
    const symbol = siSymbols[dim as keyof DimensionalFormula] || dim;
    parts.push(`${symbol}${toSuperscript(exp!)}`);
  }
  
  return parts.join('⋅');
};

// Find best SI prefix for a value (prefix that produces smallest integer)
export const findBestPrefix = (value: number): string => {
  if (value === 0) return 'none';
  
  const absValue = Math.abs(value);
  let bestPrefix = 'none';
  let bestScore = Infinity;

  for (const prefix of PREFIXES) {
    const convertedValue = absValue / prefix.factor;
    
    // Calculate score based on integer part length
    let score: number;
    if (convertedValue >= 1) {
      const integerPart = Math.floor(convertedValue);
      const numDigits = integerPart === 0 ? 1 : Math.floor(Math.log10(integerPart)) + 1;
      score = numDigits;
    } else {
      // Penalize fractional results heavily
      score = 1000 + (1 - convertedValue);
    }
    
    if (score < bestScore) {
      bestScore = score;
      bestPrefix = prefix.id;
    }
  }

  return bestPrefix;
};
