import type { CalcValue } from '@/lib/units/calcValue';
import type { CalculatorAction } from '../calculatorReducer';
export const updateCalcValues = (
  updater: (prev: Array<CalcValue | null>) => Array<CalcValue | null>
): CalculatorAction => ({ type: 'UPDATE_CALC_VALUES', payload: updater });
