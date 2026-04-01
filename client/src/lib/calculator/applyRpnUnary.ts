import type { DimensionalFormula } from '../units/shared-types';
import type { CalcValue } from './types';
import { isDimensionless } from './isDimensionless';
import { isRadians } from './isRadians';
import { fixPrecision } from './fixPrecision';

export type RpnUnaryOp =
  | 'square' | 'cube' | 'sqrt' | 'cbrt' | 'recip'
  | 'exp' | 'ln' | 'pow10' | 'log10' | 'pow2' | 'log2'
  | 'sin' | 'cos' | 'tan' | 'asin' | 'acos' | 'atan'
  | 'sinh' | 'cosh' | 'tanh' | 'asinh' | 'acosh' | 'atanh'
  | 'rnd' | 'trunc' | 'floor' | 'ceil'
  | 'neg' | 'abs';

export const applyRpnUnary = (
  x: CalcValue,
  op: RpnUnaryOp,
  precision: number = 10
): CalcValue | null => {
  let newValue: number;
  let newDimensions: Record<string, number> = {};

  switch (op) {
    case 'square':
      newValue = fixPrecision(x.value * x.value);
      for (const [dim, exp] of Object.entries(x.dimensions)) newDimensions[dim] = exp * 2;
      break;
    case 'cube':
      newValue = fixPrecision(x.value * x.value * x.value);
      for (const [dim, exp] of Object.entries(x.dimensions)) newDimensions[dim] = exp * 3;
      break;
    case 'sqrt':
      if (x.value < 0) return null;
      newValue = fixPrecision(Math.sqrt(x.value));
      for (const [dim, exp] of Object.entries(x.dimensions)) newDimensions[dim] = Math.ceil(exp / 2);
      break;
    case 'cbrt':
      newValue = fixPrecision(Math.cbrt(x.value));
      for (const [dim, exp] of Object.entries(x.dimensions)) newDimensions[dim] = Math.ceil(exp / 3);
      break;
    case 'exp':
      newValue = fixPrecision(Math.exp(x.value));
      newDimensions = { ...x.dimensions };
      break;
    case 'ln':
      if (x.value <= 0) return null;
      newValue = fixPrecision(Math.log(x.value));
      newDimensions = { ...x.dimensions };
      break;
    case 'pow10':
      newValue = fixPrecision(Math.pow(10, x.value));
      newDimensions = { ...x.dimensions };
      break;
    case 'log10':
      if (x.value <= 0) return null;
      newValue = fixPrecision(Math.log10(x.value));
      newDimensions = { ...x.dimensions };
      break;
    case 'pow2':
      newValue = fixPrecision(Math.pow(2, x.value));
      newDimensions = { ...x.dimensions };
      break;
    case 'log2':
      if (x.value <= 0) return null;
      newValue = fixPrecision(Math.log2(x.value));
      newDimensions = { ...x.dimensions };
      break;
    case 'rnd': {
      const factor = Math.pow(10, precision);
      const scaled = x.value * factor;
      const rounded = Math.round(scaled);
      if (Math.abs(scaled - Math.floor(scaled) - 0.5) < 1e-10) {
        const floor = Math.floor(scaled);
        newValue = (floor % 2 === 0 ? floor : floor + 1) / factor;
      } else {
        newValue = rounded / factor;
      }
      newDimensions = { ...x.dimensions };
      break;
    }
    case 'trunc': {
      const factor = Math.pow(10, precision);
      newValue = Math.trunc(x.value * factor) / factor;
      newDimensions = { ...x.dimensions };
      break;
    }
    case 'floor': {
      const factor = Math.pow(10, precision);
      newValue = Math.floor(x.value * factor) / factor;
      newDimensions = { ...x.dimensions };
      break;
    }
    case 'ceil': {
      const factor = Math.pow(10, precision);
      newValue = Math.ceil(x.value * factor) / factor;
      newDimensions = { ...x.dimensions };
      break;
    }
    case 'neg':
      newValue = -x.value;
      newDimensions = { ...x.dimensions };
      break;
    case 'abs':
      newValue = Math.abs(x.value);
      newDimensions = { ...x.dimensions };
      break;
    case 'recip':
      if (x.value === 0) return null;
      newValue = fixPrecision(1 / x.value);
      for (const [dim, exp] of Object.entries(x.dimensions)) newDimensions[dim] = -exp;
      break;
    case 'sin':
      newValue = fixPrecision(Math.sin(x.value));
      newDimensions = isRadians(x.dimensions as DimensionalFormula) ? {} : { ...x.dimensions };
      break;
    case 'cos':
      newValue = fixPrecision(Math.cos(x.value));
      newDimensions = isRadians(x.dimensions as DimensionalFormula) ? {} : { ...x.dimensions };
      break;
    case 'tan':
      newValue = fixPrecision(Math.tan(x.value));
      newDimensions = isRadians(x.dimensions as DimensionalFormula) ? {} : { ...x.dimensions };
      break;
    case 'asin':
      if (x.value < -1 || x.value > 1) return null;
      newValue = fixPrecision(Math.asin(x.value));
      newDimensions = isDimensionless(x.dimensions as DimensionalFormula) ? { angle: 1 } : { ...x.dimensions };
      break;
    case 'acos':
      if (x.value < -1 || x.value > 1) return null;
      newValue = fixPrecision(Math.acos(x.value));
      newDimensions = isDimensionless(x.dimensions as DimensionalFormula) ? { angle: 1 } : { ...x.dimensions };
      break;
    case 'atan':
      newValue = fixPrecision(Math.atan(x.value));
      newDimensions = isDimensionless(x.dimensions as DimensionalFormula) ? { angle: 1 } : { ...x.dimensions };
      break;
    case 'sinh':
      newValue = fixPrecision(Math.sinh(x.value));
      newDimensions = isRadians(x.dimensions as DimensionalFormula) ? {} : { ...x.dimensions };
      break;
    case 'cosh':
      newValue = fixPrecision(Math.cosh(x.value));
      newDimensions = isRadians(x.dimensions as DimensionalFormula) ? {} : { ...x.dimensions };
      break;
    case 'tanh':
      newValue = fixPrecision(Math.tanh(x.value));
      newDimensions = isRadians(x.dimensions as DimensionalFormula) ? {} : { ...x.dimensions };
      break;
    case 'asinh':
      newValue = fixPrecision(Math.asinh(x.value));
      newDimensions = isDimensionless(x.dimensions as DimensionalFormula) ? { angle: 1 } : { ...x.dimensions };
      break;
    case 'acosh':
      if (x.value < 1) return null;
      newValue = fixPrecision(Math.acosh(x.value));
      newDimensions = isDimensionless(x.dimensions as DimensionalFormula) ? { angle: 1 } : { ...x.dimensions };
      break;
    case 'atanh':
      if (x.value <= -1 || x.value >= 1) return null;
      newValue = fixPrecision(Math.atanh(x.value));
      newDimensions = isDimensionless(x.dimensions as DimensionalFormula) ? { angle: 1 } : { ...x.dimensions };
      break;
    default:
      return null;
  }

  for (const [dim, exp] of Object.entries(newDimensions)) {
    if (exp === 0) delete newDimensions[dim];
  }

  return { value: newValue, dimensions: newDimensions as DimensionalFormula, prefix: 'none' };
};
