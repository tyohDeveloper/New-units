import type { DimensionalFormula, DerivedUnitInfo } from '../units/shared-types';

export type { DimensionalFormula, DerivedUnitInfo };

export interface CalcValue {
  value: number;
  dimensions: DimensionalFormula;
}

export interface CategoryDimensionInfo {
  name: string;
  dimensions: DimensionalFormula;
  isBase: boolean;
}

export interface SIRepresentation {
  displaySymbol: string;
  derivedUnits: string[];
  depth: number;
  crossDomainMatches?: string[];
}

export interface AlternativeRepresentation {
  displaySymbol: string;
  category: string | null;
  unitId: string | null;
  isHybrid: boolean;
  components: {
    derivedUnit?: DerivedUnitInfo;
    remainingDimensions?: DimensionalFormula;
  };
}

export interface NormalizableDerivedUnit {
  symbol: string;
  dimensions: DimensionalFormula;
  exponentSum: number;
}

export interface DerivedUnitPowerMatch {
  symbol: string;
  baseSymbol: string;
  power: number;
  category: string;
}
