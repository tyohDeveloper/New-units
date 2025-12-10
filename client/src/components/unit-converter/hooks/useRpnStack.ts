import { useState, useCallback } from 'react';
import type { CalcValue, DimensionalFormula } from '@/lib/units/shared-types';

export interface UseRpnStackReturn {
  rpnStack: Array<CalcValue | null>;
  setRpnStack: React.Dispatch<React.SetStateAction<Array<CalcValue | null>>>;
  previousRpnStack: Array<CalcValue | null>;
  setPreviousRpnStack: React.Dispatch<React.SetStateAction<Array<CalcValue | null>>>;
  lastX: CalcValue | null;
  setLastX: React.Dispatch<React.SetStateAction<CalcValue | null>>;
  rpnResultPrefix: string;
  setRpnResultPrefix: React.Dispatch<React.SetStateAction<string>>;
  rpnSelectedAlternative: number;
  setRpnSelectedAlternative: React.Dispatch<React.SetStateAction<number>>;
  rpnXEditing: boolean;
  setRpnXEditing: React.Dispatch<React.SetStateAction<boolean>>;
  rpnXEditValue: string;
  setRpnXEditValue: React.Dispatch<React.SetStateAction<string>>;
  flashRpnField1: boolean;
  setFlashRpnField1: React.Dispatch<React.SetStateAction<boolean>>;
  flashRpnField2: boolean;
  setFlashRpnField2: React.Dispatch<React.SetStateAction<boolean>>;
  flashRpnField3: boolean;
  setFlashRpnField3: React.Dispatch<React.SetStateAction<boolean>>;
  flashRpnResult: boolean;
  setFlashRpnResult: React.Dispatch<React.SetStateAction<boolean>>;
  pushValue: (value: CalcValue) => void;
  dropValue: () => void;
  swapXY: () => void;
  clearStack: () => void;
  undoStack: () => void;
  recallLastX: () => void;
}

export function useRpnStack(): UseRpnStackReturn {
  const [rpnStack, setRpnStack] = useState<Array<CalcValue | null>>([null, null, null, null]);
  const [previousRpnStack, setPreviousRpnStack] = useState<Array<CalcValue | null>>([null, null, null, null]);
  const [lastX, setLastX] = useState<CalcValue | null>(null);
  const [rpnResultPrefix, setRpnResultPrefix] = useState<string>('none');
  const [rpnSelectedAlternative, setRpnSelectedAlternative] = useState<number>(0);
  const [rpnXEditing, setRpnXEditing] = useState<boolean>(false);
  const [rpnXEditValue, setRpnXEditValue] = useState<string>('');
  
  const [flashRpnField1, setFlashRpnField1] = useState<boolean>(false);
  const [flashRpnField2, setFlashRpnField2] = useState<boolean>(false);
  const [flashRpnField3, setFlashRpnField3] = useState<boolean>(false);
  const [flashRpnResult, setFlashRpnResult] = useState<boolean>(false);

  const pushValue = useCallback((value: CalcValue) => {
    setPreviousRpnStack([...rpnStack]);
    setRpnStack(prev => {
      const newStack = [...prev];
      newStack[3] = newStack[2];
      newStack[2] = newStack[1];
      newStack[1] = newStack[0];
      newStack[0] = value;
      return newStack;
    });
    setRpnResultPrefix('none');
    setRpnSelectedAlternative(0);
  }, [rpnStack]);

  const dropValue = useCallback(() => {
    setPreviousRpnStack([...rpnStack]);
    setRpnStack(prev => {
      const newStack = [...prev];
      newStack[0] = newStack[1];
      newStack[1] = newStack[2];
      newStack[2] = newStack[3];
      newStack[3] = null;
      return newStack;
    });
    setRpnResultPrefix('none');
    setRpnSelectedAlternative(0);
  }, [rpnStack]);

  const swapXY = useCallback(() => {
    if (rpnStack[0] === null || rpnStack[1] === null) return;
    setPreviousRpnStack([...rpnStack]);
    setRpnStack(prev => {
      const newStack = [...prev];
      const temp = newStack[0];
      newStack[0] = newStack[1];
      newStack[1] = temp;
      return newStack;
    });
    setRpnResultPrefix('none');
    setRpnSelectedAlternative(0);
  }, [rpnStack]);

  const clearStack = useCallback(() => {
    setPreviousRpnStack([...rpnStack]);
    setRpnStack([null, null, null, null]);
    setLastX(null);
    setRpnResultPrefix('none');
    setRpnSelectedAlternative(0);
    setRpnXEditing(false);
    setRpnXEditValue('');
  }, [rpnStack]);

  const undoStack = useCallback(() => {
    setRpnStack([...previousRpnStack]);
  }, [previousRpnStack]);

  const recallLastX = useCallback(() => {
    if (lastX === null) return;
    pushValue(lastX);
  }, [lastX, pushValue]);

  return {
    rpnStack,
    setRpnStack,
    previousRpnStack,
    setPreviousRpnStack,
    lastX,
    setLastX,
    rpnResultPrefix,
    setRpnResultPrefix,
    rpnSelectedAlternative,
    setRpnSelectedAlternative,
    rpnXEditing,
    setRpnXEditing,
    rpnXEditValue,
    setRpnXEditValue,
    flashRpnField1,
    setFlashRpnField1,
    flashRpnField2,
    setFlashRpnField2,
    flashRpnField3,
    setFlashRpnField3,
    flashRpnResult,
    setFlashRpnResult,
    pushValue,
    dropValue,
    swapXY,
    clearStack,
    undoStack,
    recallLastX,
  };
}
