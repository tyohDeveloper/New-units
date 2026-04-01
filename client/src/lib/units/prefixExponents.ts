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
