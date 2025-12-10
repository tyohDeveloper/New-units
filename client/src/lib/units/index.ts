export type { 
  UnitCategory, 
  Prefix, 
  UnitDefinition, 
  CategoryDefinition 
} from './types';

export { 
  PREFIXES, 
  BINARY_PREFIXES, 
  ALL_PREFIXES, 
  findOptimalPrefix 
} from './prefixes';

export type {
  DimensionalFormula,
  CalcValue,
  DerivedUnitInfo,
  NumberFormat,
  SupportedLanguageCode,
  SIBaseUnitSymbol,
} from './shared-types';

export {
  SI_DERIVED_UNITS,
  ISO_LANGUAGES,
  SI_BASE_UNIT_SYMBOLS,
  SI_BASE_TO_DIMENSION,
  DIMENSION_TO_SI_SYMBOL,
} from './shared-types';

export {
  CONVERSION_DATA,
  convert,
  applyMathFunction,
  parseUnitText,
  parseUnitSymbol,
  buildUnitSymbolMap,
  type ParsedUnitResult,
} from '../conversion-data';

export {
  PREFIX_EXPONENTS,
  EXPONENT_TO_PREFIX,
  GRAM_TO_KG_UNIT_PAIRS,
  KG_TO_GRAM_UNIT_PAIRS,
  toTitleCase,
  applyRegionalSpelling,
  normalizeMassUnit,
  normalizeMassValue,
  applyPrefixToKgUnit,
  getDimensionSignature,
  dimensionsEqual,
  CATEGORY_DIMENSIONS,
  EXCLUDED_CROSS_DOMAIN_CATEGORIES,
  findCrossDomainMatches,
  PREFERRED_REPRESENTATIONS,
  buildDimensionalSymbol,
  type CategoryDimensionInfo,
  type PreferredRepresentation,
} from './helpers';
