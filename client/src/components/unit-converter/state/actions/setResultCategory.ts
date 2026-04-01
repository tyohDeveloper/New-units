import type { UnitCategory } from '@/lib/units/unitCategory';
import type { CalculatorAction } from '../calculatorReducer';
export const setResultCategory = (v: UnitCategory | null): CalculatorAction =>
  ({ type: 'SET_RESULT_CATEGORY', payload: v });
