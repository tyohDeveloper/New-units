import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFlashFlag, useAllFlashFlags } from '../client/src/components/unit-converter/hooks/useFlashFlag';
import { useRpnStack } from '../client/src/components/unit-converter/hooks/useRpnStack';
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
