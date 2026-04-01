import { PREFIXES } from './prefixes';

export const applyPrefixToKgUnit = (
  unitSymbol: string,
  prefixId: string
): { displaySymbol: string; effectivePrefixFactor: number; showPrefix: boolean } => {
  const containsKg = unitSymbol.includes('kg');

  if (!containsKg) {
    const prefixData = PREFIXES.find(p => p.id === prefixId) || PREFIXES.find(p => p.id === 'none')!;
    return { displaySymbol: unitSymbol, effectivePrefixFactor: prefixData.factor, showPrefix: prefixId !== 'none' };
  }

  if (prefixId === 'none' || prefixId === 'kilo') {
    return { displaySymbol: unitSymbol, effectivePrefixFactor: 1, showPrefix: false };
  }

  const prefixData = PREFIXES.find(p => p.id === prefixId) || PREFIXES.find(p => p.id === 'none')!;
  const transformedSymbol = unitSymbol.replace(/kg/g, prefixData.symbol + 'g');
  const effectivePrefixFactor = 1000 / prefixData.factor;

  return { displaySymbol: transformedSymbol, effectivePrefixFactor, showPrefix: false };
};
