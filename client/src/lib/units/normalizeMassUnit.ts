export const GRAM_TO_KG_UNIT_PAIRS: Record<string, string> = {
  'g': 'kg', 'gm3': 'kgm3', 'gms': 'kgms', 'jgk': 'jkgk',
};

export const KG_TO_GRAM_UNIT_PAIRS: Record<string, string> = {
  'kg': 'g', 'kgm3': 'gm3', 'kgms': 'gms', 'jkgk': 'jgk',
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
