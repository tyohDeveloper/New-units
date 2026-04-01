import { PREFIXES } from './prefixes';
import { PREFIX_EXPONENTS, EXPONENT_TO_PREFIX } from './prefixExponents';

export interface MassDisplayResult {
  value: number;
  unitSymbol: string;
  prefixSymbol: string;
  normalizedPrefix: string;
  normalizedUnit: string;
  shouldNormalize: boolean;
}

function normalizeGramPrefixScaling(
  valueInKg: number,
  currentPrefix: string
): MassDisplayResult | null {
  if (currentPrefix === 'none' || currentPrefix === 'kilo') return null;
  const prefixExp = PREFIX_EXPONENTS[currentPrefix] || 0;
  const combinedExp = prefixExp + 3;
  const newPrefix = EXPONENT_TO_PREFIX[combinedExp];
  if (!newPrefix) return null;
  const newPrefixData = PREFIXES.find(p => p.id === newPrefix) || PREFIXES.find(p => p.id === 'none')!;
  const valueInGrams = valueInKg * 1000;
  return {
    value: valueInGrams / newPrefixData.factor,
    unitSymbol: 'g',
    prefixSymbol: newPrefixData.symbol,
    normalizedPrefix: newPrefix,
    normalizedUnit: 'g',
    shouldNormalize: true
  };
}

function normalizeStandardKgHandling(
  valueInKg: number,
  currentPrefix: string
): MassDisplayResult {
  const prefixData = PREFIXES.find(p => p.id === currentPrefix) || PREFIXES.find(p => p.id === 'none')!;
  return {
    value: currentPrefix === 'kilo' ? valueInKg : valueInKg / prefixData.factor,
    unitSymbol: 'kg',
    prefixSymbol: currentPrefix === 'kilo' ? '' : prefixData.symbol,
    normalizedPrefix: currentPrefix === 'kilo' ? 'none' : currentPrefix,
    normalizedUnit: 'kg',
    shouldNormalize: false
  };
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

  const gramResult = normalizeGramPrefixScaling(valueInKg, currentPrefix);
  if (gramResult) return gramResult;

  return normalizeStandardKgHandling(valueInKg, currentPrefix);
};
