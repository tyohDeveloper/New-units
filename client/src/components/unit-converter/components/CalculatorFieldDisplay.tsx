import React from 'react';
import { motion } from 'framer-motion';
import type { CalcValue, DimensionalFormula } from '@/lib/units/shared-types';
import { PREFIXES } from '@/lib/conversion-data';
import { FIELD_HEIGHT } from '../constants';

interface CalculatorFieldDisplayProps {
  value: CalcValue | null;
  onClick?: () => void;
  isFlashing?: boolean;
  isResult?: boolean;
  formatDimensions: (dimensions: DimensionalFormula) => string;
  applyPrefixToKgUnit: (symbol: string, prefixId: string) => {
    displaySymbol: string;
    showPrefix: boolean;
    effectivePrefixFactor: number;
  };
  formatNumberWithSeparators: (value: number, precision: number) => string;
  precision: number;
  width?: string;
  className?: string;
  testId?: string;
}

export function CalculatorFieldDisplay({
  value,
  onClick,
  isFlashing = false,
  isResult = false,
  formatDimensions,
  applyPrefixToKgUnit,
  formatNumberWithSeparators,
  precision,
  width,
  className = '',
  testId,
}: CalculatorFieldDisplayProps) {
  const baseClass = isResult 
    ? 'px-3 bg-muted/20 border border-accent/50 rounded-md flex items-center justify-between select-none'
    : 'px-3 bg-muted/30 border border-border/50 rounded-md flex items-center justify-between select-none';
  
  const interactiveClass = value 
    ? (isResult ? 'cursor-pointer hover:bg-muted/40 active:bg-muted/60' : 'cursor-pointer hover:bg-muted/50 active:bg-muted/70')
    : '';

  const displayData = value ? (() => {
    const baseUnitSymbol = formatDimensions(value.dimensions);
    const kgResult = applyPrefixToKgUnit(baseUnitSymbol, value.prefix);
    const displayValue = value.value / kgResult.effectivePrefixFactor;
    const prefixData = PREFIXES.find(p => p.id === value.prefix);
    const prefixSymbol = kgResult.showPrefix && prefixData ? prefixData.symbol : '';
    return {
      formattedValue: formatNumberWithSeparators(displayValue, precision),
      unitSymbol: prefixSymbol + kgResult.displaySymbol,
    };
  })() : null;

  return (
    <motion.div 
      className={`${baseClass} ${interactiveClass} ${className}`}
      onClick={value && onClick ? onClick : undefined}
      style={{ height: FIELD_HEIGHT, width, pointerEvents: 'auto' }}
      animate={{
        opacity: isFlashing ? [1, 0.3, 1] : 1,
        scale: isFlashing ? [1, 1.02, 1] : 1
      }}
      transition={{ duration: 0.3 }}
      data-testid={testId}
    >
      <span className={`text-sm font-mono truncate ${isResult ? 'text-primary font-bold' : 'text-foreground'}`}>
        {displayData?.formattedValue || ''}
      </span>
      <span className="text-xs font-mono text-muted-foreground ml-2 shrink-0">
        {displayData?.unitSymbol || ''}
      </span>
    </motion.div>
  );
}
