import { useState, useCallback, useRef } from 'react';
import type { CalcValue } from '@/lib/units/shared-types';

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
  saveAndUpdateStack: (updater: (stack: Array<CalcValue | null>) => Array<CalcValue | null>) => void;
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
  
  const stackRef = useRef(rpnStack);
  stackRef.current = rpnStack;

  const saveAndUpdateStack = useCallback((updater: (stack: Array<CalcValue | null>) => Array<CalcValue | null>) => {
    setPreviousRpnStack([...stackRef.current]);
    setRpnStack(updater);
    setRpnResultPrefix('none');
    setRpnSelectedAlternative(0);
  }, []);

  const pushValue = useCallback((value: CalcValue) => {
    saveAndUpdateStack(prev => {
      const newStack = [...prev];
      newStack[3] = newStack[2];
      newStack[2] = newStack[1];
      newStack[1] = newStack[0];
      newStack[0] = value;
      return newStack;
    });
  }, [saveAndUpdateStack]);

  const dropValue = useCallback(() => {
    saveAndUpdateStack(prev => {
      const newStack = [...prev];
      newStack[0] = newStack[1];
      newStack[1] = newStack[2];
      newStack[2] = newStack[3];
      newStack[3] = null;
      return newStack;
    });
  }, [saveAndUpdateStack]);

  const swapXY = useCallback(() => {
    if (stackRef.current[0] === null || stackRef.current[1] === null) return;
    saveAndUpdateStack(prev => {
      const newStack = [...prev];
      const temp = newStack[0];
      newStack[0] = newStack[1];
      newStack[1] = temp;
      return newStack;
    });
  }, [saveAndUpdateStack]);

  const clearStack = useCallback(() => {
    saveAndUpdateStack(() => [null, null, null, null]);
    setLastX(null);
    setRpnXEditing(false);
    setRpnXEditValue('');
  }, [saveAndUpdateStack]);

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
    saveAndUpdateStack,
    pushValue,
    dropValue,
    swapXY,
    clearStack,
    undoStack,
    recallLastX,
  };
}
