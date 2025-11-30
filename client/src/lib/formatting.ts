export type NumberFormat = 'uk' | 'south-asian' | 'europe-latin' | 'swiss' | 'arabic' | 'arabic-latin' | 'east-asian' | 'period' | 'comma';

export interface NumberFormatConfig {
  name: string;
  thousands: string;
  decimal: string;
  useArabicNumerals?: boolean;
  myriad?: boolean;
}

export const NUMBER_FORMATS: Record<NumberFormat, NumberFormatConfig> = {
  'uk': { name: 'English', thousands: ',', decimal: '.' },
  'south-asian': { name: 'South Asian (Indian)', thousands: ',', decimal: '.' },
  'europe-latin': { name: 'World', thousands: ' ', decimal: ',' },
  'swiss': { name: 'Swiss', thousands: "'", decimal: '.' },
  'arabic': { name: 'Arabic', thousands: ',', decimal: '.', useArabicNumerals: true },
  'arabic-latin': { name: 'Arabic (Latin)', thousands: ',', decimal: '.' },
  'east-asian': { name: 'East Asian', thousands: ',', decimal: '.', myriad: true },
  'period': { name: 'Period', thousands: '', decimal: '.' },
  'comma': { name: 'Comma', thousands: '', decimal: ',' },
};

export const toArabicNumerals = (str: string): string => {
  const arabicMap: Record<string, string> = {
    '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
    '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
  };
  return str.split('').map(c => arabicMap[c] || c).join('');
};

export const toLatinNumerals = (str: string): string => {
  const latinMap: Record<string, string> = {
    '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
    '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
  };
  return str.split('').map(c => latinMap[c] || c).join('');
};

export const roundToNearestEven = (num: number, precision: number): number => {
  const absNum = Math.abs(num);
  if (absNum > 1e15 || (absNum < 1e-15 && absNum > 0)) {
    if (precision === 0) {
      return Math.round(num);
    }
  }
  
  const multiplier = Math.pow(10, precision);
  const scaled = num * multiplier;
  
  const nearestInt = Math.round(scaled);
  const diff = Math.abs(scaled - nearestInt);
  
  if (diff < 1e-10) {
    return nearestInt / multiplier;
  }
  
  const floor = Math.floor(scaled);
  const fraction = scaled - floor;
  
  if (Math.abs(fraction - 0.5) < 1e-10) {
    return (floor % 2 === 0 ? floor : floor + 1) / multiplier;
  } else {
    return Math.round(scaled) / multiplier;
  }
};

export const toFixedBanker = (num: number, precision: number): string => {
  const rounded = roundToNearestEven(num, precision);
  return rounded.toFixed(precision);
};

export const fixPrecision = (num: number): number => {
  if (num === 0) return 0;
  if (!isFinite(num)) return num;
  
  // Use JavaScript's full 17 significant digit precision
  // to preserve as much user-entered precision as possible
  const result = parseFloat(num.toPrecision(17));
  return result;
};

export const cleanNumber = (num: number, precision: number): string => {
  const fixed = fixPrecision(num);
  
  // For small values, extend precision to show meaningful digits
  let effectivePrecision = precision;
  const absNum = Math.abs(fixed);
  if (absNum > 0 && absNum < 1) {
    const magnitude = Math.floor(Math.log10(absNum));
    const neededDecimals = Math.abs(magnitude) + precision;
    effectivePrecision = Math.min(neededDecimals, 12);
  }
  
  // Use precision directly - no magnitude-based limiting for large numbers
  const formatted = toFixedBanker(fixed, effectivePrecision);
  const cleaned = formatted.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
  return cleaned;
};

export const formatNumberWithSeparators = (
  num: number, 
  precision: number, 
  formatKey: NumberFormat
): string => {
  const format = NUMBER_FORMATS[formatKey];
  const cleaned = cleanNumber(num, precision);
  const [integer, decimal] = cleaned.split('.');
  
  let formattedInteger = integer;
  if (format.thousands) {
    if (formatKey === 'south-asian') {
      const reversed = integer.split('').reverse().join('');
      let result = '';
      for (let i = 0; i < reversed.length; i++) {
        if (i === 3 || (i > 3 && (i - 3) % 2 === 0)) {
          result += format.thousands;
        }
        result += reversed[i];
      }
      formattedInteger = result.split('').reverse().join('');
    } else if (format.myriad) {
      formattedInteger = integer.replace(/\B(?=(\d{4})+(?!\d))/g, format.thousands);
    } else {
      formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, format.thousands);
    }
  }
  
  let result = decimal ? `${formattedInteger}${format.decimal}${decimal}` : formattedInteger;
  
  if (format.useArabicNumerals) {
    result = toArabicNumerals(result);
  }
  
  return result;
};

export const stripSeparators = (formattedValue: string, formatKey: NumberFormat): string => {
  const format = NUMBER_FORMATS[formatKey];
  let result = formattedValue;
  
  if (format.useArabicNumerals) {
    result = toLatinNumerals(result);
  }
  
  if (format.thousands) {
    result = result.split(format.thousands).join('');
  }
  
  if (format.decimal !== '.') {
    result = result.replace(format.decimal, '.');
  }
  
  return result;
};

export const formatForClipboard = (num: number, precision: number, formatKey: NumberFormat): string => {
  const format = NUMBER_FORMATS[formatKey];
  const cleaned = cleanNumber(num, precision);
  
  if (format.decimal !== '.') {
    return cleaned.replace('.', format.decimal);
  }
  return cleaned;
};
