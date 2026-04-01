import type { DimensionalFormula } from '../units/shared-types';
import type { CalcValue } from './types';
import { isDimensionless } from './isDimensionless';
import { dimensionsEqual } from './dimensionsEqual';
import { fixPrecision } from './fixPrecision';

export type RpnBinaryOp =
  | 'mul' | 'div' | 'add' | 'sub'
  | 'mulUnit' | 'divUnit' | 'addUnit' | 'subUnit'
  | 'pow';

export const applyRpnBinary = (
  y: CalcValue,
  x: CalcValue,
  op: RpnBinaryOp
): CalcValue | null => {
  let newValue: number;
  let newDimensions: Record<string, number> = {};

  switch (op) {
    case 'mul':
      newValue = fixPrecision(y.value * x.value);
      newDimensions = { ...x.dimensions };
      break;
    case 'div':
      if (x.value === 0) return null;
      newValue = fixPrecision(y.value / x.value);
      newDimensions = { ...x.dimensions };
      break;
    case 'add':
      newValue = fixPrecision(y.value + x.value);
      newDimensions = { ...x.dimensions };
      break;
    case 'sub':
      newValue = fixPrecision(y.value - x.value);
      newDimensions = { ...x.dimensions };
      break;
    case 'mulUnit':
      newValue = fixPrecision(y.value * x.value);
      for (const dim of Object.keys(y.dimensions))
        newDimensions[dim] = (y.dimensions as Record<string, number>)[dim] || 0;
      for (const dim of Object.keys(x.dimensions))
        newDimensions[dim] = (newDimensions[dim] || 0) + ((x.dimensions as Record<string, number>)[dim] || 0);
      break;
    case 'divUnit':
      if (x.value === 0) return null;
      newValue = fixPrecision(y.value / x.value);
      for (const dim of Object.keys(y.dimensions))
        newDimensions[dim] = (y.dimensions as Record<string, number>)[dim] || 0;
      for (const dim of Object.keys(x.dimensions))
        newDimensions[dim] = (newDimensions[dim] || 0) - ((x.dimensions as Record<string, number>)[dim] || 0);
      break;
    case 'addUnit':
      if (!dimensionsEqual(y.dimensions, x.dimensions) &&
          !isDimensionless(y.dimensions) && !isDimensionless(x.dimensions)) return null;
      newValue = fixPrecision(y.value + x.value);
      newDimensions = isDimensionless(x.dimensions) ? { ...y.dimensions } : { ...x.dimensions };
      break;
    case 'subUnit':
      if (!dimensionsEqual(y.dimensions, x.dimensions) &&
          !isDimensionless(y.dimensions) && !isDimensionless(x.dimensions)) return null;
      newValue = fixPrecision(y.value - x.value);
      newDimensions = isDimensionless(x.dimensions) ? { ...y.dimensions } : { ...x.dimensions };
      break;
    case 'pow':
      if (!isDimensionless(x.dimensions)) return null;
      if (y.value === 0 && x.value < 0) return null;
      if (y.value < 0 && !Number.isInteger(x.value)) return null;
      newValue = fixPrecision(Math.pow(y.value, x.value));
      for (const [dim, exp] of Object.entries(y.dimensions)) {
        const newExp = exp * x.value;
        if (newExp !== 0) newDimensions[dim] = newExp;
      }
      break;
    default:
      return null;
  }

  for (const [dim, exp] of Object.entries(newDimensions)) {
    if (exp === 0) delete newDimensions[dim];
  }

  return { value: newValue, dimensions: newDimensions as DimensionalFormula, prefix: 'none' };
};
