import { useState } from 'react';
import type { CalcValue } from '@/lib/units/shared-types';
import type { UnitCategory } from '@/lib/units/types';

export interface UseCalculatorStateReturn {
  calculatorMode: 'simple' | 'rpn';
  setCalculatorMode: React.Dispatch<React.SetStateAction<'simple' | 'rpn'>>;
  shiftActive: boolean;
  setShiftActive: React.Dispatch<React.SetStateAction<boolean>>;
  calculatorPrecision: number;
  setCalculatorPrecision: React.Dispatch<React.SetStateAction<number>>;
  calcValues: Array<CalcValue | null>;
  setCalcValues: React.Dispatch<React.SetStateAction<Array<CalcValue | null>>>;
  calcOp1: '+' | '-' | '*' | '/' | null;
  setCalcOp1: React.Dispatch<React.SetStateAction<'+' | '-' | '*' | '/' | null>>;
  calcOp2: '+' | '-' | '*' | '/' | null;
  setCalcOp2: React.Dispatch<React.SetStateAction<'+' | '-' | '*' | '/' | null>>;
  resultUnit: string | null;
  setResultUnit: React.Dispatch<React.SetStateAction<string | null>>;
  resultCategory: UnitCategory | null;
  setResultCategory: React.Dispatch<React.SetStateAction<UnitCategory | null>>;
  resultPrefix: string;
  setResultPrefix: React.Dispatch<React.SetStateAction<string>>;
  selectedAlternative: number;
  setSelectedAlternative: React.Dispatch<React.SetStateAction<number>>;
}

export function useCalculatorState(): UseCalculatorStateReturn {
  const [calculatorMode, setCalculatorMode] = useState<'simple' | 'rpn'>('rpn');
  const [shiftActive, setShiftActive] = useState(false);
  const [calculatorPrecision, setCalculatorPrecision] = useState<number>(4);
  
  const [calcValues, setCalcValues] = useState<Array<CalcValue | null>>([null, null, null, null]);
  const [calcOp1, setCalcOp1] = useState<'+' | '-' | '*' | '/' | null>(null);
  const [calcOp2, setCalcOp2] = useState<'+' | '-' | '*' | '/' | null>(null);
  const [resultUnit, setResultUnit] = useState<string | null>(null);
  const [resultCategory, setResultCategory] = useState<UnitCategory | null>(null);
  const [resultPrefix, setResultPrefix] = useState<string>('none');
  const [selectedAlternative, setSelectedAlternative] = useState<number>(0);

  return {
    calculatorMode,
    setCalculatorMode,
    shiftActive,
    setShiftActive,
    calculatorPrecision,
    setCalculatorPrecision,
    calcValues,
    setCalcValues,
    calcOp1,
    setCalcOp1,
    calcOp2,
    setCalcOp2,
    resultUnit,
    setResultUnit,
    resultCategory,
    setResultCategory,
    resultPrefix,
    setResultPrefix,
    selectedAlternative,
    setSelectedAlternative,
  };
}
