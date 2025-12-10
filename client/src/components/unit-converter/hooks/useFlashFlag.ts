import { useState, useCallback, useRef, useEffect } from 'react';

export function useFlashFlag(duration: number = 300): [boolean, () => void] {
  const [isFlashing, setIsFlashing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const flash = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsFlashing(true);
    timeoutRef.current = setTimeout(() => {
      setIsFlashing(false);
    }, duration);
  }, [duration]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return [isFlashing, flash];
}

export interface FlashFlags {
  copyResult: [boolean, () => void];
  copyCalc: [boolean, () => void];
  calcField1: [boolean, () => void];
  calcField2: [boolean, () => void];
  calcField3: [boolean, () => void];
  fromBaseFactor: [boolean, () => void];
  fromSIBase: [boolean, () => void];
  toBaseFactor: [boolean, () => void];
  toSIBase: [boolean, () => void];
  conversionRatio: [boolean, () => void];
  rpnField1: [boolean, () => void];
  rpnField2: [boolean, () => void];
  rpnField3: [boolean, () => void];
  rpnResult: [boolean, () => void];
  directCopy: [boolean, () => void];
}

export function useAllFlashFlags(duration: number = 300): FlashFlags {
  return {
    copyResult: useFlashFlag(duration),
    copyCalc: useFlashFlag(duration),
    calcField1: useFlashFlag(duration),
    calcField2: useFlashFlag(duration),
    calcField3: useFlashFlag(duration),
    fromBaseFactor: useFlashFlag(duration),
    fromSIBase: useFlashFlag(duration),
    toBaseFactor: useFlashFlag(duration),
    toSIBase: useFlashFlag(duration),
    conversionRatio: useFlashFlag(duration),
    rpnField1: useFlashFlag(duration),
    rpnField2: useFlashFlag(duration),
    rpnField3: useFlashFlag(duration),
    rpnResult: useFlashFlag(duration),
    directCopy: useFlashFlag(duration),
  };
}
