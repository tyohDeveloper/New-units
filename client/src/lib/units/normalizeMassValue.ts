import { PREFIXES } from './prefixes';

const PREFIX_ORDER = [
  { id: 'yotta', exp: 24 }, { id: 'zetta', exp: 21 }, { id: 'exa', exp: 18 },
  { id: 'peta', exp: 15 }, { id: 'tera', exp: 12 }, { id: 'giga', exp: 9 },
  { id: 'mega', exp: 6 }, { id: 'kilo', exp: 3 }, { id: 'none', exp: 0 },
  { id: 'milli', exp: -3 }, { id: 'micro', exp: -6 }, { id: 'nano', exp: -9 },
  { id: 'pico', exp: -12 }, { id: 'femto', exp: -15 }, { id: 'atto', exp: -18 },
  { id: 'zepto', exp: -21 }, { id: 'yocto', exp: -24 }
];

export const normalizeMassValue = (valueInKg: number): {
  value: number;
  unitSymbol: string;
  prefixSymbol: string;
  prefixId: string;
} => {
  const valueInGrams = valueInKg * 1000;
  const absGrams = Math.abs(valueInGrams);

  let bestPrefix = { id: 'none', exp: 0 };
  for (const p of PREFIX_ORDER) {
    const factor = Math.pow(10, p.exp);
    if (absGrams >= factor) { bestPrefix = p; break; }
  }

  if (bestPrefix.id === 'kilo') {
    return { value: valueInKg, unitSymbol: 'kg', prefixSymbol: '', prefixId: 'none' };
  }

  const prefixData = PREFIXES.find(p => p.id === bestPrefix.id) || PREFIXES.find(p => p.id === 'none')!;
  return {
    value: valueInGrams / prefixData.factor,
    unitSymbol: 'g',
    prefixSymbol: prefixData.symbol,
    prefixId: bestPrefix.id
  };
};
