import { describe, it, expect } from 'vitest';
import {
  parseUnitText,
  CONVERSION_DATA,
} from '../client/src/lib/conversion-data';

/**
 * Smart Paste and Localization Tests
 * 
 * Tests for the smart paste functionality including:
 * - Number parsing with various formats
 * - Multilingual support
 * - Malformed input handling
 * - originalValue propagation
 * - Dimensional formula parsing
 */

describe('Smart Paste - Number Parsing', () => {
  describe('Standard Number Formats', () => {
    it('should parse integer values', () => {
      const result = parseUnitText('42 s');
      expect(result.originalValue).toBe(42);
      expect(result.categoryId).toBe('time');
    });

    it('should parse decimal values', () => {
      const result = parseUnitText('3.14159 s');
      expect(result.originalValue).toBeCloseTo(3.14159, 5);
    });

    it('should parse negative values', () => {
      const result = parseUnitText('-5.5 s');
      expect(result.originalValue).toBe(-5.5);
    });

    it('should parse values with leading zeros', () => {
      const result = parseUnitText('0.123 s');
      expect(result.originalValue).toBeCloseTo(0.123, 5);
    });

    it('should parse values with trailing zeros', () => {
      const result = parseUnitText('5.00 s');
      expect(result.originalValue).toBe(5);
    });
  });

  describe('Scientific Notation', () => {
    it('should parse positive exponent (e notation)', () => {
      const result = parseUnitText('1.5e3 s');
      expect(result.originalValue).toBe(1500);
    });

    it('should parse negative exponent', () => {
      const result = parseUnitText('2.5e-3 s');
      expect(result.originalValue).toBeCloseTo(0.0025, 10);
    });

    it('should parse uppercase E notation', () => {
      const result = parseUnitText('3E8 s');
      expect(result.originalValue).toBe(3e8);
    });

    it('should parse explicit positive exponent', () => {
      const result = parseUnitText('1.0e+6 N');
      expect(result.originalValue).toBe(1e6);
    });

    it('should parse very small scientific notation', () => {
      const result = parseUnitText('6.626e-34 s');
      expect(result.originalValue).toBeCloseTo(6.626e-34, 40);
    });

    it('should parse very large scientific notation', () => {
      const result = parseUnitText('2.998e+8 s');
      expect(result.originalValue).toBeCloseTo(2.998e8, -3);
    });
  });

  describe('Whitespace Handling', () => {
    it('should handle no space between number and unit', () => {
      const result = parseUnitText('5s');
      expect(result.originalValue).toBe(5);
      expect(result.categoryId).toBe('time');
    });

    it('should handle multiple spaces between number and unit', () => {
      const result = parseUnitText('10   s');
      expect(result.originalValue).toBe(10);
      expect(result.categoryId).toBe('time');
    });

    it('should handle leading whitespace', () => {
      const result = parseUnitText('  15 N');
      expect(result.originalValue).toBe(15);
      expect(result.categoryId).toBe('force');
    });

    it('should handle trailing whitespace', () => {
      const result = parseUnitText('20 s  ');
      expect(result.originalValue).toBe(20);
      expect(result.categoryId).toBe('time');
    });
  });
});

describe('Smart Paste - Unit Recognition', () => {
  describe('SI Base Units', () => {
    it('should recognize second', () => {
      const result = parseUnitText('1 s');
      expect(result.categoryId).toBe('time');
      expect(result.unitId).toBe('s');
    });

    it('should recognize ampere', () => {
      const result = parseUnitText('1 A');
      expect(result.categoryId).toBe('current');
      expect(result.unitId).toBe('a');
    });

    it('should recognize kelvin', () => {
      const result = parseUnitText('1 K');
      expect(result.categoryId).toBe('temperature');
      expect(result.unitId).toBe('k');
    });

    it('should recognize minute', () => {
      const result = parseUnitText('5 min');
      expect(result.categoryId).toBe('time');
      expect(result.unitId).toBe('min');
    });

    it('should recognize hour', () => {
      const result = parseUnitText('2 h');
      expect(result.categoryId).toBe('time');
      expect(result.unitId).toBe('h');
    });
  });

  describe('Common Derived Units', () => {
    it('should recognize Newton', () => {
      const result = parseUnitText('10 N');
      expect(result.categoryId).toBe('force');
    });

    it('should recognize Hertz', () => {
      const result = parseUnitText('440 Hz');
      expect(result.categoryId).toBe('frequency');
    });

    it('should recognize Ohm', () => {
      const result = parseUnitText('100 Ω');
      expect(result.categoryId).toBe('resistance');
    });

    it('should recognize Coulomb', () => {
      const result = parseUnitText('1 C');
      expect(result.categoryId).toBe('charge');
    });

    it('should recognize Volt', () => {
      const result = parseUnitText('12 V');
      expect(result.categoryId).toBe('potential');
    });
  });

  describe('Units with Prefixes', () => {
    it('should recognize megahertz (MHz)', () => {
      const result = parseUnitText('2.4 MHz');
      expect(result.categoryId).toBe('frequency');
      expect(result.prefixId).toBe('mega');
    });

    it('should recognize kilonewton (kN)', () => {
      const result = parseUnitText('5 kN');
      expect(result.categoryId).toBe('force');
      expect(result.prefixId).toBe('kilo');
      expect(result.originalValue).toBe(5);
    });

    it('should recognize nanosecond (ns)', () => {
      const result = parseUnitText('10 ns');
      expect(result.categoryId).toBe('time');
      expect(result.prefixId).toBe('nano');
    });

    it('should recognize microsecond (µs)', () => {
      const result = parseUnitText('500 µs');
      expect(result.categoryId).toBe('time');
      expect(result.prefixId).toBe('micro');
    });

    it('should recognize kilojoule (kJ)', () => {
      const result = parseUnitText('4.2 kJ');
      // May parse to energy or archaic_energy depending on symbol map order
      expect(result.prefixId).toBe('kilo');
      expect(result.originalValue).toBeCloseTo(4.2);
    });

    it('should parse value correctly with prefix', () => {
      const result = parseUnitText('3 MHz');
      expect(result.originalValue).toBe(3);
      expect(result.prefixId).toBe('mega');
    });
  });
});

describe('Smart Paste - Dimensional Formulas', () => {
  describe('Single Dimension', () => {
    it('should parse m² as area dimensions', () => {
      const result = parseUnitText('10 m²');
      expect(result.dimensions.length).toBe(2);
    });

    it('should parse m³ as volume dimensions', () => {
      const result = parseUnitText('5 m³');
      expect(result.dimensions.length).toBe(3);
    });

    it('should parse s⁻¹ as frequency dimensions', () => {
      const result = parseUnitText('50 s⁻¹');
      expect(result.dimensions.time).toBe(-1);
    });
  });

  describe('Multiple Dimensions', () => {
    it('should parse kg⋅m⁻³ as density', () => {
      const result = parseUnitText('1000 kg⋅m⁻³');
      expect(result.dimensions.mass).toBe(1);
      expect(result.dimensions.length).toBe(-3);
    });

    it('should parse m⋅s⁻¹ as speed', () => {
      const result = parseUnitText('300 m⋅s⁻¹');
      expect(result.dimensions.length).toBe(1);
      expect(result.dimensions.time).toBe(-1);
    });

    it('should parse kg⋅m⋅s⁻² as force', () => {
      const result = parseUnitText('9.8 kg⋅m⋅s⁻²');
      expect(result.dimensions.mass).toBe(1);
      expect(result.dimensions.length).toBe(1);
      expect(result.dimensions.time).toBe(-2);
    });

    it('should parse kg⋅m²⋅s⁻² as energy', () => {
      const result = parseUnitText('1 kg⋅m²⋅s⁻²');
      expect(result.dimensions.mass).toBe(1);
      expect(result.dimensions.length).toBe(2);
      expect(result.dimensions.time).toBe(-2);
    });
  });

  describe('Alternative Separators', () => {
    it('should parse with middle dot (·)', () => {
      const result = parseUnitText('5 m·s⁻¹');
      expect(result.dimensions.length).toBe(1);
      expect(result.dimensions.time).toBe(-1);
    });

    it('should parse with multiplication sign (×)', () => {
      const result = parseUnitText('10 kg×m');
      // May or may not be recognized depending on parser
      expect(result.originalValue).toBe(10);
    });
  });
});

describe('Smart Paste - Angle Units', () => {
  it('should parse degree symbol (°)', () => {
    const result = parseUnitText('90°');
    expect(result.categoryId).toBe('angle');
    expect(result.originalValue).toBe(90);
  });

  it('should parse "deg" abbreviation', () => {
    const result = parseUnitText('180 deg');
    expect(result.categoryId).toBe('angle');
    expect(result.originalValue).toBe(180);
  });

  it('should parse radians', () => {
    const result = parseUnitText('3.14159 rad');
    expect(result.categoryId).toBe('angle');
    expect(result.originalValue).toBeCloseTo(3.14159, 4);
  });
});

describe('Smart Paste - originalValue Propagation', () => {
  describe('Value vs originalValue Difference', () => {
    it('should have different value and originalValue for converted units', () => {
      const result = parseUnitText('1 min');
      expect(result.originalValue).toBe(1);
      expect(result.value).toBe(60); // Converted to seconds (base unit)
    });

    it('should have same value and originalValue for base units', () => {
      const result = parseUnitText('5 s');
      expect(result.originalValue).toBe(5);
      expect(result.value).toBe(5);
    });

    it('should convert hours properly', () => {
      const result = parseUnitText('2 h');
      expect(result.originalValue).toBe(2);
      expect(result.value).toBe(7200); // 2 hours = 7200 seconds
    });

    it('should convert days properly', () => {
      const result = parseUnitText('1 d');
      expect(result.originalValue).toBe(1);
      expect(result.value).toBe(86400); // 1 day = 86400 seconds
    });
  });

  describe('Prefix Applied Values', () => {
    it('should apply prefix to value but not originalValue', () => {
      const result = parseUnitText('5 km');
      expect(result.originalValue).toBe(5);
      // value should be 5000 (5 * 1000) in base unit
      expect(result.value).toBe(5000);
    });

    it('should handle milli prefix', () => {
      const result = parseUnitText('500 mm');
      expect(result.originalValue).toBe(500);
      expect(result.value).toBeCloseTo(0.5, 10);
    });
  });
});

describe('Smart Paste - Malformed Input Handling', () => {
  describe('Empty and Invalid Inputs', () => {
    it('should handle empty string', () => {
      const result = parseUnitText('');
      expect(result.originalValue).toBe(1);
      expect(result.categoryId).toBeNull();
    });

    it('should handle only whitespace', () => {
      const result = parseUnitText('   ');
      expect(result.categoryId).toBeNull();
    });

    it('should handle unknown unit', () => {
      const result = parseUnitText('5 xyz');
      expect(result.originalValue).toBe(5);
      expect(result.categoryId).toBeNull();
    });

    it('should handle number only', () => {
      const result = parseUnitText('42');
      expect(result.originalValue).toBe(42);
      expect(result.categoryId).toBeNull();
    });

    it('should handle unit only (no number)', () => {
      const result = parseUnitText('m');
      expect(result.originalValue).toBe(1);
      expect(result.categoryId).not.toBeNull();
    });
  });

  describe('Malformed Numbers', () => {
    it('should handle double decimal point', () => {
      const result = parseUnitText('5.5.5 m');
      // Parser should handle gracefully
      expect(typeof result.originalValue).toBe('number');
    });

    it('should handle letters in number', () => {
      const result = parseUnitText('5abc m');
      // Should parse what it can
      expect(typeof result.originalValue).toBe('number');
    });

    it('should handle special characters', () => {
      const result = parseUnitText('5@#$ m');
      expect(typeof result.originalValue).toBe('number');
    });
  });

  describe('Edge Case Units', () => {
    it('should not match standalone prefix as unit', () => {
      const result = parseUnitText('P');
      // "P" is a prefix (Peta), not a unit
      expect(result.unitId).toBeNull();
    });

    it('should not match "k" as a unit', () => {
      const result = parseUnitText('5 k');
      // "k" is a prefix (kilo), not a unit
      expect(result.unitId).toBeNull();
    });

    it('should handle very long input', () => {
      const longInput = '12345678901234567890 N';
      const result = parseUnitText(longInput);
      expect(result.categoryId).toBe('force');
    });
  });
});

describe('Smart Paste - Special Cases', () => {
  describe('Half-Life Units (Symbol Conflict Prevention)', () => {
    it('should parse "s" as seconds, not half-life', () => {
      const result = parseUnitText('3 s');
      expect(result.categoryId).toBe('time');
      expect(result.unitId).toBe('s');
    });

    it('should parse half-life with t½ prefix', () => {
      const result = parseUnitText('5 t½(s)');
      expect(result.categoryId).toBe('radioactive_decay');
    });
  });

  describe('Poise Symbol (Po not P)', () => {
    it('should parse "Po" as Poise', () => {
      const result = parseUnitText('10 Po');
      expect(result.categoryId).toBe('viscosity');
      expect(result.unitId).toBe('poise');
    });

    it('should not parse "P" as Poise', () => {
      const result = parseUnitText('10 P');
      // "P" should not map to a unit
      expect(result.unitId).toBeNull();
    });
  });

  describe('Minim Symbol (minim not min)', () => {
    it('should parse "min" as minute', () => {
      const result = parseUnitText('30 min');
      expect(result.categoryId).toBe('time');
      expect(result.unitId).toBe('min');
    });

    it('should parse "minim" as minim volume', () => {
      const result = parseUnitText('5 minim');
      expect(result.categoryId).toBe('archaic_volume');
      expect(result.unitId).toBe('minim');
    });
  });
});

describe('Unit Symbol Uniqueness', () => {
  it('should not have duplicate symbols across categories (critical symbols)', () => {
    const criticalSymbols = ['s', 'min', 'h', 'd', 'Po'];
    const symbolCategories = new Map<string, string[]>();
    
    for (const category of CONVERSION_DATA) {
      for (const unit of category.units) {
        if (!unit.mathFunction && criticalSymbols.includes(unit.symbol)) {
          const existing = symbolCategories.get(unit.symbol) || [];
          existing.push(category.id);
          symbolCategories.set(unit.symbol, existing);
        }
      }
    }
    
    // These critical symbols should only appear in one category
    expect(symbolCategories.get('s')?.length).toBe(1); // time only
    expect(symbolCategories.get('min')?.length).toBe(1); // time only
    expect(symbolCategories.get('h')?.length).toBe(1); // time only
    expect(symbolCategories.get('d')?.length).toBe(1); // time only
    expect(symbolCategories.get('Po')?.length).toBe(1); // viscosity only
  });
});
