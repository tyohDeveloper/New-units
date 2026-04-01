import type { DimensionalFormula } from './dimensionalFormula';

export interface DerivedUnitInfo {
  symbol: string;
  category: string;
  unitId: string;
  dimensions: DimensionalFormula;
  allowPrefixes: boolean;
}
