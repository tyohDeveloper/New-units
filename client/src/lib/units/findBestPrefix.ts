import { PREFIXES } from './prefixes';

export const findBestPrefix = (value: number): string => {
  if (value === 0) return 'none';

  const absValue = Math.abs(value);
  let bestPrefix = 'none';
  let bestScore = Infinity;

  for (const prefix of PREFIXES) {
    const convertedValue = absValue / prefix.factor;
    let score: number;
    if (convertedValue >= 1) {
      const integerPart = Math.floor(convertedValue);
      const numDigits = integerPart === 0 ? 1 : Math.floor(Math.log10(integerPart)) + 1;
      score = numDigits;
    } else {
      score = 1000 + (1 - convertedValue);
    }
    if (score < bestScore) {
      bestScore = score;
      bestPrefix = prefix.id;
    }
  }

  return bestPrefix;
};
