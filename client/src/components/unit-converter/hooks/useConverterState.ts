import { useState, useRef } from 'react';
import type { UnitCategory } from '@/lib/units/types';

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
    comparisonMode,
    setComparisonMode,
  };
}
