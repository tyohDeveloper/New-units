import type { DimensionalFormula } from '../units/shared-types';
import type { AlternativeRepresentation } from './types';
import { NON_SI_UNITS_CATALOG } from '../units/shared-types';
import { normalizeDimensions } from './normalizeDimensions';
import { formatDimensions } from './formatDimensions';
import { dimensionsEqual } from './dimensionsEqual';
import { canFactorOut } from './canFactorOut';
import { hasOnlyOriginalDimensions } from './hasOnlyOriginalDimensions';
import { subtractDimensions } from './subtractDimensions';
import { isValidSymbolRepresentation } from './isValidSymbolRepresentation';
import { SI_DERIVED_UNITS } from './siDerivedUnits';

export const generateAlternativeRepresentations = (
  dimensions: DimensionalFormula
): AlternativeRepresentation[] => {
  const alternatives: AlternativeRepresentation[] = [];
  const seenSymbols = new Set<string>();

  const normalizedSymbol = normalizeDimensions(dimensions);
  if (normalizedSymbol) {
    alternatives.push({ displaySymbol: normalizedSymbol, category: null, unitId: null, isHybrid: false, components: {} });
    seenSymbols.add(normalizedSymbol);
  }

  const rawSymbol = formatDimensions(dimensions);
  if (rawSymbol && !seenSymbols.has(rawSymbol)) {
    alternatives.push({ displaySymbol: rawSymbol, category: null, unitId: null, isHybrid: false, components: {} });
    seenSymbols.add(rawSymbol);
  }

  const siExact = buildSIExactMatches(dimensions, seenSymbols);
  alternatives.push(...siExact);

  const siHybrids = buildSIHybrids(dimensions, seenSymbols);
  alternatives.push(...siHybrids);

  const nonSIExact = buildNonSIExactMatches(dimensions, seenSymbols);
  alternatives.push(...nonSIExact);

  return alternatives;
};

function buildSIExactMatches(
  dimensions: DimensionalFormula,
  seenSymbols: Set<string>
): AlternativeRepresentation[] {
  const matches: AlternativeRepresentation[] = [];
  for (const derivedUnit of SI_DERIVED_UNITS) {
    if (dimensionsEqual(derivedUnit.dimensions, dimensions) && !seenSymbols.has(derivedUnit.symbol)) {
      matches.push({
        displaySymbol: derivedUnit.symbol,
        category: derivedUnit.category,
        unitId: derivedUnit.unitId,
        isHybrid: false,
        components: { derivedUnit }
      });
      seenSymbols.add(derivedUnit.symbol);
    }
  }
  matches.sort((a, b) => a.displaySymbol.localeCompare(b.displaySymbol));
  return matches;
}

function buildSIHybrids(
  dimensions: DimensionalFormula,
  seenSymbols: Set<string>
): AlternativeRepresentation[] {
  const hybrids: AlternativeRepresentation[] = [];
  for (const derivedUnit of SI_DERIVED_UNITS) {
    if (!canFactorOut(dimensions, derivedUnit)) continue;

    const remaining = subtractDimensions(dimensions, derivedUnit.dimensions);
    if (!hasOnlyOriginalDimensions(dimensions, remaining)) continue;

    const derivedDimCount = Object.keys(derivedUnit.dimensions).filter(
      k => derivedUnit.dimensions[k as keyof DimensionalFormula] !== 0
    ).length;

    if (derivedDimCount === 1) {
      const derivedDimKey = Object.keys(derivedUnit.dimensions).find(
        k => derivedUnit.dimensions[k as keyof DimensionalFormula] !== 0
      ) as keyof DimensionalFormula;
      if (remaining[derivedDimKey] !== undefined && remaining[derivedDimKey] !== 0) continue;
    }

    if (Object.keys(remaining).length === 0) continue;

    const hybridSymbol = buildHybridSymbol(derivedUnit.symbol, remaining);
    if (!seenSymbols.has(hybridSymbol) && isValidSymbolRepresentation(hybridSymbol)) {
      hybrids.push({
        displaySymbol: hybridSymbol,
        category: null,
        unitId: null,
        isHybrid: true,
        components: { derivedUnit, remainingDimensions: remaining }
      });
      seenSymbols.add(hybridSymbol);
    }
  }
  hybrids.sort((a, b) => a.displaySymbol.localeCompare(b.displaySymbol));
  return hybrids;
}

function buildHybridSymbol(derivedSymbol: string, remaining: DimensionalFormula): string {
  const positiveDims: DimensionalFormula = {};
  const negativeDims: DimensionalFormula = {};
  for (const [dim, exp] of Object.entries(remaining)) {
    if (exp > 0) positiveDims[dim as keyof DimensionalFormula] = exp;
    else if (exp < 0) negativeDims[dim as keyof DimensionalFormula] = exp;
  }
  const parts: string[] = [];
  const positiveSymbol = formatDimensions(positiveDims);
  if (positiveSymbol) parts.push(positiveSymbol);
  parts.push(derivedSymbol);
  const negativeSymbol = formatDimensions(negativeDims);
  if (negativeSymbol) parts.push(negativeSymbol);
  return parts.join('⋅');
}

function buildNonSIExactMatches(
  dimensions: DimensionalFormula,
  seenSymbols: Set<string>
): AlternativeRepresentation[] {
  const matches: AlternativeRepresentation[] = [];
  for (const nonSIUnit of NON_SI_UNITS_CATALOG) {
    if (dimensionsEqual(nonSIUnit.dimensions, dimensions) && !seenSymbols.has(nonSIUnit.symbol)) {
      matches.push({
        displaySymbol: nonSIUnit.symbol,
        category: nonSIUnit.category,
        unitId: nonSIUnit.unitId,
        isHybrid: false,
        components: { derivedUnit: nonSIUnit }
      });
      seenSymbols.add(nonSIUnit.symbol);
    }
  }
  matches.sort((a, b) => a.displaySymbol.localeCompare(b.displaySymbol));
  return matches;
}
