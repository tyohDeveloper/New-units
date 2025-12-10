import { useState } from 'react';
import type { CalcValue } from '@/lib/units/shared-types';

export interface UseCalculatorStateReturn {
  calculatorMode: 'simple' | 'rpn';
  setCalculatorMode: React.Dispatch<React.SetStateAction<'simple' | 'rpn'>>;
  shiftActive: boolean;
  setShiftActive: React.Dispatch<React.SetStateAction<boolean>>;
  calculatorPrecision: number;
  setCalculatorPrecision: React.Dispatch<React.SetStateAction<number>>;
  flashCopyCalc: boolean;
  setFlashCopyCalc: React.Dispatch<React.SetStateAction<boolean>>;
  calcValues: Array<CalcValue | null>;
  setCalcValues: React.Dispatch<React.SetStateAction<Array<CalcValue | null>>>;
  calcOp1: '+' | '-' | '*' | '/' | null;
  setCalcOp1: React.Dispatch<React.SetStateAction<'+' | '-' | '*' | '/' | null>>;
  calcOp2: '+' | '-' | '*' | '/' | null;
  setCalcOp2: React.Dispatch<React.SetStateAction<'+' | '-' | '*' | '/' | null>>;
  resultUnit: string | null;
  setResultUnit: React.Dispatch<React.SetStateAction<string | null>>;
  resultCategory: string | null;
  setResultCategory: React.Dispatch<React.SetStateAction<string | null>>;
  resultPrefix: string;
  setResultPrefix: React.Dispatch<React.SetStateAction<string>>;
  selectedAlternative: number;
  setSelectedAlternative: React.Dispatch<React.SetStateAction<number>>;
  flashCalcField1: boolean;
  setFlashCalcField1: React.Dispatch<React.SetStateAction<boolean>>;
  flashCalcField2: boolean;
  setFlashCalcField2: React.Dispatch<React.SetStateAction<boolean>>;
  flashCalcField3: boolean;
  setFlashCalcField3: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useCalculatorState(): UseCalculatorStateReturn {
  const [calculatorMode, setCalculatorMode] = useState<'simple' | 'rpn'>('rpn');
  const [shiftActive, setShiftActive] = useState(false);
  const [calculatorPrecision, setCalculatorPrecision] = useState<number>(4);
  const [flashCopyCalc, setFlashCopyCalc] = useState<boolean>(false);
  
  const [calcValues, setCalcValues] = useState<Array<CalcValue | null>>([null, null, null, null]);
  const [calcOp1, setCalcOp1] = useState<'+' | '-' | '*' | '/' | null>(null);
  const [calcOp2, setCalcOp2] = useState<'+' | '-' | '*' | '/' | null>(null);
  const [resultUnit, setResultUnit] = useState<string | null>(null);
  const [resultCategory, setResultCategory] = useState<string | null>(null);
  const [resultPrefix, setResultPrefix] = useState<string>('none');
  const [selectedAlternative, setSelectedAlternative] = useState<number>(0);
  
  const [flashCalcField1, setFlashCalcField1] = useState<boolean>(false);
  const [flashCalcField2, setFlashCalcField2] = useState<boolean>(false);
  const [flashCalcField3, setFlashCalcField3] = useState<boolean>(false);

  return {
    calculatorMode,
    setCalculatorMode,
    shiftActive,
    setShiftActive,
    calculatorPrecision,
    setCalculatorPrecision,
    flashCopyCalc,
    setFlashCopyCalc,
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
    flashCalcField1,
    setFlashCalcField1,
    flashCalcField2,
    setFlashCalcField2,
    flashCalcField3,
    setFlashCalcField3,
  };
}
