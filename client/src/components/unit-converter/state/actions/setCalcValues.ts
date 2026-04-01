import type { CalcValue } from '@/lib/units/calcValue';
import type { CalculatorAction } from '../calculatorReducer';
export const setCalcValues = (v: Array<CalcValue | null>): CalculatorAction =>
  ({ type: 'SET_CALC_VALUES', payload: v });
