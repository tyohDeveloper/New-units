import type { CalculatorState } from '../calculatorReducer';

export const selectCalculatorMode = (s: CalculatorState) => s.calculatorMode;
export const selectShiftActive = (s: CalculatorState) => s.shiftActive;
export const selectCalculatorPrecision = (s: CalculatorState) => s.calculatorPrecision;
export const selectCalcValues = (s: CalculatorState) => s.calcValues;
export const selectCalcOp1 = (s: CalculatorState) => s.calcOp1;
export const selectCalcOp2 = (s: CalculatorState) => s.calcOp2;
export const selectResultUnit = (s: CalculatorState) => s.resultUnit;
export const selectResultCategory = (s: CalculatorState) => s.resultCategory;
export const selectResultPrefix = (s: CalculatorState) => s.resultPrefix;
export const selectSelectedAlternative = (s: CalculatorState) => s.selectedAlternative;
