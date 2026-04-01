import type { DimensionalFormula } from '../units/dimensionalFormula';
import type { SIRepresentation } from './types';
import { isDimensionEmpty } from './isDimensionEmpty';
import { isValidSIComposition } from './isValidSIComposition';
import { subtractDimensions } from './subtractDimensions';
import { formatSIComposition } from './formatSIComposition';
import { isValidSymbolRepresentation } from './isValidSymbolRepresentation';
import { formatDimensions } from './formatDimensions';
import { countUnits } from './countUnits';
import { sumAbsExponents } from './sumAbsExponents';
import { findCrossDomainMatches } from './findCrossDomainMatches';
import { SI_DERIVED_UNITS, GENERAL_SI_DERIVED, SPECIALTY_DERIVED_UNITS } from './siDerivedUnits';
import { getDimensionSignature } from '../units/getDimensionSignature';
import { PREFERRED_REPRESENTATIONS } from '../units/preferredRepresentations';

export { PREFERRED_REPRESENTATIONS };

export const generateSIRepresentations = (
  dimensions: DimensionalFormula,
  _getDimensionSignature?: (dims: DimensionalFormula) => string,
  _PREFERRED?: Record<string, { displaySymbol: string; isSI: boolean }>
): SIRepresentation[] => {
  if (isDimensionEmpty(dimensions)) {
    return [{ displaySymbol: '1', derivedUnits: [], depth: 0 }];
  }

  const representations: SIRepresentation[] = [];
  const seenSymbols = new Set<string>();

  for (const derivedUnit of GENERAL_SI_DERIVED) {
    if (!isValidSIComposition(dimensions, derivedUnit.dimensions)) continue;

    const remaining = subtractDimensions(dimensions, derivedUnit.dimensions);

    const derivedDimCount = Object.keys(derivedUnit.dimensions).filter(
      k => derivedUnit.dimensions[k as keyof DimensionalFormula] !== 0
    ).length;

    if (derivedDimCount === 1) {
      const derivedDimKey = Object.keys(derivedUnit.dimensions).find(
        k => derivedUnit.dimensions[k as keyof DimensionalFormula] !== 0
      ) as keyof DimensionalFormula;
      if (remaining[derivedDimKey] !== undefined && remaining[derivedDimKey] !== 0) continue;
    }

    const compositionSymbol = formatSIComposition([derivedUnit.symbol], remaining);

    if (!seenSymbols.has(compositionSymbol) && isValidSymbolRepresentation(compositionSymbol)) {
      seenSymbols.add(compositionSymbol);
      representations.push({
        displaySymbol: compositionSymbol,
        derivedUnits: [derivedUnit.symbol],
        depth: 1
      });
    }
  }

  const rawSymbol = formatDimensions(dimensions);
  if (rawSymbol && !seenSymbols.has(rawSymbol) && isValidSymbolRepresentation(rawSymbol)) {
    representations.push({ displaySymbol: rawSymbol, derivedUnits: [], depth: 0 });
  }

  const baseTermCount = rawSymbol ? countUnits(rawSymbol) : 0;
  const filteredRepresentations = baseTermCount === 0
    ? representations
    : representations.filter(rep => rep.depth === 0 || countUnits(rep.displaySymbol) <= baseTermCount);

  const usesSpecialtyUnit = (rep: SIRepresentation): boolean =>
    rep.derivedUnits?.some(u => SPECIALTY_DERIVED_UNITS.has(u)) ?? false;

  filteredRepresentations.sort((a, b) => {
    if (a.depth === 0 && b.depth !== 0) return 1;
    if (a.depth !== 0 && b.depth === 0) return -1;
    const unitDiff = countUnits(a.displaySymbol) - countUnits(b.displaySymbol);
    if (unitDiff !== 0) return unitDiff;
    const expDiff = sumAbsExponents(a.displaySymbol) - sumAbsExponents(b.displaySymbol);
    if (expDiff !== 0) return expDiff;
    const aSpecialty = usesSpecialtyUnit(a);
    const bSpecialty = usesSpecialtyUnit(b);
    if (aSpecialty && !bSpecialty) return 1;
    if (!aSpecialty && bSpecialty) return -1;
    return a.displaySymbol.localeCompare(b.displaySymbol);
  });

  promotePerfectSIMatch(filteredRepresentations);
  applyPreferredRepresentation(filteredRepresentations, dimensions);

  for (const rep of filteredRepresentations) {
    const crossMatches = findCrossDomainMatches(dimensions);
    if (crossMatches.length > 0) rep.crossDomainMatches = crossMatches;
  }

  return filteredRepresentations;
};

function promotePerfectSIMatch(reps: SIRepresentation[]): void {
  const idx = reps.findIndex(rep =>
    rep.derivedUnits.length === 1 &&
    rep.displaySymbol === rep.derivedUnits[0] &&
    SI_DERIVED_UNITS.some(u => u.symbol === rep.derivedUnits[0])
  );
  if (idx > 0) {
    const [match] = reps.splice(idx, 1);
    reps.unshift(match);
  }
}

function applyPreferredRepresentation(
  reps: SIRepresentation[],
  dimensions: DimensionalFormula
): void {
  const dimSignature = getDimensionSignature(dimensions);
  const preferred = PREFERRED_REPRESENTATIONS[dimSignature];
  if (!preferred) return;

  const existingIndex = reps.findIndex(r => r.displaySymbol === preferred.displaySymbol);
  if (existingIndex > 0) {
    const [existing] = reps.splice(existingIndex, 1);
    reps.unshift(existing);
  } else if (existingIndex === -1) {
    reps.unshift({
      displaySymbol: preferred.displaySymbol,
      derivedUnits: preferred.isSI ? [preferred.displaySymbol.split('⋅')[0]] : [],
      depth: preferred.isSI ? 1 : 0
    });
  }
}
