import type { DimensionalFormula } from './shared-types';
import { CATEGORY_DIMENSIONS, EXCLUDED_CROSS_DOMAIN_CATEGORIES } from '../calculator/categoryDimensions';
import { dimensionsEqual } from '../calculator/dimensionsEqual';

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
    if (dimensionsEqual(dimensions, info.dimensions)) matches.push(info.name);
  }

  return matches;
};
