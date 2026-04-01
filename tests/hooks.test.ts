import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlashFlag, useAllFlashFlags } from '../client/src/components/unit-converter/hooks/useFlashFlag';
import { useRpnStack } from '../client/src/components/unit-converter/hooks/useRpnStack';
import { useConverterState } from '../client/src/components/unit-converter/hooks/useConverterState';
import { useCalculatorState } from '../client/src/components/unit-converter/hooks/useCalculatorState';
import type { CalcValue } from '../client/src/lib/units/shared-types';

describe('useFlashFlag', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize with isFlashing = false', () => {
    const { result } = renderHook(() => useFlashFlag());
    const [isFlashing] = result.current;
    expect(isFlashing).toBe(false);
  });

  it('should set isFlashing to true when flash is called', () => {
    const { result } = renderHook(() => useFlashFlag());
    
    act(() => {
      result.current[1]();
    });
    
    expect(result.current[0]).toBe(true);
  });

  it('should reset isFlashing to false after default duration (300ms)', () => {
    const { result } = renderHook(() => useFlashFlag());
    
    act(() => {
      result.current[1]();
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('should respect custom duration', () => {
    const { result } = renderHook(() => useFlashFlag(500));
    
    act(() => {
      result.current[1]();
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(300);
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('should reset timer when flash is called while already flashing', () => {
    const { result } = renderHook(() => useFlashFlag(300));
    
    act(() => {
      result.current[1]();
    });
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      result.current[1]();
    });
    
    act(() => {
      vi.advanceTimersByTime(200);
    });
    
    expect(result.current[0]).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(100);
    });
    
    expect(result.current[0]).toBe(false);
  });

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { result, unmount } = renderHook(() => useFlashFlag());
    
    act(() => {
      result.current[1]();
    });
    
    unmount();
    
    expect(clearTimeoutSpy).toHaveBeenCalled();
    clearTimeoutSpy.mockRestore();
  });
});

describe('useAllFlashFlags', () => {
  it('should return all expected flash flag keys', () => {
    const { result } = renderHook(() => useAllFlashFlags());
    
    const expectedKeys = [
      'copyResult', 'copyCalc', 'calcField1', 'calcField2', 'calcField3',
      'fromBaseFactor', 'fromSIBase', 'toBaseFactor', 'toSIBase',
      'conversionRatio', 'rpnField1', 'rpnField2', 'rpnField3',
      'rpnResult', 'directCopy'
    ];
    
    expectedKeys.forEach(key => {
      expect(result.current).toHaveProperty(key);
      expect(Array.isArray(result.current[key as keyof typeof result.current])).toBe(true);
      expect(result.current[key as keyof typeof result.current]).toHaveLength(2);
    });
  });

  it('should have independent flash states for each flag', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useAllFlashFlags());
    
    act(() => {
      result.current.copyResult[1]();
    });
    
    expect(result.current.copyResult[0]).toBe(true);
    expect(result.current.copyCalc[0]).toBe(false);
    expect(result.current.rpnResult[0]).toBe(false);
    
    vi.useRealTimers();
  });
});

describe('useRpnStack', () => {
  const createTestValue = (value: number, dims: Record<string, number> = {}): CalcValue => ({
    value,
    dimensions: dims,
    prefix: 'none'
  });

  describe('initialization', () => {
    it('should initialize with empty stack', () => {
      const { result } = renderHook(() => useRpnStack());
      expect(result.current.rpnStack).toEqual([null, null, null, null]);
    });

    it('should initialize with null lastX', () => {
      const { result } = renderHook(() => useRpnStack());
      expect(result.current.lastX).toBeNull();
    });

    it('should initialize with default prefix "none"', () => {
      const { result } = renderHook(() => useRpnStack());
      expect(result.current.rpnResultPrefix).toBe('none');
    });

    it('should initialize with rpnXEditing = false', () => {
      const { result } = renderHook(() => useRpnStack());
      expect(result.current.rpnXEditing).toBe(false);
    });
  });

  describe('pushValue', () => {
    it('should push value onto stack at position 0', () => {
      const { result } = renderHook(() => useRpnStack());
      const testValue = createTestValue(42);
      
      act(() => {
        result.current.pushValue(testValue);
      });
      
      expect(result.current.rpnStack[0]).toEqual(testValue);
    });

    it('should shift existing values up when pushing', () => {
      const { result } = renderHook(() => useRpnStack());
      const value1 = createTestValue(1);
      const value2 = createTestValue(2);
      const value3 = createTestValue(3);
      
      act(() => {
        result.current.pushValue(value1);
      });
      
      act(() => {
        result.current.pushValue(value2);
      });
      
      act(() => {
        result.current.pushValue(value3);
      });
      
      expect(result.current.rpnStack[0]).toEqual(value3);
      expect(result.current.rpnStack[1]).toEqual(value2);
      expect(result.current.rpnStack[2]).toEqual(value1);
      expect(result.current.rpnStack[3]).toBeNull();
    });

    it('should preserve previous stack for undo', () => {
      const { result } = renderHook(() => useRpnStack());
      const value1 = createTestValue(1);
      const value2 = createTestValue(2);
      
      act(() => {
        result.current.pushValue(value1);
      });
      
      const stackBeforePush = [...result.current.rpnStack];
      
      act(() => {
        result.current.pushValue(value2);
      });
      
      expect(result.current.previousRpnStack).toEqual(stackBeforePush);
    });

    it('should reset prefix and alternative selection on push', () => {
      const { result } = renderHook(() => useRpnStack());
      
      act(() => {
        result.current.setRpnResultPrefix('k');
        result.current.setRpnSelectedAlternative(2);
      });
      
      act(() => {
        result.current.pushValue(createTestValue(1));
      });
      
      expect(result.current.rpnResultPrefix).toBe('none');
      expect(result.current.rpnSelectedAlternative).toBe(0);
    });
  });

  describe('dropValue', () => {
    it('should remove value from position 0 and shift down', () => {
      const { result } = renderHook(() => useRpnStack());
      const value1 = createTestValue(1);
      const value2 = createTestValue(2);
      
      act(() => {
        result.current.pushValue(value1);
        result.current.pushValue(value2);
      });
      
      act(() => {
        result.current.dropValue();
      });
      
      expect(result.current.rpnStack[0]).toEqual(value1);
      expect(result.current.rpnStack[1]).toBeNull();
    });

    it('should set position 3 to null after drop', () => {
      const { result } = renderHook(() => useRpnStack());
      
      act(() => {
        result.current.pushValue(createTestValue(1));
        result.current.pushValue(createTestValue(2));
        result.current.pushValue(createTestValue(3));
        result.current.pushValue(createTestValue(4));
      });
      
      act(() => {
        result.current.dropValue();
      });
      
      expect(result.current.rpnStack[3]).toBeNull();
    });
  });

  describe('swapXY', () => {
    it('should swap values at positions 0 and 1', () => {
      const { result } = renderHook(() => useRpnStack());
      const value1 = createTestValue(1);
      const value2 = createTestValue(2);
      
      act(() => {
        result.current.pushValue(value1);
        result.current.pushValue(value2);
      });
      
      act(() => {
        result.current.swapXY();
      });
      
      expect(result.current.rpnStack[0]).toEqual(value1);
      expect(result.current.rpnStack[1]).toEqual(value2);
    });

    it('should not swap if position 0 is null', () => {
      const { result } = renderHook(() => useRpnStack());
      
      act(() => {
        result.current.swapXY();
      });
      
      expect(result.current.rpnStack).toEqual([null, null, null, null]);
    });

    it('should not swap if position 1 is null', () => {
      const { result } = renderHook(() => useRpnStack());
      const value = createTestValue(1);
      
      act(() => {
        result.current.pushValue(value);
      });
      
      act(() => {
        result.current.swapXY();
      });
      
      expect(result.current.rpnStack[0]).toEqual(value);
      expect(result.current.rpnStack[1]).toBeNull();
    });
  });

  describe('clearStack', () => {
    it('should reset stack to all nulls', () => {
      const { result } = renderHook(() => useRpnStack());
      
      act(() => {
        result.current.pushValue(createTestValue(1));
        result.current.pushValue(createTestValue(2));
      });
      
      act(() => {
        result.current.clearStack();
      });
      
      expect(result.current.rpnStack).toEqual([null, null, null, null]);
    });

    it('should clear lastX', () => {
      const { result } = renderHook(() => useRpnStack());
      
      act(() => {
        result.current.setLastX(createTestValue(42));
      });
      
      act(() => {
        result.current.clearStack();
      });
      
      expect(result.current.lastX).toBeNull();
    });

    it('should reset editing state', () => {
      const { result } = renderHook(() => useRpnStack());
      
      act(() => {
        result.current.setRpnXEditing(true);
        result.current.setRpnXEditValue('123');
      });
      
      act(() => {
        result.current.clearStack();
      });
      
      expect(result.current.rpnXEditing).toBe(false);
      expect(result.current.rpnXEditValue).toBe('');
    });
  });

  describe('undoStack', () => {
    it('should restore previous stack state', () => {
      const { result } = renderHook(() => useRpnStack());
      const value1 = createTestValue(1);
      const value2 = createTestValue(2);
      
      act(() => {
        result.current.pushValue(value1);
      });
      
      const stackAfterFirstPush = [...result.current.rpnStack];
      
      act(() => {
        result.current.pushValue(value2);
      });
      
      act(() => {
        result.current.undoStack();
      });
      
      expect(result.current.rpnStack).toEqual(stackAfterFirstPush);
    });

    it('should restore state after multiple operations', () => {
      const { result } = renderHook(() => useRpnStack());
      const value1 = createTestValue(1);
      const value2 = createTestValue(2);
      const value3 = createTestValue(3);
      
      act(() => {
        result.current.pushValue(value1);
        result.current.pushValue(value2);
      });
      
      act(() => {
        result.current.pushValue(value3);
      });
      
      act(() => {
        result.current.undoStack();
      });
      
      expect(result.current.rpnStack[0]).toEqual(value2);
      expect(result.current.rpnStack[1]).toEqual(value1);
      expect(result.current.rpnStack[2]).toBeNull();
    });

    it('should restore state after drop operation', () => {
      const { result } = renderHook(() => useRpnStack());
      const value1 = createTestValue(1);
      const value2 = createTestValue(2);
      
      act(() => {
        result.current.pushValue(value1);
        result.current.pushValue(value2);
      });
      
      const stackBeforeDrop = [...result.current.rpnStack];
      
      act(() => {
        result.current.dropValue();
      });
      
      act(() => {
        result.current.undoStack();
      });
      
      expect(result.current.rpnStack).toEqual(stackBeforeDrop);
    });

    it('should restore state after swap operation', () => {
      const { result } = renderHook(() => useRpnStack());
      const value1 = createTestValue(1);
      const value2 = createTestValue(2);
      
      act(() => {
        result.current.pushValue(value1);
        result.current.pushValue(value2);
      });
      
      const stackBeforeSwap = [...result.current.rpnStack];
      
      act(() => {
        result.current.swapXY();
      });
      
      act(() => {
        result.current.undoStack();
      });
      
      expect(result.current.rpnStack).toEqual(stackBeforeSwap);
    });

    it('should restore state after clear operation', () => {
      const { result } = renderHook(() => useRpnStack());
      const value1 = createTestValue(1);
      
      act(() => {
        result.current.pushValue(value1);
      });
      
      const stackBeforeClear = [...result.current.rpnStack];
      
      act(() => {
        result.current.clearStack();
      });
      
      act(() => {
        result.current.undoStack();
      });
      
      expect(result.current.rpnStack).toEqual(stackBeforeClear);
    });
  });

  describe('recallLastX', () => {
    it('should push lastX value onto stack', () => {
      const { result } = renderHook(() => useRpnStack());
      const lastXValue = createTestValue(99);
      
      act(() => {
        result.current.setLastX(lastXValue);
      });
      
      act(() => {
        result.current.recallLastX();
      });
      
      expect(result.current.rpnStack[0]).toEqual(lastXValue);
    });

    it('should do nothing if lastX is null', () => {
      const { result } = renderHook(() => useRpnStack());
      
      act(() => {
        result.current.recallLastX();
      });
      
      expect(result.current.rpnStack).toEqual([null, null, null, null]);
    });

    it('should shift existing stack values when recalling lastX', () => {
      const { result } = renderHook(() => useRpnStack());
      const existingValue = createTestValue(1);
      const lastXValue = createTestValue(99);
      
      act(() => {
        result.current.pushValue(existingValue);
        result.current.setLastX(lastXValue);
      });
      
      act(() => {
        result.current.recallLastX();
      });
      
      expect(result.current.rpnStack[0]).toEqual(lastXValue);
      expect(result.current.rpnStack[1]).toEqual(existingValue);
    });

    it('should preserve lastX value after recall (for multiple recalls)', () => {
      const { result } = renderHook(() => useRpnStack());
      const lastXValue = createTestValue(99);
      
      act(() => {
        result.current.setLastX(lastXValue);
      });
      
      act(() => {
        result.current.recallLastX();
      });
      
      expect(result.current.lastX).toEqual(lastXValue);
      
      act(() => {
        result.current.recallLastX();
      });
      
      expect(result.current.rpnStack[0]).toEqual(lastXValue);
      expect(result.current.rpnStack[1]).toEqual(lastXValue);
    });

    it('should handle lastX with dimensions', () => {
      const { result } = renderHook(() => useRpnStack());
      const lastXValue: CalcValue = {
        value: 42,
        dimensions: { mass: 1, length: 2, time: -2 },
        prefix: 'k'
      };
      
      act(() => {
        result.current.setLastX(lastXValue);
      });
      
      act(() => {
        result.current.recallLastX();
      });
      
      expect(result.current.rpnStack[0]).toEqual(lastXValue);
      expect(result.current.rpnStack[0]!.dimensions).toEqual({ mass: 1, length: 2, time: -2 });
      expect(result.current.rpnStack[0]!.prefix).toBe('k');
    });
  });

  describe('saveAndUpdateStack', () => {
    it('should save current stack before updating', () => {
      const { result } = renderHook(() => useRpnStack());
      const value = createTestValue(1);
      
      act(() => {
        result.current.pushValue(value);
      });
      
      const currentStack = [...result.current.rpnStack];
      
      act(() => {
        result.current.saveAndUpdateStack(() => [null, null, null, null]);
      });
      
      expect(result.current.previousRpnStack).toEqual(currentStack);
    });
  });
});

describe('useConverterState', () => {
  describe('initial state', () => {
    it('should initialize activeCategory to "length"', () => {
      const { result } = renderHook(() => useConverterState());
      expect(result.current.activeCategory).toBe('length');
    });

    it('should initialize fromUnit to empty string', () => {
      const { result } = renderHook(() => useConverterState());
      expect(result.current.fromUnit).toBe('');
    });

    it('should initialize toUnit to empty string', () => {
      const { result } = renderHook(() => useConverterState());
      expect(result.current.toUnit).toBe('');
    });

    it('should initialize fromPrefix to "none"', () => {
      const { result } = renderHook(() => useConverterState());
      expect(result.current.fromPrefix).toBe('none');
    });

    it('should initialize toPrefix to "none"', () => {
      const { result } = renderHook(() => useConverterState());
      expect(result.current.toPrefix).toBe('none');
    });

    it('should initialize inputValue to "1"', () => {
      const { result } = renderHook(() => useConverterState());
      expect(result.current.inputValue).toBe('1');
    });

    it('should initialize result to null', () => {
      const { result } = renderHook(() => useConverterState());
      expect(result.current.result).toBeNull();
    });

    it('should initialize precision to 4', () => {
      const { result } = renderHook(() => useConverterState());
      expect(result.current.precision).toBe(4);
    });

    it('should initialize comparisonMode to false', () => {
      const { result } = renderHook(() => useConverterState());
      expect(result.current.comparisonMode).toBe(false);
    });

    it('should provide an inputRef object', () => {
      const { result } = renderHook(() => useConverterState());
      expect(result.current.inputRef).toBeDefined();
      expect(result.current.inputRef).toHaveProperty('current');
    });
  });

  describe('state transitions', () => {
    it('should update activeCategory when setActiveCategory is called', () => {
      const { result } = renderHook(() => useConverterState());
      act(() => {
        result.current.setActiveCategory('mass');
      });
      expect(result.current.activeCategory).toBe('mass');
    });

    it('should update fromUnit when setFromUnit is called', () => {
      const { result } = renderHook(() => useConverterState());
      act(() => {
        result.current.setFromUnit('meter');
      });
      expect(result.current.fromUnit).toBe('meter');
    });

    it('should update toUnit when setToUnit is called', () => {
      const { result } = renderHook(() => useConverterState());
      act(() => {
        result.current.setToUnit('foot');
      });
      expect(result.current.toUnit).toBe('foot');
    });

    it('should update fromPrefix when setFromPrefix is called', () => {
      const { result } = renderHook(() => useConverterState());
      act(() => {
        result.current.setFromPrefix('k');
      });
      expect(result.current.fromPrefix).toBe('k');
    });

    it('should update toPrefix when setToPrefix is called', () => {
      const { result } = renderHook(() => useConverterState());
      act(() => {
        result.current.setToPrefix('m');
      });
      expect(result.current.toPrefix).toBe('m');
    });

    it('should update inputValue when setInputValue is called', () => {
      const { result } = renderHook(() => useConverterState());
      act(() => {
        result.current.setInputValue('42');
      });
      expect(result.current.inputValue).toBe('42');
    });

    it('should update result when setResult is called', () => {
      const { result } = renderHook(() => useConverterState());
      act(() => {
        result.current.setResult(3.14159);
      });
      expect(result.current.result).toBe(3.14159);
    });

    it('should allow result to be reset to null', () => {
      const { result } = renderHook(() => useConverterState());
      act(() => {
        result.current.setResult(100);
      });
      act(() => {
        result.current.setResult(null);
      });
      expect(result.current.result).toBeNull();
    });

    it('should update precision when setPrecision is called', () => {
      const { result } = renderHook(() => useConverterState());
      act(() => {
        result.current.setPrecision(8);
      });
      expect(result.current.precision).toBe(8);
    });

    it('should toggle comparisonMode when setComparisonMode is called', () => {
      const { result } = renderHook(() => useConverterState());
      act(() => {
        result.current.setComparisonMode(true);
      });
      expect(result.current.comparisonMode).toBe(true);
      act(() => {
        result.current.setComparisonMode(false);
      });
      expect(result.current.comparisonMode).toBe(false);
    });

    it('should allow multiple independent state changes', () => {
      const { result } = renderHook(() => useConverterState());
      act(() => {
        result.current.setActiveCategory('temperature');
        result.current.setFromUnit('celsius');
        result.current.setToUnit('fahrenheit');
        result.current.setInputValue('100');
        result.current.setResult(212);
        result.current.setPrecision(2);
      });
      expect(result.current.activeCategory).toBe('temperature');
      expect(result.current.fromUnit).toBe('celsius');
      expect(result.current.toUnit).toBe('fahrenheit');
      expect(result.current.inputValue).toBe('100');
      expect(result.current.result).toBe(212);
      expect(result.current.precision).toBe(2);
    });
  });
});

describe('useCalculatorState', () => {
  describe('initial state', () => {
    it('should initialize calculatorMode to "rpn"', () => {
      const { result } = renderHook(() => useCalculatorState());
      expect(result.current.calculatorMode).toBe('rpn');
    });

    it('should initialize shiftActive to false', () => {
      const { result } = renderHook(() => useCalculatorState());
      expect(result.current.shiftActive).toBe(false);
    });

    it('should initialize calculatorPrecision to 4', () => {
      const { result } = renderHook(() => useCalculatorState());
      expect(result.current.calculatorPrecision).toBe(4);
    });

    it('should initialize calcValues to [null, null, null, null]', () => {
      const { result } = renderHook(() => useCalculatorState());
      expect(result.current.calcValues).toEqual([null, null, null, null]);
    });

    it('should initialize calcOp1 to null', () => {
      const { result } = renderHook(() => useCalculatorState());
      expect(result.current.calcOp1).toBeNull();
    });

    it('should initialize calcOp2 to null', () => {
      const { result } = renderHook(() => useCalculatorState());
      expect(result.current.calcOp2).toBeNull();
    });

    it('should initialize resultUnit to null', () => {
      const { result } = renderHook(() => useCalculatorState());
      expect(result.current.resultUnit).toBeNull();
    });

    it('should initialize resultCategory to null', () => {
      const { result } = renderHook(() => useCalculatorState());
      expect(result.current.resultCategory).toBeNull();
    });

    it('should initialize resultPrefix to "none"', () => {
      const { result } = renderHook(() => useCalculatorState());
      expect(result.current.resultPrefix).toBe('none');
    });

    it('should initialize selectedAlternative to 0', () => {
      const { result } = renderHook(() => useCalculatorState());
      expect(result.current.selectedAlternative).toBe(0);
    });
  });

  describe('mode switching', () => {
    it('should switch from "rpn" to "simple" mode', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setCalculatorMode('simple');
      });
      expect(result.current.calculatorMode).toBe('simple');
    });

    it('should switch back from "simple" to "rpn" mode', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setCalculatorMode('simple');
      });
      act(() => {
        result.current.setCalculatorMode('rpn');
      });
      expect(result.current.calculatorMode).toBe('rpn');
    });
  });

  describe('state transitions', () => {
    it('should update shiftActive when setShiftActive is called', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setShiftActive(true);
      });
      expect(result.current.shiftActive).toBe(true);
    });

    it('should update calculatorPrecision when setCalculatorPrecision is called', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setCalculatorPrecision(6);
      });
      expect(result.current.calculatorPrecision).toBe(6);
    });

    it('should update calcOp1 to a valid operator', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setCalcOp1('+');
      });
      expect(result.current.calcOp1).toBe('+');
    });

    it('should update calcOp2 to a valid operator', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setCalcOp2('-');
      });
      expect(result.current.calcOp2).toBe('-');
    });

    it('should reset calcOp1 to null', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setCalcOp1('*');
      });
      act(() => {
        result.current.setCalcOp1(null);
      });
      expect(result.current.calcOp1).toBeNull();
    });

    it('should reset calcOp2 to null', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setCalcOp2('/');
      });
      act(() => {
        result.current.setCalcOp2(null);
      });
      expect(result.current.calcOp2).toBeNull();
    });

    it('should update resultUnit when setResultUnit is called', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setResultUnit('meter');
      });
      expect(result.current.resultUnit).toBe('meter');
    });

    it('should update resultCategory when setResultCategory is called', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setResultCategory('length');
      });
      expect(result.current.resultCategory).toBe('length');
    });

    it('should update resultPrefix when setResultPrefix is called', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setResultPrefix('k');
      });
      expect(result.current.resultPrefix).toBe('k');
    });

    it('should update selectedAlternative when setSelectedAlternative is called', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setSelectedAlternative(2);
      });
      expect(result.current.selectedAlternative).toBe(2);
    });

    it('should update calcValues with new entries', () => {
      const { result } = renderHook(() => useCalculatorState());
      const newValues: Array<CalcValue | null> = [
        { value: 10, dimensions: {}, prefix: 'none' },
        { value: 20, dimensions: {}, prefix: 'none' },
        null,
        null,
      ];
      act(() => {
        result.current.setCalcValues(newValues);
      });
      expect(result.current.calcValues).toEqual(newValues);
    });
  });

  describe('state resets', () => {
    it('should be able to reset calcValues to all nulls', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setCalcValues([
          { value: 5, dimensions: {}, prefix: 'none' },
          null, null, null,
        ]);
      });
      act(() => {
        result.current.setCalcValues([null, null, null, null]);
      });
      expect(result.current.calcValues).toEqual([null, null, null, null]);
    });

    it('should be able to reset resultUnit to null', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setResultUnit('kilogram');
      });
      act(() => {
        result.current.setResultUnit(null);
      });
      expect(result.current.resultUnit).toBeNull();
    });

    it('should be able to reset resultCategory to null', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setResultCategory('mass');
      });
      act(() => {
        result.current.setResultCategory(null);
      });
      expect(result.current.resultCategory).toBeNull();
    });

    it('should be able to reset shiftActive to false after activating', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setShiftActive(true);
      });
      act(() => {
        result.current.setShiftActive(false);
      });
      expect(result.current.shiftActive).toBe(false);
    });

    it('should support full state reset by resetting each field independently', () => {
      const { result } = renderHook(() => useCalculatorState());
      act(() => {
        result.current.setCalculatorMode('simple');
        result.current.setShiftActive(true);
        result.current.setCalculatorPrecision(8);
        result.current.setCalcOp1('+');
        result.current.setCalcOp2('-');
        result.current.setResultUnit('second');
        result.current.setResultCategory('time');
        result.current.setResultPrefix('m');
        result.current.setSelectedAlternative(3);
      });
      act(() => {
        result.current.setCalculatorMode('rpn');
        result.current.setShiftActive(false);
        result.current.setCalculatorPrecision(4);
        result.current.setCalcOp1(null);
        result.current.setCalcOp2(null);
        result.current.setCalcValues([null, null, null, null]);
        result.current.setResultUnit(null);
        result.current.setResultCategory(null);
        result.current.setResultPrefix('none');
        result.current.setSelectedAlternative(0);
      });
      expect(result.current.calculatorMode).toBe('rpn');
      expect(result.current.shiftActive).toBe(false);
      expect(result.current.calculatorPrecision).toBe(4);
      expect(result.current.calcOp1).toBeNull();
      expect(result.current.calcOp2).toBeNull();
      expect(result.current.calcValues).toEqual([null, null, null, null]);
      expect(result.current.resultUnit).toBeNull();
      expect(result.current.resultCategory).toBeNull();
      expect(result.current.resultPrefix).toBe('none');
      expect(result.current.selectedAlternative).toBe(0);
    });
  });
});
