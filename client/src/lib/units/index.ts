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
