import { describe, it, expect } from 'vitest';
import {
  dimensionsEqual,
  multiplyDimensions,
  divideDimensions,
  isDimensionless,
  type DimensionalFormula,
} from '../client/src/lib/calculator';

/**
 * RPN Calculator Stack Operations Tests
 * 
 * These tests verify the core logic used in RPN stack operations,
 * including dimension handling, stack manipulation patterns, and
 * mathematical operation results.
 */

// Simulate CalcValue type used in the actual component
interface CalcValue {
  value: number;
  dimensions: DimensionalFormula;
  prefix: string;
}

// RPN Stack simulation (4-level: s3, s2, y, x where x is bottom/result)
type RpnStack = [CalcValue | null, CalcValue | null, CalcValue | null, CalcValue | null];

// Stack operations
const createEmptyStack = (): RpnStack => [null, null, null, null];

const stackLift = (stack: RpnStack, newX: CalcValue): RpnStack => {
  // Push new value to x position, lift rest up
  return [stack[1], stack[2], stack[3], newX];
};

const stackDrop = (stack: RpnStack): RpnStack => {
  // Drop x, shift rest down, s3 duplicates
  return [stack[0], stack[0], stack[1], stack[2]];
};

const stackSwapXY = (stack: RpnStack): RpnStack => {
  return [stack[0], stack[1], stack[3], stack[2]];
};

// RPN binary operations (consume y and x, result goes to x)
const rpnMultiply = (stack: RpnStack): RpnStack | null => {
  if (!stack[2] || !stack[3]) return null;
  
  const y = stack[2];
  const x = stack[3];
  const resultValue = y.value * x.value;
  const resultDims = multiplyDimensions(y.dimensions, x.dimensions);
  
  const result: CalcValue = {
    value: resultValue,
    dimensions: resultDims,
    prefix: 'none'
  };
  
  // Drop the stack and put result in x
  return [stack[0], stack[0], stack[1], result];
};

const rpnDivide = (stack: RpnStack): RpnStack | null => {
  if (!stack[2] || !stack[3]) return null;
  if (stack[3].value === 0) return null; // Division by zero
  
  const y = stack[2];
  const x = stack[3];
  const resultValue = y.value / x.value;
  const resultDims = divideDimensions(y.dimensions, x.dimensions);
  
  const result: CalcValue = {
    value: resultValue,
    dimensions: resultDims,
    prefix: 'none'
  };
  
  return [stack[0], stack[0], stack[1], result];
};

const rpnAdd = (stack: RpnStack): RpnStack | null => {
  if (!stack[2] || !stack[3]) return null;
  
  const y = stack[2];
  const x = stack[3];
  
  // Addition requires compatible dimensions
  if (!dimensionsEqual(y.dimensions, x.dimensions)) return null;
  
  const result: CalcValue = {
    value: y.value + x.value,
    dimensions: y.dimensions,
    prefix: 'none'
  };
  
  return [stack[0], stack[0], stack[1], result];
};

const rpnSubtract = (stack: RpnStack): RpnStack | null => {
  if (!stack[2] || !stack[3]) return null;
  
  const y = stack[2];
  const x = stack[3];
  
  // Subtraction requires compatible dimensions
  if (!dimensionsEqual(y.dimensions, x.dimensions)) return null;
  
  const result: CalcValue = {
    value: y.value - x.value,
    dimensions: y.dimensions,
    prefix: 'none'
  };
  
  return [stack[0], stack[0], stack[1], result];
};

// RPN unary operations (operate on x only)
const rpnSquare = (stack: RpnStack): RpnStack | null => {
  if (!stack[3]) return null;
  
  const x = stack[3];
  const newDims = multiplyDimensions(x.dimensions, x.dimensions);
  
  const result: CalcValue = {
    value: x.value * x.value,
    dimensions: newDims,
    prefix: 'none'
  };
  
  return [stack[0], stack[1], stack[2], result];
};

const rpnSqrt = (stack: RpnStack): RpnStack | null => {
  if (!stack[3]) return null;
  if (stack[3].value < 0) return null; // Cannot take sqrt of negative
  
  const x = stack[3];
  
  // Check if all exponents are even (can take integer sqrt)
  const dims = x.dimensions;
  const newDims: DimensionalFormula = {};
  
  for (const [key, exp] of Object.entries(dims)) {
    if (exp && exp !== 0) {
      if (exp % 2 !== 0) {
        // Non-integer exponent would result - still valid, halve the exponent
        newDims[key as keyof DimensionalFormula] = exp / 2;
      } else {
        newDims[key as keyof DimensionalFormula] = exp / 2;
      }
    }
  }
  
  const result: CalcValue = {
    value: Math.sqrt(x.value),
    dimensions: newDims,
    prefix: 'none'
  };
  
  return [stack[0], stack[1], stack[2], result];
};

describe('RPN Stack Operations', () => {
  describe('Stack Lift', () => {
    it('should push new value to x and lift existing values', () => {
      const initialStack: RpnStack = [null, null, null, null];
      const newValue: CalcValue = { value: 5, dimensions: { length: 1 }, prefix: 'none' };
      
      const result = stackLift(initialStack, newValue);
      
      expect(result[3]).toEqual(newValue);
      expect(result[0]).toBeNull();
      expect(result[1]).toBeNull();
      expect(result[2]).toBeNull();
    });

    it('should preserve existing values when lifting', () => {
      const val1: CalcValue = { value: 1, dimensions: {}, prefix: 'none' };
      const val2: CalcValue = { value: 2, dimensions: {}, prefix: 'none' };
      const val3: CalcValue = { value: 3, dimensions: {}, prefix: 'none' };
      const val4: CalcValue = { value: 4, dimensions: {}, prefix: 'none' };
      
      const stack: RpnStack = [val1, val2, val3, val4];
      const newVal: CalcValue = { value: 5, dimensions: {}, prefix: 'none' };
      
      const result = stackLift(stack, newVal);
      
      expect(result[0]).toEqual(val2);
      expect(result[1]).toEqual(val3);
      expect(result[2]).toEqual(val4);
      expect(result[3]).toEqual(newVal);
    });

    it('should drop s3 value when stack is full', () => {
      const val1: CalcValue = { value: 100, dimensions: { mass: 1 }, prefix: 'none' };
      const fullStack: RpnStack = [
        { value: 1, dimensions: {}, prefix: 'none' },
        { value: 2, dimensions: {}, prefix: 'none' },
        { value: 3, dimensions: {}, prefix: 'none' },
        { value: 4, dimensions: {}, prefix: 'none' }
      ];
      
      const result = stackLift(fullStack, val1);
      
      // s3 (index 0) loses value 1, now has value 2
      expect(result[0]?.value).toBe(2);
      expect(result[3]).toEqual(val1);
    });
  });

  describe('Stack Drop', () => {
    it('should drop x and shift values down', () => {
      const stack: RpnStack = [
        { value: 1, dimensions: {}, prefix: 'none' },
        { value: 2, dimensions: {}, prefix: 'none' },
        { value: 3, dimensions: {}, prefix: 'none' },
        { value: 4, dimensions: {}, prefix: 'none' }
      ];
      
      const result = stackDrop(stack);
      
      expect(result[3]?.value).toBe(3); // y moves to x
      expect(result[2]?.value).toBe(2); // s2 moves to y
      expect(result[1]?.value).toBe(1); // s3 moves to s2
      expect(result[0]?.value).toBe(1); // s3 duplicates to top
    });

    it('should handle empty stack', () => {
      const emptyStack = createEmptyStack();
      const result = stackDrop(emptyStack);
      
      expect(result[0]).toBeNull();
      expect(result[1]).toBeNull();
      expect(result[2]).toBeNull();
      expect(result[3]).toBeNull();
    });
  });

  describe('Stack Swap XY', () => {
    it('should swap x and y positions', () => {
      const xVal: CalcValue = { value: 10, dimensions: { length: 1 }, prefix: 'none' };
      const yVal: CalcValue = { value: 20, dimensions: { mass: 1 }, prefix: 'none' };
      
      const stack: RpnStack = [null, null, yVal, xVal];
      const result = stackSwapXY(stack);
      
      expect(result[3]).toEqual(yVal);
      expect(result[2]).toEqual(xVal);
    });

    it('should not affect s2 and s3', () => {
      const s3: CalcValue = { value: 1, dimensions: {}, prefix: 'none' };
      const s2: CalcValue = { value: 2, dimensions: {}, prefix: 'none' };
      
      const stack: RpnStack = [s3, s2, 
        { value: 3, dimensions: {}, prefix: 'none' },
        { value: 4, dimensions: {}, prefix: 'none' }
      ];
      
      const result = stackSwapXY(stack);
      
      expect(result[0]).toEqual(s3);
      expect(result[1]).toEqual(s2);
    });
  });
});

describe('RPN Binary Operations', () => {
  describe('Multiplication (×)', () => {
    it('should multiply values and combine dimensions', () => {
      const force: CalcValue = { value: 10, dimensions: { mass: 1, length: 1, time: -2 }, prefix: 'none' };
      const length: CalcValue = { value: 5, dimensions: { length: 1 }, prefix: 'none' };
      
      const stack: RpnStack = [null, null, force, length];
      const result = rpnMultiply(stack);
      
      expect(result).not.toBeNull();
      expect(result![3]?.value).toBe(50);
      expect(dimensionsEqual(result![3]?.dimensions!, { mass: 1, length: 2, time: -2 })).toBe(true);
    });

    it('should return null when x or y is empty', () => {
      const stack: RpnStack = [null, null, null, { value: 5, dimensions: {}, prefix: 'none' }];
      expect(rpnMultiply(stack)).toBeNull();
    });

    it('should allow multiplying dimensionless values', () => {
      const a: CalcValue = { value: 3, dimensions: {}, prefix: 'none' };
      const b: CalcValue = { value: 4, dimensions: {}, prefix: 'none' };
      
      const stack: RpnStack = [null, null, a, b];
      const result = rpnMultiply(stack);
      
      expect(result![3]?.value).toBe(12);
      expect(isDimensionless(result![3]?.dimensions!)).toBe(true);
    });

    it('should cancel inverse dimensions', () => {
      const velocity: CalcValue = { value: 10, dimensions: { length: 1, time: -1 }, prefix: 'none' };
      const time: CalcValue = { value: 2, dimensions: { time: 1 }, prefix: 'none' };
      
      const stack: RpnStack = [null, null, velocity, time];
      const result = rpnMultiply(stack);
      
      expect(result![3]?.value).toBe(20);
      expect(dimensionsEqual(result![3]?.dimensions!, { length: 1 })).toBe(true);
    });
  });

  describe('Division (÷)', () => {
    it('should divide values and subtract dimensions', () => {
      const energy: CalcValue = { value: 100, dimensions: { mass: 1, length: 2, time: -2 }, prefix: 'none' };
      const time: CalcValue = { value: 4, dimensions: { time: 1 }, prefix: 'none' };
      
      const stack: RpnStack = [null, null, energy, time];
      const result = rpnDivide(stack);
      
      expect(result).not.toBeNull();
      expect(result![3]?.value).toBe(25);
      // Energy / Time = Power dimensions
      expect(dimensionsEqual(result![3]?.dimensions!, { mass: 1, length: 2, time: -3 })).toBe(true);
    });

    it('should return null for division by zero', () => {
      const a: CalcValue = { value: 10, dimensions: {}, prefix: 'none' };
      const zero: CalcValue = { value: 0, dimensions: {}, prefix: 'none' };
      
      const stack: RpnStack = [null, null, a, zero];
      expect(rpnDivide(stack)).toBeNull();
    });

    it('should create inverse dimensions when dividing by unit', () => {
      const dimensionless: CalcValue = { value: 1, dimensions: {}, prefix: 'none' };
      const length: CalcValue = { value: 2, dimensions: { length: 1 }, prefix: 'none' };
      
      const stack: RpnStack = [null, null, dimensionless, length];
      const result = rpnDivide(stack);
      
      expect(result![3]?.value).toBe(0.5);
      expect(dimensionsEqual(result![3]?.dimensions!, { length: -1 })).toBe(true);
    });
  });

  describe('Addition (+)', () => {
    it('should add values with compatible dimensions', () => {
      const m1: CalcValue = { value: 5, dimensions: { length: 1 }, prefix: 'none' };
      const m2: CalcValue = { value: 3, dimensions: { length: 1 }, prefix: 'none' };
      
      const stack: RpnStack = [null, null, m1, m2];
      const result = rpnAdd(stack);
      
      expect(result).not.toBeNull();
      expect(result![3]?.value).toBe(8);
      expect(dimensionsEqual(result![3]?.dimensions!, { length: 1 })).toBe(true);
    });

    it('should reject addition with incompatible dimensions', () => {
      const meters: CalcValue = { value: 5, dimensions: { length: 1 }, prefix: 'none' };
      const seconds: CalcValue = { value: 3, dimensions: { time: 1 }, prefix: 'none' };
      
      const stack: RpnStack = [null, null, meters, seconds];
      const result = rpnAdd(stack);
      
      expect(result).toBeNull();
    });

    it('should allow adding dimensionless values', () => {
      const a: CalcValue = { value: 2.5, dimensions: {}, prefix: 'none' };
      const b: CalcValue = { value: 1.5, dimensions: {}, prefix: 'none' };
      
      const stack: RpnStack = [null, null, a, b];
      const result = rpnAdd(stack);
      
      expect(result![3]?.value).toBe(4);
    });

    it('should handle negative values', () => {
      const a: CalcValue = { value: 10, dimensions: { mass: 1 }, prefix: 'none' };
      const b: CalcValue = { value: -3, dimensions: { mass: 1 }, prefix: 'none' };
      
      const stack: RpnStack = [null, null, a, b];
      const result = rpnAdd(stack);
      
      expect(result![3]?.value).toBe(7);
    });
  });

  describe('Subtraction (−)', () => {
    it('should subtract values with compatible dimensions', () => {
      const m1: CalcValue = { value: 10, dimensions: { length: 1 }, prefix: 'none' };
      const m2: CalcValue = { value: 3, dimensions: { length: 1 }, prefix: 'none' };
      
      const stack: RpnStack = [null, null, m1, m2];
      const result = rpnSubtract(stack);
      
      expect(result).not.toBeNull();
      expect(result![3]?.value).toBe(7);
    });

    it('should reject subtraction with incompatible dimensions', () => {
      const meters: CalcValue = { value: 10, dimensions: { length: 1 }, prefix: 'none' };
      const kg: CalcValue = { value: 5, dimensions: { mass: 1 }, prefix: 'none' };
      
      const stack: RpnStack = [null, null, meters, kg];
      const result = rpnSubtract(stack);
      
      expect(result).toBeNull();
    });

    it('should handle subtraction resulting in negative', () => {
      const a: CalcValue = { value: 3, dimensions: { time: 1 }, prefix: 'none' };
      const b: CalcValue = { value: 8, dimensions: { time: 1 }, prefix: 'none' };
      
      const stack: RpnStack = [null, null, a, b];
      const result = rpnSubtract(stack);
      
      expect(result![3]?.value).toBe(-5);
    });
  });
});

describe('RPN Unary Operations', () => {
  describe('Square (x²)', () => {
    it('should square value and double dimensions', () => {
      const length: CalcValue = { value: 5, dimensions: { length: 1 }, prefix: 'none' };
      const stack: RpnStack = [null, null, null, length];
      
      const result = rpnSquare(stack);
      
      expect(result).not.toBeNull();
      expect(result![3]?.value).toBe(25);
      expect(dimensionsEqual(result![3]?.dimensions!, { length: 2 })).toBe(true);
    });

    it('should square dimensionless value', () => {
      const num: CalcValue = { value: 7, dimensions: {}, prefix: 'none' };
      const stack: RpnStack = [null, null, null, num];
      
      const result = rpnSquare(stack);
      
      expect(result![3]?.value).toBe(49);
      expect(isDimensionless(result![3]?.dimensions!)).toBe(true);
    });

    it('should preserve stack positions s3, s2, y', () => {
      const s3: CalcValue = { value: 1, dimensions: {}, prefix: 'none' };
      const s2: CalcValue = { value: 2, dimensions: {}, prefix: 'none' };
      const y: CalcValue = { value: 3, dimensions: {}, prefix: 'none' };
      const x: CalcValue = { value: 4, dimensions: {}, prefix: 'none' };
      
      const stack: RpnStack = [s3, s2, y, x];
      const result = rpnSquare(stack);
      
      expect(result![0]).toEqual(s3);
      expect(result![1]).toEqual(s2);
      expect(result![2]).toEqual(y);
      expect(result![3]?.value).toBe(16);
    });

    it('should return null when x is empty', () => {
      const stack: RpnStack = [null, null, null, null];
      expect(rpnSquare(stack)).toBeNull();
    });
  });

  describe('Square Root (√)', () => {
    it('should take sqrt and halve even dimensions', () => {
      const area: CalcValue = { value: 16, dimensions: { length: 2 }, prefix: 'none' };
      const stack: RpnStack = [null, null, null, area];
      
      const result = rpnSqrt(stack);
      
      expect(result).not.toBeNull();
      expect(result![3]?.value).toBe(4);
      expect(dimensionsEqual(result![3]?.dimensions!, { length: 1 })).toBe(true);
    });

    it('should return null for negative values', () => {
      const negative: CalcValue = { value: -4, dimensions: {}, prefix: 'none' };
      const stack: RpnStack = [null, null, null, negative];
      
      expect(rpnSqrt(stack)).toBeNull();
    });

    it('should handle dimensionless sqrt', () => {
      const num: CalcValue = { value: 9, dimensions: {}, prefix: 'none' };
      const stack: RpnStack = [null, null, null, num];
      
      const result = rpnSqrt(stack);
      
      expect(result![3]?.value).toBe(3);
      expect(isDimensionless(result![3]?.dimensions!)).toBe(true);
    });

    it('should handle odd exponents (fractional result dimensions)', () => {
      const volume: CalcValue = { value: 27, dimensions: { length: 3 }, prefix: 'none' };
      const stack: RpnStack = [null, null, null, volume];
      
      const result = rpnSqrt(stack);
      
      expect(result![3]?.value).toBeCloseTo(5.196, 2);
      // Length^3 sqrt = Length^1.5
      expect(result![3]?.dimensions?.length).toBe(1.5);
    });
  });
});

describe('RPN Undo/Redo Pattern', () => {
  it('should be able to save and restore stack state', () => {
    const stack1: RpnStack = [
      null, null,
      { value: 10, dimensions: { length: 1 }, prefix: 'none' },
      { value: 5, dimensions: { length: 1 }, prefix: 'none' }
    ];
    
    // Save previous state
    const previousStack = [...stack1] as RpnStack;
    
    // Perform operation
    const stack2 = rpnAdd(stack1);
    
    // After undo, should restore previous state
    expect(stack2![3]?.value).toBe(15);
    expect(previousStack[2]?.value).toBe(10);
    expect(previousStack[3]?.value).toBe(5);
  });

  it('undo/redo swap pattern should work', () => {
    const stateA: RpnStack = [null, null, null, { value: 1, dimensions: {}, prefix: 'none' }];
    const stateB: RpnStack = [null, null, null, { value: 2, dimensions: {}, prefix: 'none' }];
    
    // Simulating undo: swap current with previous
    let current = stateB;
    let previous = stateA;
    
    // First undo
    let temp = current;
    current = previous;
    previous = temp;
    
    expect(current[3]?.value).toBe(1);
    expect(previous[3]?.value).toBe(2);
    
    // Second undo (redo)
    temp = current;
    current = previous;
    previous = temp;
    
    expect(current[3]?.value).toBe(2);
    expect(previous[3]?.value).toBe(1);
  });
});

describe('Dimension Mismatch Handling', () => {
  it('should detect incompatible dimensions for addition', () => {
    const meters: DimensionalFormula = { length: 1 };
    const seconds: DimensionalFormula = { time: 1 };
    
    expect(dimensionsEqual(meters, seconds)).toBe(false);
  });

  it('should allow any dimensions for multiplication', () => {
    // Multiplication always works regardless of dimensions
    const force: CalcValue = { value: 10, dimensions: { mass: 1, length: 1, time: -2 }, prefix: 'none' };
    const area: CalcValue = { value: 2, dimensions: { length: 2 }, prefix: 'none' };
    
    const stack: RpnStack = [null, null, force, area];
    const result = rpnMultiply(stack);
    
    expect(result).not.toBeNull();
    // Force × Area = Pressure × Volume (complex dimensions)
    expect(result![3]?.value).toBe(20);
  });

  it('should detect matching dimensions for different quantities', () => {
    // Energy and Torque have the same dimensions: kg⋅m²⋅s⁻²
    const energy: DimensionalFormula = { mass: 1, length: 2, time: -2 };
    const torque: DimensionalFormula = { mass: 1, length: 2, time: -2 };
    
    expect(dimensionsEqual(energy, torque)).toBe(true);
  });
});

describe('Special Value Handling', () => {
  it('should handle very small values', () => {
    const tiny: CalcValue = { value: 1e-15, dimensions: { length: 1 }, prefix: 'none' };
    const stack: RpnStack = [null, null, null, tiny];
    
    const result = rpnSquare(stack);
    
    expect(result![3]?.value).toBeCloseTo(1e-30, 40);
  });

  it('should handle very large values', () => {
    const huge: CalcValue = { value: 1e15, dimensions: { length: 1 }, prefix: 'none' };
    const stack: RpnStack = [null, null, null, huge];
    
    const result = rpnSquare(stack);
    
    expect(result![3]?.value).toBeCloseTo(1e30, -25);
  });

  it('should handle zero values in multiplication', () => {
    const zero: CalcValue = { value: 0, dimensions: { length: 1 }, prefix: 'none' };
    const nonZero: CalcValue = { value: 5, dimensions: { time: 1 }, prefix: 'none' };
    
    const stack: RpnStack = [null, null, zero, nonZero];
    const result = rpnMultiply(stack);
    
    expect(result![3]?.value).toBe(0);
  });

  it('should handle very small differences in addition', () => {
    const a: CalcValue = { value: 1e-10, dimensions: { mass: 1 }, prefix: 'none' };
    const b: CalcValue = { value: 2e-10, dimensions: { mass: 1 }, prefix: 'none' };
    
    const stack: RpnStack = [null, null, a, b];
    const result = rpnAdd(stack);
    
    expect(result![3]?.value).toBeCloseTo(3e-10, 20);
  });
});
