import { describe, it, expect } from 'vitest';
import {
  roundToNearestEven,
  toFixedBanker,
  fixPrecision,
  cleanNumber,
  formatNumberWithSeparators,
  stripSeparators,
  formatForClipboard,
  toArabicNumerals,
  toLatinNumerals,
  NUMBER_FORMATS,
  type NumberFormat
} from '../client/src/lib/formatting';

describe('Banker Rounding (roundToNearestEven)', () => {
  describe('standard rounding cases', () => {
    it('should round 2.5 to 2 (nearest even)', () => {
      expect(roundToNearestEven(2.5, 0)).toBe(2);
    });

    it('should round 3.5 to 4 (nearest even)', () => {
      expect(roundToNearestEven(3.5, 0)).toBe(4);
    });

    it('should round 1.5 to 2 (nearest even)', () => {
      expect(roundToNearestEven(1.5, 0)).toBe(2);
    });

    it('should round 0.5 to 0 (nearest even)', () => {
      expect(roundToNearestEven(0.5, 0)).toBe(0);
    });

    it('should round -2.5 to -2 (nearest even)', () => {
      expect(roundToNearestEven(-2.5, 0)).toBe(-2);
    });

    it('should round -3.5 to -4 (nearest even)', () => {
      expect(roundToNearestEven(-3.5, 0)).toBe(-4);
    });
  });

  describe('non-halfway cases (standard rounding)', () => {
    it('should round 2.4 to 2', () => {
      expect(roundToNearestEven(2.4, 0)).toBe(2);
    });

    it('should round 2.6 to 3', () => {
      expect(roundToNearestEven(2.6, 0)).toBe(3);
    });

    it('should round -2.4 to -2', () => {
      expect(roundToNearestEven(-2.4, 0)).toBe(-2);
    });

    it('should round -2.6 to -3', () => {
      expect(roundToNearestEven(-2.6, 0)).toBe(-3);
    });
  });

  describe('decimal precision', () => {
    it('should round 1.235 to 1.24 with precision 2 (banker rounding)', () => {
      expect(roundToNearestEven(1.235, 2)).toBe(1.24);
    });

    it('should round 1.245 to 1.24 with precision 2 (banker rounding)', () => {
      expect(roundToNearestEven(1.245, 2)).toBe(1.24);
    });

    it('should round 1.255 to 1.26 with precision 2 (banker rounding)', () => {
      expect(roundToNearestEven(1.255, 2)).toBe(1.26);
    });

    it('should round 1.2345 to 1.234 with precision 3', () => {
      expect(roundToNearestEven(1.2345, 3)).toBe(1.234);
    });

    it('should handle precision 8', () => {
      expect(roundToNearestEven(1.123456785, 8)).toBe(1.12345678);
    });
  });

  describe('edge cases', () => {
    it('should handle zero', () => {
      expect(roundToNearestEven(0, 2)).toBe(0);
    });

    it('should handle very small numbers', () => {
      expect(roundToNearestEven(0.000000015, 8)).toBe(0.00000002);
      expect(roundToNearestEven(0.00000001, 8)).toBe(0.00000001);
    });

    it('should handle very large numbers', () => {
      expect(roundToNearestEven(1234567890.5, 0)).toBe(1234567890);
    });
  });
});

describe('toFixedBanker', () => {
  it('should format with banker rounding and fixed decimals', () => {
    expect(toFixedBanker(2.5, 0)).toBe('2');
    expect(toFixedBanker(3.5, 0)).toBe('4');
  });

  it('should pad with trailing zeros', () => {
    expect(toFixedBanker(1.2, 3)).toBe('1.200');
    expect(toFixedBanker(5, 2)).toBe('5.00');
  });

  it('should handle negative numbers', () => {
    expect(toFixedBanker(-2.5, 0)).toBe('-2');
    expect(toFixedBanker(-1.5, 1)).toBe('-1.5');
  });
});

describe('fixPrecision', () => {
  it('should return 0 for zero input', () => {
    expect(fixPrecision(0)).toBe(0);
  });

  it('should handle Infinity', () => {
    expect(fixPrecision(Infinity)).toBe(Infinity);
    expect(fixPrecision(-Infinity)).toBe(-Infinity);
  });

  it('should round to 12 significant figures', () => {
    const result = fixPrecision(1.23456789012345);
    expect(result).toBe(1.23456789012);
  });
});

describe('cleanNumber', () => {
  it('should remove trailing zeros after decimal', () => {
    expect(cleanNumber(1.50000, 5)).toBe('1.5');
    expect(cleanNumber(2.0, 3)).toBe('2');
  });

  it('should respect precision limit', () => {
    expect(cleanNumber(1.123456789, 4)).toBe('1.1235');
  });

  it('should handle integers', () => {
    expect(cleanNumber(100, 2)).toBe('100');
  });

  it('should handle very small decimals', () => {
    expect(cleanNumber(0.0001, 4)).toBe('0.0001');
  });
});

describe('Digit Grouping Separators', () => {
  describe('UK format (3-3-3 with comma)', () => {
    it('should format 1234567 as 1,234,567', () => {
      expect(formatNumberWithSeparators(1234567, 0, 'uk')).toBe('1,234,567');
    });

    it('should format 1234567.89 as 1,234,567.89', () => {
      expect(formatNumberWithSeparators(1234567.89, 2, 'uk')).toBe('1,234,567.89');
    });

    it('should not add separator for numbers under 1000', () => {
      expect(formatNumberWithSeparators(999, 0, 'uk')).toBe('999');
    });

    it('should handle 1000 exactly', () => {
      expect(formatNumberWithSeparators(1000, 0, 'uk')).toBe('1,000');
    });

    it('should handle billions', () => {
      expect(formatNumberWithSeparators(1234567890, 0, 'uk')).toBe('1,234,567,890');
    });
  });

  describe('South Asian format (3-2-2 Indian numbering)', () => {
    it('should format 1234567 as 12,34,567', () => {
      expect(formatNumberWithSeparators(1234567, 0, 'south-asian')).toBe('12,34,567');
    });

    it('should format 12345678 as 1,23,45,678', () => {
      expect(formatNumberWithSeparators(12345678, 0, 'south-asian')).toBe('1,23,45,678');
    });

    it('should format 123456789 as 12,34,56,789', () => {
      expect(formatNumberWithSeparators(123456789, 0, 'south-asian')).toBe('12,34,56,789');
    });
  });

  describe('European/World format (3-3-3 with space, comma decimal)', () => {
    it('should format 1234567.89 as 1 234 567,89', () => {
      expect(formatNumberWithSeparators(1234567.89, 2, 'europe-latin')).toBe('1 234 567,89');
    });

    it('should use comma as decimal separator', () => {
      expect(formatNumberWithSeparators(1.5, 1, 'europe-latin')).toBe('1,5');
    });
  });

  describe('Swiss format (3-3-3 with apostrophe)', () => {
    it('should format 1234567 as 1\'234\'567', () => {
      expect(formatNumberWithSeparators(1234567, 0, 'swiss')).toBe("1'234'567");
    });

    it('should use period as decimal separator', () => {
      expect(formatNumberWithSeparators(1234.56, 2, 'swiss')).toBe("1'234.56");
    });
  });

  describe('East Asian format (4-4-4 myriad grouping)', () => {
    it('should format 12345678 as 1234,5678', () => {
      expect(formatNumberWithSeparators(12345678, 0, 'east-asian')).toBe('1234,5678');
    });

    it('should format 123456789012 as 1234,5678,9012', () => {
      expect(formatNumberWithSeparators(123456789012, 0, 'east-asian')).toBe('1234,5678,9012');
    });
  });

  describe('Arabic format (with Arabic numerals)', () => {
    it('should convert digits to Arabic numerals', () => {
      expect(formatNumberWithSeparators(123, 0, 'arabic')).toBe('١٢٣');
    });

    it('should format 1234567 with Arabic numerals and commas', () => {
      const result = formatNumberWithSeparators(1234567, 0, 'arabic');
      expect(result).toBe('١,٢٣٤,٥٦٧');
    });
  });

  describe('Period format (no thousands separator)', () => {
    it('should not add thousands separator', () => {
      expect(formatNumberWithSeparators(1234567, 0, 'period')).toBe('1234567');
    });

    it('should use period as decimal separator', () => {
      expect(formatNumberWithSeparators(1234.56, 2, 'period')).toBe('1234.56');
    });
  });

  describe('Comma format (no thousands separator, comma decimal)', () => {
    it('should not add thousands separator', () => {
      expect(formatNumberWithSeparators(1234567, 0, 'comma')).toBe('1234567');
    });

    it('should use comma as decimal separator', () => {
      expect(formatNumberWithSeparators(1234.56, 2, 'comma')).toBe('1234,56');
    });
  });
});

describe('stripSeparators', () => {
  it('should remove UK thousands separators', () => {
    expect(stripSeparators('1,234,567.89', 'uk')).toBe('1234567.89');
  });

  it('should remove European separators and convert decimal', () => {
    expect(stripSeparators('1 234 567,89', 'europe-latin')).toBe('1234567.89');
  });

  it('should convert Arabic numerals to Latin', () => {
    expect(stripSeparators('١,٢٣٤,٥٦٧', 'arabic')).toBe('1234567');
  });

  it('should remove Swiss apostrophe separators', () => {
    expect(stripSeparators("1'234'567.89", 'swiss')).toBe('1234567.89');
  });
});

describe('formatForClipboard', () => {
  it('should format without thousands separators for UK', () => {
    expect(formatForClipboard(1234567.89, 2, 'uk')).toBe('1234567.89');
  });

  it('should use comma decimal for European format', () => {
    expect(formatForClipboard(1234567.89, 2, 'europe-latin')).toBe('1234567,89');
  });

  it('should not include thousands separators in clipboard copy', () => {
    const formats: NumberFormat[] = ['uk', 'south-asian', 'swiss', 'east-asian'];
    for (const format of formats) {
      const result = formatForClipboard(1234567, 0, format);
      expect(result).not.toContain(',');
      expect(result).not.toContain(' ');
      expect(result).not.toContain("'");
    }
  });

  it('should respect precision setting', () => {
    expect(formatForClipboard(1.23456789, 4, 'uk')).toBe('1.2346');
    expect(formatForClipboard(1.23456789, 2, 'uk')).toBe('1.23');
    expect(formatForClipboard(1.23456789, 8, 'uk')).toBe('1.23456789');
  });

  it('should remove trailing zeros', () => {
    expect(formatForClipboard(1.5, 4, 'uk')).toBe('1.5');
    expect(formatForClipboard(2.0, 3, 'uk')).toBe('2');
  });
});

describe('Arabic Numeral Conversion', () => {
  it('should convert Latin to Arabic numerals', () => {
    expect(toArabicNumerals('0123456789')).toBe('٠١٢٣٤٥٦٧٨٩');
  });

  it('should convert Arabic to Latin numerals', () => {
    expect(toLatinNumerals('٠١٢٣٤٥٦٧٨٩')).toBe('0123456789');
  });

  it('should preserve non-digit characters', () => {
    expect(toArabicNumerals('1,234.56')).toBe('١,٢٣٤.٥٦');
    expect(toLatinNumerals('١,٢٣٤.٥٦')).toBe('1,234.56');
  });
});

describe('Precision Behavior', () => {
  it('should respect precision 0 (whole numbers only)', () => {
    expect(cleanNumber(1.567, 0)).toBe('2');
    expect(cleanNumber(1.234, 0)).toBe('1');
  });

  it('should respect precision 2', () => {
    expect(cleanNumber(1.567, 2)).toBe('1.57');
    expect(cleanNumber(1.234, 2)).toBe('1.23');
  });

  it('should respect precision 4', () => {
    expect(cleanNumber(1.123456, 4)).toBe('1.1235');
  });

  it('should respect precision 8', () => {
    expect(cleanNumber(1.123456789, 8)).toBe('1.12345679');
  });

  it('should handle precision for formatted numbers with separators', () => {
    expect(formatNumberWithSeparators(1234.5678, 2, 'uk')).toBe('1,234.57');
    expect(formatNumberWithSeparators(1234.5678, 4, 'uk')).toBe('1,234.5678');
  });
});
