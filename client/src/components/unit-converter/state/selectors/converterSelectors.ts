import type { ConverterState } from '../converterReducer';

export const selectActiveCategory = (s: ConverterState) => s.activeCategory;
export const selectFromUnit = (s: ConverterState) => s.fromUnit;
export const selectToUnit = (s: ConverterState) => s.toUnit;
export const selectFromPrefix = (s: ConverterState) => s.fromPrefix;
export const selectToPrefix = (s: ConverterState) => s.toPrefix;
export const selectInputValue = (s: ConverterState) => s.inputValue;
export const selectResult = (s: ConverterState) => s.result;
export const selectPrecision = (s: ConverterState) => s.precision;
export const selectComparisonMode = (s: ConverterState) => s.comparisonMode;
