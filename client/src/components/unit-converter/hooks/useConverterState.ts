import { useState, useRef } from 'react';
import type { UnitCategory } from '@/lib/units/types';
import type { CalcValue } from '@/lib/units/shared-types';

export interface UseConverterStateReturn {
  inputRef: React.RefObject<HTMLInputElement | null>;
  activeCategory: UnitCategory;
  setActiveCategory: React.Dispatch<React.SetStateAction<UnitCategory>>;
  fromUnit: string;
  setFromUnit: React.Dispatch<React.SetStateAction<string>>;
  toUnit: string;
  setToUnit: React.Dispatch<React.SetStateAction<string>>;
  fromPrefix: string;
  setFromPrefix: React.Dispatch<React.SetStateAction<string>>;
  toPrefix: string;
  setToPrefix: React.Dispatch<React.SetStateAction<string>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
  result: number | null;
  setResult: React.Dispatch<React.SetStateAction<number | null>>;
  precision: number;
  setPrecision: React.Dispatch<React.SetStateAction<number>>;
  flashCopyResult: boolean;
  setFlashCopyResult: React.Dispatch<React.SetStateAction<boolean>>;
  flashFromBaseFactor: boolean;
  setFlashFromBaseFactor: React.Dispatch<React.SetStateAction<boolean>>;
  flashFromSIBase: boolean;
  setFlashFromSIBase: React.Dispatch<React.SetStateAction<boolean>>;
  flashToBaseFactor: boolean;
  setFlashToBaseFactor: React.Dispatch<React.SetStateAction<boolean>>;
  flashToSIBase: boolean;
  setFlashToSIBase: React.Dispatch<React.SetStateAction<boolean>>;
  flashConversionRatio: boolean;
  setFlashConversionRatio: React.Dispatch<React.SetStateAction<boolean>>;
  comparisonMode: boolean;
  setComparisonMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useConverterState(): UseConverterStateReturn {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [fromPrefix, setFromPrefix] = useState<string>('none');
  const [toPrefix, setToPrefix] = useState<string>('none');
  const [inputValue, setInputValue] = useState<string>('1');
  const [result, setResult] = useState<number | null>(null);
  const [precision, setPrecision] = useState<number>(4);
  
  const [flashCopyResult, setFlashCopyResult] = useState<boolean>(false);
  const [flashFromBaseFactor, setFlashFromBaseFactor] = useState<boolean>(false);
  const [flashFromSIBase, setFlashFromSIBase] = useState<boolean>(false);
  const [flashToBaseFactor, setFlashToBaseFactor] = useState<boolean>(false);
  const [flashToSIBase, setFlashToSIBase] = useState<boolean>(false);
  const [flashConversionRatio, setFlashConversionRatio] = useState<boolean>(false);
  const [comparisonMode, setComparisonMode] = useState<boolean>(false);

  return {
    inputRef,
    activeCategory,
    setActiveCategory,
    fromUnit,
    setFromUnit,
    toUnit,
    setToUnit,
    fromPrefix,
    setFromPrefix,
    toPrefix,
    setToPrefix,
    inputValue,
    setInputValue,
    result,
    setResult,
    precision,
    setPrecision,
    flashCopyResult,
    setFlashCopyResult,
    flashFromBaseFactor,
    setFlashFromBaseFactor,
    flashFromSIBase,
    setFlashFromSIBase,
    flashToBaseFactor,
    setFlashToBaseFactor,
    flashToSIBase,
    setFlashToSIBase,
    flashConversionRatio,
    setFlashConversionRatio,
    comparisonMode,
    setComparisonMode,
  };
}
