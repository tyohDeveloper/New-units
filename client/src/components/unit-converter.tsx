import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CONVERSION_DATA, UnitCategory, convert, PREFIXES } from '@/lib/conversion-data';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, Copy, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export default function UnitConverter() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeCategory, setActiveCategory] = useState<UnitCategory>('length');
  const [fromUnit, setFromUnit] = useState<string>('');
  const [toUnit, setToUnit] = useState<string>('');
  const [fromPrefix, setFromPrefix] = useState<string>('none');
  const [toPrefix, setToPrefix] = useState<string>('none');
  const [inputValue, setInputValue] = useState<string>('1');
  const [result, setResult] = useState<number | null>(null);
  const [precision, setPrecision] = useState<number>(8);
  const [calculatorPrecision, setCalculatorPrecision] = useState<number>(8);
  const [flashCopyResult, setFlashCopyResult] = useState<boolean>(false);
  const [flashCopyCalc, setFlashCopyCalc] = useState<boolean>(false);
  const [flashCalcField1, setFlashCalcField1] = useState<boolean>(false);
  const [flashCalcField2, setFlashCalcField2] = useState<boolean>(false);
  const [flashCalcField3, setFlashCalcField3] = useState<boolean>(false);

  // Dimensional formula tracking for calculator
  interface DimensionalFormula {
    length?: number;
    mass?: number;
    time?: number;
    current?: number;
    temperature?: number;
    amount?: number;
    intensity?: number;
  }

  interface CalcValue {
    value: number; // SI base unit value
    dimensions: DimensionalFormula;
    prefix: string; // The prefix to display with (e.g., 'k', 'M', 'none')
  }

  // Derived unit catalog for alternative representations
  interface DerivedUnitInfo {
    symbol: string;
    category: UnitCategory;
    unitId: string;
    dimensions: DimensionalFormula;
    allowPrefixes: boolean;
  }

  // Catalog of all known derived units with their dimensional formulas
  const DERIVED_UNITS_CATALOG: DerivedUnitInfo[] = [
    // Frequency
    { symbol: 'Hz', category: 'frequency', unitId: 'hz', dimensions: { time: -1 }, allowPrefixes: true },
    // Force
    { symbol: 'N', category: 'force', unitId: 'n', dimensions: { mass: 1, length: 1, time: -2 }, allowPrefixes: true },
    // Pressure
    { symbol: 'Pa', category: 'pressure', unitId: 'pa', dimensions: { mass: 1, length: -1, time: -2 }, allowPrefixes: true },
    // Energy / Work
    { symbol: 'J', category: 'energy', unitId: 'j', dimensions: { mass: 1, length: 2, time: -2 }, allowPrefixes: true },
    // Power
    { symbol: 'W', category: 'power', unitId: 'w', dimensions: { mass: 1, length: 2, time: -3 }, allowPrefixes: true },
    // Electric charge
    { symbol: 'C', category: 'charge', unitId: 'c', dimensions: { current: 1, time: 1 }, allowPrefixes: false },
    // Voltage
    { symbol: 'V', category: 'potential', unitId: 'v', dimensions: { mass: 1, length: 2, time: -3, current: -1 }, allowPrefixes: true },
    // Capacitance
    { symbol: 'F', category: 'capacitance', unitId: 'f', dimensions: { mass: -1, length: -2, time: 4, current: 2 }, allowPrefixes: true },
    // Resistance
    { symbol: 'Ω', category: 'resistance', unitId: 'ohm', dimensions: { mass: 1, length: 2, time: -3, current: -2 }, allowPrefixes: true },
    // Conductance
    { symbol: 'S', category: 'conductance', unitId: 's', dimensions: { mass: -1, length: -2, time: 3, current: 2 }, allowPrefixes: false },
    // Magnetic flux
    { symbol: 'Wb', category: 'magnetic_flux', unitId: 'wb', dimensions: { mass: 1, length: 2, time: -2, current: -1 }, allowPrefixes: false },
    // Magnetic flux density
    { symbol: 'T', category: 'magnetic_density', unitId: 't', dimensions: { mass: 1, time: -2, current: -1 }, allowPrefixes: false },
    // Inductance
    { symbol: 'H', category: 'inductance', unitId: 'h', dimensions: { mass: 1, length: 2, time: -2, current: -2 }, allowPrefixes: true },
    // Catalytic activity
    { symbol: 'kat', category: 'catalytic', unitId: 'kat', dimensions: { amount: 1, time: -1 }, allowPrefixes: false },
    // Area (m²)
    { symbol: 'm²', category: 'area', unitId: 'm2', dimensions: { length: 2 }, allowPrefixes: true },
    // Volume (L)
    { symbol: 'L', category: 'volume', unitId: 'l', dimensions: { length: 3 }, allowPrefixes: true },
  ];

  // Alternative unit representation
  interface AlternativeRepresentation {
    displaySymbol: string;         // How to display, e.g., "m⋅J" or "kg⋅m³⋅s⁻²"
    category: UnitCategory | null; // Category if single unit, null if hybrid
    unitId: string | null;         // Unit ID if single unit, null if hybrid
    isHybrid: boolean;             // True if combination of derived+base units
    components: {                  // For hybrid representations
      derivedUnit?: DerivedUnitInfo;
      remainingDimensions?: DimensionalFormula;
    };
  }

  // Calculator state
  const [calcValues, setCalcValues] = useState<Array<CalcValue | null>>([null, null, null, null]);
  const [calcOp1, setCalcOp1] = useState<'*' | '/' | null>(null);
  const [calcOp2, setCalcOp2] = useState<'*' | '/' | null>(null);
  const [resultUnit, setResultUnit] = useState<string | null>(null);
  const [resultCategory, setResultCategory] = useState<UnitCategory | null>(null);
  const [resultPrefix, setResultPrefix] = useState<string>('none');
  const [selectedAlternative, setSelectedAlternative] = useState<number>(0); // Index of selected alternative representation

  // Number format state
  type NumberFormat = 'us' | 'uk' | 'south-asian' | 'europe-latin' | 'swiss' | 'arabic' | 'arabic-latin' | 'east-asian' | 'period' | 'comma';
  const [numberFormat, setNumberFormat] = useState<NumberFormat>('uk');
  
  // Language state (ISO 639-1 codes)
  const [language, setLanguage] = useState<string>('en');
  
  // Languages with complete translations available
  // Only showing languages that have full translations for all labels to ensure consistent user experience
  const ISO_LANGUAGES = [
    'en', // English (380M native speakers)
    'ar', // Arabic (274M)
    'de', // German (76M)
    'es', // Spanish (486M)
    'fr', // French (77M native, 280M total)
    'it', // Italian (64M)
    'ja', // Japanese (125M)
    'pt', // Portuguese (236M)
    'ru', // Russian (150M)
    'zh', // Chinese (920M+)
  ];
  
  const [includeBeerWine, setIncludeBeerWine] = useState<boolean>(false);

  const NUMBER_FORMATS: Record<NumberFormat, { name: string; thousands: string; decimal: string; useArabicNumerals?: boolean; myriad?: boolean }> = {
    'us': { name: 'US', thousands: ',', decimal: '.' },
    'uk': { name: 'UK & offshoots', thousands: ',', decimal: '.' },
    'south-asian': { name: 'South Asian (Indian)', thousands: ',', decimal: '.' },
    'europe-latin': { name: 'World', thousands: ' ', decimal: ',' },
    'swiss': { name: 'Swiss', thousands: "'", decimal: '.' },
    'arabic': { name: 'Arabic', thousands: ',', decimal: '.', useArabicNumerals: true },
    'arabic-latin': { name: 'Arabic (Latin)', thousands: ',', decimal: '.' },
    'east-asian': { name: 'East Asian', thousands: ',', decimal: '.', myriad: true },
    'period': { name: 'Period', thousands: '', decimal: '.' },
    'comma': { name: 'Comma', thousands: '', decimal: ',' },
  };

  // Helper: Convert Latin numerals to Arabic numerals
  const toArabicNumerals = (str: string): string => {
    const arabicMap: Record<string, string> = {
      '0': '٠', '1': '١', '2': '٢', '3': '٣', '4': '٤',
      '5': '٥', '6': '٦', '7': '٧', '8': '٨', '9': '٩'
    };
    return str.split('').map(c => arabicMap[c] || c).join('');
  };

  // Helper: Convert Arabic numerals to Latin numerals
  const toLatinNumerals = (str: string): string => {
    const latinMap: Record<string, string> = {
      '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
      '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
    };
    return str.split('').map(c => latinMap[c] || c).join('');
  };

  // Helper: Round to nearest even (banker's rounding)
  const roundToNearestEven = (num: number, precision: number): number => {
    // For extremely large or small numbers, check if we're beyond floating-point precision
    const absNum = Math.abs(num);
    if (absNum > 1e15 || (absNum < 1e-15 && absNum > 0)) {
      // Beyond reliable precision - just round to the nearest integer if precision allows
      if (precision === 0) {
        return Math.round(num);
      }
    }
    
    const multiplier = Math.pow(10, precision);
    const scaled = num * multiplier;
    
    // Check for floating-point errors in scaled value
    const nearestInt = Math.round(scaled);
    const diff = Math.abs(scaled - nearestInt);
    
    // If the difference is tiny (floating-point error), treat as exact integer
    if (diff < 1e-10) {
      return nearestInt / multiplier;
    }
    
    const floor = Math.floor(scaled);
    const fraction = scaled - floor;
    
    if (Math.abs(fraction - 0.5) < 1e-10) {
      // Exactly halfway - round to nearest even number
      return (floor % 2 === 0 ? floor : floor + 1) / multiplier;
    } else {
      // Not exactly halfway - use standard rounding
      return Math.round(scaled) / multiplier;
    }
  };

  // Helper: toFixed with banker's rounding
  const toFixedBanker = (num: number, precision: number): string => {
    const rounded = roundToNearestEven(num, precision);
    return rounded.toFixed(precision);
  };

  // Helper: Apply regional spelling variations (ONLY for English language)
  // This function should ONLY be called when the language is English
  const applyRegionalSpelling = (unitName: string): string => {
    // Only apply regional spelling variations for English
    // For all other languages, use their own translations directly
    if (language !== 'en') {
      return unitName;
    }
    
    // US-style formats use "meter" and "liter"
    const usFormats: NumberFormat[] = ['us', 'arabic-latin', 'period'];
    
    if (usFormats.includes(numberFormat)) {
      // US English: use "meter" and "liter" spelling
      return unitName;
    } else {
      // UK/International English: use "metre" and "litre" spelling
      return unitName
        .replace(/Meter/g, 'Metre')
        .replace(/meter/g, 'metre')
        .replace(/Liter/g, 'Litre')
        .replace(/liter/g, 'litre');
    }
  };

  // Map of prefix exponents (shared across normalization functions)
  const PREFIX_EXPONENTS: Record<string, number> = {
    'yotta': 24, 'zetta': 21, 'exa': 18, 'peta': 15, 'tera': 12,
    'giga': 9, 'mega': 6, 'kilo': 3, 'none': 0, 'centi': -2,
    'milli': -3, 'micro': -6, 'nano': -9, 'pico': -12,
    'femto': -15, 'atto': -18, 'zepto': -21, 'yocto': -24
  };
  
  // Reverse map: exponent to prefix id
  const EXPONENT_TO_PREFIX: { [key: number]: string } = {
    24: 'yotta', 21: 'zetta', 18: 'exa', 15: 'peta', 12: 'tera',
    9: 'giga', 6: 'mega', 3: 'kilo', 0: 'none', 
    [-2]: 'centi', [-3]: 'milli', [-6]: 'micro', [-9]: 'nano', [-12]: 'pico',
    [-15]: 'femto', [-18]: 'atto', [-21]: 'zepto', [-24]: 'yocto'
  };

  // Helper: Normalize mass units (kg should display as gram with appropriate prefix)
  // When kg with a prefix OTHER than 'none' or 'kilo' is selected, convert to gram with combined prefix
  // When g with prefix "k" is selected, convert to kg with no prefix
  // 'none' and 'kilo' for kg are the base representation (kilo-gram)
  const normalizeMassUnit = (unit: string, prefix: string): { unit: string; prefix: string } => {
    if (activeCategory !== 'mass') return { unit, prefix };
    
    // If unit is kg and a prefix other than 'none' or 'kilo' is selected
    // 'none' and 'kilo' are the base representations for kg
    if (unit === 'kg' && prefix !== 'none' && prefix !== 'kilo') {
      const prefixExp = PREFIX_EXPONENTS[prefix] || 0;
      const combinedExp = prefixExp + 3; // kg = 10^3 g
      
      // Find the matching prefix for the combined exponent
      const newPrefix = EXPONENT_TO_PREFIX[combinedExp];
      if (newPrefix) {
        return { unit: 'g', prefix: newPrefix };
      }
      // If no matching prefix exists, keep as is
      return { unit, prefix };
    }
    
    // If unit is g and prefix is 'kilo', convert to kg with no prefix
    if (unit === 'g' && prefix === 'kilo') {
      return { unit: 'kg', prefix: 'none' };
    }
    
    return { unit, prefix };
  };

  // Helper: Automatically normalize mass values to the best gram-based representation
  // Given a value in kg, finds the best prefix for grams and returns normalized display
  // E.g., 1000 kg -> 1 Mg, 1 kg -> 1 kg, 0.001 kg -> 1 g
  // Prefixes don't stack: we convert to grams first, then find best prefix
  const normalizeMassValue = (valueInKg: number): { 
    value: number; 
    unitSymbol: string; 
    prefixSymbol: string;
    prefixId: string;
  } => {
    // Convert kg to grams
    const valueInGrams = valueInKg * 1000;
    const absGrams = Math.abs(valueInGrams);
    
    // Find the best prefix for the gram value
    // We want to find the largest prefix that gives us a value >= 1
    const prefixOrder = [
      { id: 'yotta', exp: 24 }, { id: 'zetta', exp: 21 }, { id: 'exa', exp: 18 },
      { id: 'peta', exp: 15 }, { id: 'tera', exp: 12 }, { id: 'giga', exp: 9 },
      { id: 'mega', exp: 6 }, { id: 'kilo', exp: 3 }, { id: 'none', exp: 0 },
      { id: 'milli', exp: -3 }, { id: 'micro', exp: -6 }, { id: 'nano', exp: -9 },
      { id: 'pico', exp: -12 }, { id: 'femto', exp: -15 }, { id: 'atto', exp: -18 },
      { id: 'zepto', exp: -21 }, { id: 'yocto', exp: -24 }
    ];
    
    let bestPrefix = { id: 'none', exp: 0 };
    for (const p of prefixOrder) {
      const factor = Math.pow(10, p.exp);
      if (absGrams >= factor) {
        bestPrefix = p;
        break;
      }
    }
    
    // Special case: if the best prefix is 'kilo', show as kg instead of kg
    if (bestPrefix.id === 'kilo') {
      return {
        value: valueInKg,
        unitSymbol: 'kg',
        prefixSymbol: '',
        prefixId: 'none'
      };
    }
    
    const prefixData = PREFIXES.find(p => p.id === bestPrefix.id) || PREFIXES.find(p => p.id === 'none')!;
    const displayValue = valueInGrams / prefixData.factor;
    
    return {
      value: displayValue,
      unitSymbol: 'g',
      prefixSymbol: prefixData.symbol,
      prefixId: bestPrefix.id
    };
  };

  // Helper: Normalize mass display for calculator results with user-selected prefix
  // When user manually selects a prefix for kg, normalize appropriately
  const normalizeMassDisplay = (valueInKg: number, currentPrefix: string, unitId: string | null): { 
    value: number; 
    unitSymbol: string; 
    prefixSymbol: string;
    normalizedPrefix: string;
    normalizedUnit: string;
    shouldNormalize: boolean;
  } => {
    // Only apply to mass category with kg or base SI unit (null means kg)
    const isKgUnit = unitId === 'kg' || unitId === null;
    
    if (!isKgUnit) {
      // For non-kg units in mass, just return as-is
      const prefixData = PREFIXES.find(p => p.id === currentPrefix) || PREFIXES.find(p => p.id === 'none')!;
      const cat = CONVERSION_DATA.find(c => c.id === 'mass');
      const unit = cat?.units.find(u => u.id === unitId);
      return {
        value: unit ? valueInKg / (unit.factor * (unit.allowPrefixes ? prefixData.factor : 1)) : valueInKg,
        unitSymbol: unit?.symbol || 'kg',
        prefixSymbol: unit?.allowPrefixes ? prefixData.symbol : '',
        normalizedPrefix: currentPrefix,
        normalizedUnit: unitId || 'kg',
        shouldNormalize: false
      };
    }
    
    // For kg: only normalize when prefix is NOT 'none' and NOT 'kilo'
    // 'none' and 'kilo' represent the base kg unit (kilo-gram)
    if (currentPrefix !== 'none' && currentPrefix !== 'kilo') {
      const prefixExp = PREFIX_EXPONENTS[currentPrefix] || 0;
      const combinedExp = prefixExp + 3; // kg = 10^3 g
      
      const newPrefix = EXPONENT_TO_PREFIX[combinedExp];
      if (newPrefix) {
        const newPrefixData = PREFIXES.find(p => p.id === newPrefix) || PREFIXES.find(p => p.id === 'none')!;
        // Convert kg to grams, then apply the new prefix
        const valueInGrams = valueInKg * 1000;
        const displayValue = valueInGrams / newPrefixData.factor;
        return {
          value: displayValue,
          unitSymbol: 'g',
          prefixSymbol: newPrefixData.symbol,
          normalizedPrefix: newPrefix,
          normalizedUnit: 'g',
          shouldNormalize: true
        };
      }
    }
    
    // No normalization needed - show as kg
    // For 'kilo' prefix, treat as no prefix since kg = kilo-gram
    const prefixData = PREFIXES.find(p => p.id === currentPrefix) || PREFIXES.find(p => p.id === 'none')!;
    return {
      value: currentPrefix === 'kilo' ? valueInKg : valueInKg / prefixData.factor,
      unitSymbol: 'kg',
      prefixSymbol: currentPrefix === 'kilo' ? '' : prefixData.symbol,
      normalizedPrefix: currentPrefix === 'kilo' ? 'none' : currentPrefix,
      normalizedUnit: 'kg',
      shouldNormalize: false
    };
  };

  // Translations for multiple languages
  // Supported languages: en (English), ar (Arabic), de (German), es (Spanish), fr (French), 
  // it (Italian), pt (Portuguese), ru (Russian), zh (Chinese), ja (Japanese)
  // Other languages fall back to English
  const TRANSLATIONS: Record<string, { 
    en: string; 
    ar: string; 
    de?: string;
    es?: string;
    fr?: string;
    it?: string;
    pt?: string;
    ru?: string;
    zh?: string;
    ja?: string;
  }> = {
    // Category Groups
    'Base Quantities': { 
      en: 'Base Quantities', ar: 'الكميات الأساسية', de: 'Basisgrößen',
      es: 'Cantidades Base', fr: 'Grandeurs de Base', it: 'Grandezze di Base',
      pt: 'Grandezas Base', ru: 'Базовые Величины', zh: '基本量', ja: '基本量'
    },
    'Mechanics': { 
      en: 'Mechanics', ar: 'الميكانيكا', de: 'Mechanik',
      es: 'Mecánica', fr: 'Mécanique', it: 'Meccanica',
      pt: 'Mecânica', ru: 'Механика', zh: '力学', ja: '力学'
    },
    'Electricity & Magnetism': { 
      en: 'Electricity & Magnetism', ar: 'الكهرباء والمغناطيسية', de: 'Elektrizität & Magnetismus',
      es: 'Electricidad y Magnetismo', fr: 'Électricité et Magnétisme', it: 'Elettricità e Magnetismo',
      pt: 'Eletricidade e Magnetismo', ru: 'Электричество и Магнетизм', zh: '电磁学', ja: '電気と磁気'
    },
    'Radiation & Physics': { 
      en: 'Radiation & Physics', ar: 'الإشعاع والفيزياء', de: 'Strahlung & Physik',
      es: 'Radiación y Física', fr: 'Radiation et Physique', it: 'Radiazione e Fisica',
      pt: 'Radiação e Física', ru: 'Излучение и Физика', zh: '辐射与物理', ja: '放射線と物理学'
    },
    'Human Response': { 
      en: 'Human Response', ar: 'الاستجابة البشرية', de: 'Menschliche Wahrnehmung',
      es: 'Respuesta Humana', fr: 'Réponse Humaine', it: 'Risposta Umana',
      pt: 'Resposta Humana', ru: 'Человеческое Восприятие', zh: '人体响应', ja: '人間の反応'
    },
    'Specialized': { 
      en: 'Specialized', ar: 'متخصص', de: 'Spezialisiert',
      es: 'Especializado', fr: 'Spécialisé', it: 'Specializzato',
      pt: 'Especializado', ru: 'Специализированные', zh: '专业', ja: '専門'
    },
    // Categories
    'Length': { 
      en: 'Length', ar: 'الطول', de: 'Länge',
      es: 'Longitud', fr: 'Longueur', it: 'Lunghezza',
      pt: 'Comprimento', ru: 'Длина', zh: '长度', ja: '長さ'
    },
    'Mass': { 
      en: 'Mass', ar: 'الكتلة', de: 'Masse',
      es: 'Masa', fr: 'Masse', it: 'Massa',
      pt: 'Massa', ru: 'Масса', zh: '质量', ja: '質量'
    },
    'Time': { 
      en: 'Time', ar: 'الوقت', de: 'Zeit',
      es: 'Tiempo', fr: 'Temps', it: 'Tempo',
      pt: 'Tempo', ru: 'Время', zh: '时间', ja: '時間'
    },
    'Electric Current': { 
      en: 'Electric Current', ar: 'التيار الكهربائي', de: 'Elektrischer Strom',
      es: 'Corriente Eléctrica', fr: 'Courant Électrique', it: 'Corrente Elettrica',
      pt: 'Corrente Elétrica', ru: 'Электрический Ток', zh: '电流', ja: '電流'
    },
    'Temperature': { 
      en: 'Temperature', ar: 'درجة الحرارة', de: 'Temperatur',
      es: 'Temperatura', fr: 'Température', it: 'Temperatura',
      pt: 'Temperatura', ru: 'Температура', zh: '温度', ja: '温度'
    },
    'Amount of Substance': { 
      en: 'Amount of Substance', ar: 'كمية المادة', de: 'Stoffmenge',
      es: 'Cantidad de Sustancia', fr: 'Quantité de Matière', it: 'Quantità di Sostanza',
      pt: 'Quantidade de Substância', ru: 'Количество Вещества', zh: '物质的量', ja: '物質量'
    },
    'Luminous Intensity': { 
      en: 'Luminous Intensity', ar: 'شدة الإضاءة', de: 'Lichtstärke',
      es: 'Intensidad Luminosa', fr: 'Intensité Lumineuse', it: 'Intensità Luminosa',
      pt: 'Intensidade Luminosa', ru: 'Сила Света', zh: '发光强度', ja: '光度'
    },
    'Area': { 
      en: 'Area', ar: 'المساحة', de: 'Fläche',
      es: 'Área', fr: 'Surface', it: 'Area',
      pt: 'Área', ru: 'Площадь', zh: '面积', ja: '面積'
    },
    'Volume': { 
      en: 'Volume', ar: 'الحجم', de: 'Volumen',
      es: 'Volumen', fr: 'Volume', it: 'Volume',
      pt: 'Volume', ru: 'Объём', zh: '体积', ja: '体積'
    },
    'Speed': { 
      en: 'Speed', ar: 'السرعة', de: 'Geschwindigkeit',
      es: 'Velocidad', fr: 'Vitesse', it: 'Velocità',
      pt: 'Velocidade', ru: 'Скорость', zh: '速度', ja: '速度'
    },
    'Acceleration': { 
      en: 'Acceleration', ar: 'التسارع', de: 'Beschleunigung',
      es: 'Aceleración', fr: 'Accélération', it: 'Accelerazione',
      pt: 'Aceleração', ru: 'Ускорение', zh: '加速度', ja: '加速度'
    },
    'Force': { 
      en: 'Force', ar: 'القوة', de: 'Kraft',
      es: 'Fuerza', fr: 'Force', it: 'Forza',
      pt: 'Força', ru: 'Сила', zh: '力', ja: '力'
    },
    'Pressure': { 
      en: 'Pressure', ar: 'الضغط', de: 'Druck',
      es: 'Presión', fr: 'Pression', it: 'Pressione',
      pt: 'Pressão', ru: 'Давление', zh: '压力', ja: '圧力'
    },
    'Energy': { 
      en: 'Energy', ar: 'الطاقة', de: 'Energie',
      es: 'Energía', fr: 'Énergie', it: 'Energia',
      pt: 'Energia', ru: 'Энергия', zh: '能量', ja: 'エネルギー'
    },
    'Power': { 
      en: 'Power', ar: 'القدرة', de: 'Leistung',
      es: 'Potencia', fr: 'Puissance', it: 'Potenza',
      pt: 'Potência', ru: 'Мощность', zh: '功率', ja: '仕事率'
    },
    'Torque': { 
      en: 'Torque', ar: 'عزم الدوران', de: 'Drehmoment',
      es: 'Par', fr: 'Couple', it: 'Coppia',
      pt: 'Torque', ru: 'Крутящий Момент', zh: '扭矩', ja: 'トルク'
    },
    'Flow Rate': { 
      en: 'Flow Rate', ar: 'معدل التدفق', de: 'Durchflussrate',
      es: 'Caudal', fr: 'Débit', it: 'Portata',
      pt: 'Taxa de Fluxo', ru: 'Расход', zh: '流量', ja: '流量'
    },
    'Flow Rate (Volumetric)': { 
      en: 'Flow Rate (Volumetric)', ar: 'معدل التدفق (الحجمي)', de: 'Durchflussrate (Volumetrisch)',
      es: 'Caudal (Volumétrico)', fr: 'Débit (Volumétrique)', it: 'Portata (Volumetrica)',
      pt: 'Taxa de Fluxo (Volumétrica)', ru: 'Расход (Объёмный)', zh: '流量（体积）', ja: '流量（体積）'
    },
    'Density': { 
      en: 'Density', ar: 'الكثافة', de: 'Dichte',
      es: 'Densidad', fr: 'Densité', it: 'Densità',
      pt: 'Densidade', ru: 'Плотность', zh: '密度', ja: '密度'
    },
    'Dynamic Viscosity': { 
      en: 'Dynamic Viscosity', ar: 'اللزوجة الديناميكية', de: 'Dynamische Viskosität',
      es: 'Viscosidad Dinámica', fr: 'Viscosité Dynamique', it: 'Viscosità Dinamica',
      pt: 'Viscosidade Dinâmica', ru: 'Динамическая Вязкость', zh: '动态粘度', ja: '動粘度'
    },
    'Viscosity (Dynamic)': { 
      en: 'Viscosity (Dynamic)', ar: 'اللزوجة (الديناميكية)', de: 'Viskosität (Dynamisch)',
      es: 'Viscosidad (Dinámica)', fr: 'Viscosité (Dynamique)', it: 'Viscosità (Dinamica)',
      pt: 'Viscosidade (Dinâmica)', ru: 'Вязкость (Динамическая)', zh: '粘度（动态）', ja: '粘度（動的）'
    },
    'Surface Tension': { 
      en: 'Surface Tension', ar: 'التوتر السطحي', de: 'Oberflächenspannung',
      es: 'Tensión Superficial', fr: 'Tension Superficielle', it: 'Tensione Superficiale',
      pt: 'Tensão Superficial', ru: 'Поверхностное Натяжение', zh: '表面张力', ja: '表面張力'
    },
    'Charge': { 
      en: 'Charge', ar: 'الشحنة', de: 'Ladung',
      es: 'Carga', fr: 'Charge', it: 'Carica',
      pt: 'Carga', ru: 'Заряд', zh: '电荷', ja: '電荷'
    },
    'Electric Charge': { 
      en: 'Electric Charge', ar: 'الشحنة الكهربائية', de: 'Elektrische Ladung',
      es: 'Carga Eléctrica', fr: 'Charge Électrique', it: 'Carica Elettrica',
      pt: 'Carga Elétrica', ru: 'Электрический Заряд', zh: '电荷', ja: '電荷'
    },
    'Potential': { 
      en: 'Potential', ar: 'الجهد', de: 'Potential',
      es: 'Potencial', fr: 'Potentiel', it: 'Potenziale',
      pt: 'Potencial', ru: 'Потенциал', zh: '电势', ja: '電位'
    },
    'Electric Potential': { 
      en: 'Electric Potential', ar: 'الجهد الكهربائي', de: 'Elektrisches Potential',
      es: 'Potencial Eléctrico', fr: 'Potentiel Électrique', it: 'Potenziale Elettrico',
      pt: 'Potencial Elétrico', ru: 'Электрический Потенциал', zh: '电势', ja: '電位'
    },
    'Capacitance': { 
      en: 'Capacitance', ar: 'السعة', de: 'Kapazität',
      es: 'Capacitancia', fr: 'Capacité', it: 'Capacità',
      pt: 'Capacitância', ru: 'Ёмкость', zh: '电容', ja: '静電容量'
    },
    'Resistance': { 
      en: 'Resistance', ar: 'المقاومة', de: 'Widerstand',
      es: 'Resistencia', fr: 'Résistance', it: 'Resistenza',
      pt: 'Resistência', ru: 'Сопротивление', zh: '电阻', ja: '抵抗'
    },
    'Conductance': { 
      en: 'Conductance', ar: 'الموصلية', de: 'Leitwert',
      es: 'Conductancia', fr: 'Conductance', it: 'Conduttanza',
      pt: 'Condutância', ru: 'Проводимость', zh: '电导', ja: 'コンダクタンス'
    },
    'Inductance': { 
      en: 'Inductance', ar: 'الحث', de: 'Induktivität',
      es: 'Inductancia', fr: 'Inductance', it: 'Induttanza',
      pt: 'Indutância', ru: 'Индуктивность', zh: '电感', ja: 'インダクタンス'
    },
    'Magnetic Flux': { 
      en: 'Magnetic Flux', ar: 'التدفق المغناطيسي', de: 'Magnetischer Fluss',
      es: 'Flujo Magnético', fr: 'Flux Magnétique', it: 'Flusso Magnetico',
      pt: 'Fluxo Magnético', ru: 'Магнитный Поток', zh: '磁通量', ja: '磁束'
    },
    'Magnetic Flux Density': { 
      en: 'Magnetic Flux Density', ar: 'كثافة التدفق المغناطيسي', de: 'Magnetische Flussdichte',
      es: 'Densidad de Flujo Magnético', fr: 'Densité de Flux Magnétique', it: 'Densità di Flusso Magnetico',
      pt: 'Densidade de Fluxo Magnético', ru: 'Магнитная Индукция', zh: '磁通密度', ja: '磁束密度'
    },
    'Radioactivity': { 
      en: 'Radioactivity', ar: 'النشاط الإشعاعي', de: 'Radioaktivität',
      es: 'Radioactividad', fr: 'Radioactivité', it: 'Radioattività',
      pt: 'Radioatividade', ru: 'Радиоактивность', zh: '放射性', ja: '放射能'
    },
    'Radiation Dose': { 
      en: 'Radiation Dose', ar: 'جرعة الإشعاع', de: 'Strahlendosis',
      es: 'Dosis de Radiación', fr: 'Dose de Radiation', it: 'Dose di Radiazione',
      pt: 'Dose de Radiação', ru: 'Доза Излучения', zh: '辐射剂量', ja: '放射線量'
    },
    'Absorbed Radiation Dose': { 
      en: 'Absorbed Radiation Dose', ar: 'جرعة الإشعاع الممتص', de: 'Absorbierte Strahlendosis',
      es: 'Dosis de Radiación Absorbida', fr: 'Dose de Radiation Absorbée', it: 'Dose di Radiazione Assorbita',
      pt: 'Dose de Radiação Absorvida', ru: 'Поглощённая Доза', zh: '吸收剂量', ja: '吸収線量'
    },
    'Equivalent Dose': { 
      en: 'Equivalent Dose', ar: 'الجرعة المكافئة', de: 'Äquivalentdosis',
      es: 'Dosis Equivalente', fr: 'Dose Équivalente', it: 'Dose Equivalente',
      pt: 'Dose Equivalente', ru: 'Эквивалентная Доза', zh: '当量剂量', ja: '等価線量'
    },
    'Equivalent Radiation Dose': { 
      en: 'Equivalent Radiation Dose', ar: 'جرعة الإشعاع المكافئة', de: 'Äquivalente Strahlendosis',
      es: 'Dosis de Radiación Equivalente', fr: 'Dose de Radiation Équivalente', it: 'Dose di Radiazione Equivalente',
      pt: 'Dose de Radiação Equivalente', ru: 'Эквивалентная Доза Излучения', zh: '等效剂量', ja: '等価線量'
    },
    'Catalytic Activity': { 
      en: 'Catalytic Activity', ar: 'النشاط التحفيزي', de: 'Katalytische Aktivität',
      es: 'Actividad Catalítica', fr: 'Activité Catalytique', it: 'Attività Catalitica',
      pt: 'Atividade Catalítica', ru: 'Каталитическая Активность', zh: '催化活性', ja: '触媒活性'
    },
    'Angle': { 
      en: 'Angle', ar: 'الزاوية', de: 'Winkel',
      es: 'Ángulo', fr: 'Angle', it: 'Angolo',
      pt: 'Ângulo', ru: 'Угол', zh: '角度', ja: '角度'
    },
    'Plane Angle': { 
      en: 'Plane Angle', ar: 'الزاوية المستوية', de: 'Ebener Winkel',
      es: 'Ángulo Plano', fr: 'Angle Plan', it: 'Angolo Piano',
      pt: 'Ângulo Plano', ru: 'Плоский Угол', zh: '平面角', ja: '平面角'
    },
    'Solid Angle': { 
      en: 'Solid Angle', ar: 'الزاوية المجسمة', de: 'Raumwinkel',
      es: 'Ángulo Sólido', fr: 'Angle Solide', it: 'Angolo Solido',
      pt: 'Ângulo Sólido', ru: 'Телесный Угол', zh: '立体角', ja: '立体角'
    },
    'Frequency': { 
      en: 'Frequency', ar: 'التردد', de: 'Frequenz',
      es: 'Frecuencia', fr: 'Fréquence', it: 'Frequenza',
      pt: 'Frequência', ru: 'Частота', zh: '频率', ja: '周波数'
    },
    'Sound Pressure': { 
      en: 'Sound Pressure', ar: 'ضغط الصوت', de: 'Schalldruck',
      es: 'Presión Sonora', fr: 'Pression Sonore', it: 'Pressione Sonora',
      pt: 'Pressão Sonora', ru: 'Звуковое Давление', zh: '声压', ja: '音圧'
    },
    'Luminous Flux': { 
      en: 'Luminous Flux', ar: 'التدفق الضوئي', de: 'Lichtstrom',
      es: 'Flujo Luminoso', fr: 'Flux Lumineux', it: 'Flusso Luminoso',
      pt: 'Fluxo Luminoso', ru: 'Световой Поток', zh: '光通量', ja: '光束'
    },
    'Luminous Flux (Human)': { 
      en: 'Luminous Flux (Human)', ar: 'التدفق الضوئي (البشري)', de: 'Lichtstrom (Menschlich)',
      es: 'Flujo Luminoso (Humano)', fr: 'Flux Lumineux (Humain)', it: 'Flusso Luminoso (Umano)',
      pt: 'Fluxo Luminoso (Humano)', ru: 'Световой Поток (Человеческий)', zh: '光通量（人眼）', ja: '光束（人間）'
    },
    'Illuminance': { 
      en: 'Illuminance', ar: 'الإضاءة', de: 'Beleuchtungsstärke',
      es: 'Iluminancia', fr: 'Éclairement', it: 'Illuminamento',
      pt: 'Iluminância', ru: 'Освещённость', zh: '照度', ja: '照度'
    },
    'Luminous Exitance': { 
      en: 'Luminous Exitance', ar: 'الإشعاع الضوئي', de: 'Spezifische Lichtausstrahlung',
      es: 'Exitancia Luminosa', fr: 'Exitance Lumineuse', it: 'Emittanza Luminosa',
      pt: 'Exitância Luminosa', ru: 'Светимость', zh: '光出射度', ja: '光出射度'
    },
    'Luminance': { 
      en: 'Luminance', ar: 'اللمعان', de: 'Leuchtdichte',
      es: 'Luminancia', fr: 'Luminance', it: 'Luminanza',
      pt: 'Luminância', ru: 'Яркость', zh: '亮度', ja: '輝度'
    },
    'Refractive Power': { 
      en: 'Refractive Power', ar: 'قوة الانكسار', de: 'Brechkraft',
      es: 'Potencia Refractiva', fr: 'Puissance de Réfraction', it: 'Potere Rifrattivo',
      pt: 'Poder Refrativo', ru: 'Оптическая Сила', zh: '屈光度', ja: '屈折力'
    },
    'Refractive Power (Vision)': { 
      en: 'Refractive Power (Vision)', ar: 'قوة الانكسار (البصر)', de: 'Brechkraft (Sehen)',
      es: 'Potencia Refractiva (Visión)', fr: 'Puissance de Réfraction (Vision)', it: 'Potere Rifrattivo (Vista)',
      pt: 'Poder Refrativo (Visão)', ru: 'Оптическая Сила (Зрение)', zh: '屈光度（视力）', ja: '屈折力（視覚）'
    },
    'Digital Storage': { 
      en: 'Digital Storage', ar: 'التخزين الرقمي', de: 'Digitaler Speicher',
      es: 'Almacenamiento Digital', fr: 'Stockage Numérique', it: 'Archiviazione Digitale',
      pt: 'Armazenamento Digital', ru: 'Цифровое Хранилище', zh: '数字存储', ja: 'デジタルストレージ'
    },
    'Typographic Units': { 
      en: 'Typographic Units', ar: 'وحدات الطباعة', de: 'Typografische Einheiten',
      es: 'Unidades Tipográficas', fr: 'Unités Typographiques', it: 'Unità Tipografiche',
      pt: 'Unidades Tipográficas', ru: 'Типографские Единицы', zh: '排版单位', ja: 'タイポグラフィ単位'
    },
    // UI Labels
    'Base unit:': { 
      en: 'Base unit:', ar: ':الوحدة الأساسية', de: 'Basiseinheit:',
      es: 'Unidad base:', fr: 'Unité de base:', it: 'Unità di base:',
      pt: 'Unidade base:', ru: 'Базовая единица:', zh: '基本单位：', ja: '基本単位：'
    },
    'Include Beer/Wine': { 
      en: 'Include Beer/Wine', ar: 'تضمين البيرة/النبيذ', de: 'Bier/Wein einschließen',
      es: 'Incluir Cerveza/Vino', fr: 'Inclure Bière/Vin', it: 'Includi Birra/Vino',
      pt: 'Incluir Cerveja/Vinho', ru: 'Включить Пиво/Вино', zh: '包括啤酒/葡萄酒', ja: 'ビール/ワインを含む'
    },
    'Base Factor': { 
      en: 'Base Factor', ar: 'العامل الأساسي', de: 'Basisfaktor',
      es: 'Factor Base', fr: 'Facteur de Base', it: 'Fattore di Base',
      pt: 'Fator Base', ru: 'Базовый Множитель', zh: '基础因子', ja: '基本係数'
    },
    'SI Base Units': { 
      en: 'SI Base Units', ar: 'وحدات SI الأساسية', de: 'SI-Basiseinheiten',
      es: 'Unidades Base SI', fr: 'Unités de Base SI', it: 'Unità di Base SI',
      pt: 'Unidades Base SI', ru: 'Базовые Единицы SI', zh: 'SI基本单位', ja: 'SI基本単位'
    },
    'Decimals': { 
      en: 'Decimals', ar: 'الكسور العشرية', de: 'Dezimalstellen',
      es: 'Decimales', fr: 'Décimales', it: 'Decimali',
      pt: 'Decimais', ru: 'Десятичные', zh: '小数', ja: '小数'
    },
    'Copy': { 
      en: 'Copy', ar: 'نسخ', de: 'Kopieren',
      es: 'Copiar', fr: 'Copier', it: 'Copia',
      pt: 'Copiar', ru: 'Копировать', zh: '复制', ja: 'コピー'
    },
    'Prefix': { 
      en: 'Prefix', ar: 'بادئة', de: 'Präfix',
      es: 'Prefijo', fr: 'Préfixe', it: 'Prefisso',
      pt: 'Prefixo', ru: 'Префикс', zh: '前缀', ja: '接頭辞'
    },
    'Unit': { 
      en: 'Unit', ar: 'وحدة', de: 'Einheit',
      es: 'Unidad', fr: 'Unité', it: 'Unità',
      pt: 'Unidade', ru: 'Единица', zh: '单位', ja: '単位'
    },
    'Result': { 
      en: 'Result', ar: 'النتيجة', de: 'Ergebnis',
      es: 'Resultado', fr: 'Résultat', it: 'Risultato',
      pt: 'Resultado', ru: 'Результат', zh: '结果', ja: '結果'
    },
    'Calculator': { 
      en: 'Calculator', ar: 'الآلة الحاسبة', de: 'Rechner',
      es: 'Calculadora', fr: 'Calculatrice', it: 'Calcolatrice',
      pt: 'Calculadora', ru: 'Калькулятор', zh: '计算器', ja: '計算機'
    },
    'Clear': { 
      en: 'Clear', ar: 'مسح', de: 'Löschen',
      es: 'Limpiar', fr: 'Effacer', it: 'Cancella',
      pt: 'Limpar', ru: 'Очистить', zh: '清除', ja: 'クリア'
    },
    'Dimensional Analysis': { 
      en: 'Dimensional Analysis', ar: 'التحليل البعدي', de: 'Dimensionsanalyse',
      es: 'Análisis Dimensional', fr: 'Analyse Dimensionnelle', it: 'Analisi Dimensionale',
      pt: 'Análise Dimensional', ru: 'Размерный Анализ', zh: '量纲分析', ja: '次元解析'
    },
    'From': { 
      en: 'From', ar: 'من', de: 'Von',
      es: 'De', fr: 'De', it: 'Da',
      pt: 'De', ru: 'Из', zh: '从', ja: 'から'
    },
    'To': { 
      en: 'To', ar: 'إلى', de: 'Zu',
      es: 'A', fr: 'À', it: 'A',
      pt: 'Para', ru: 'В', zh: '到', ja: 'へ'
    },
    // Common unit base names
    'meter': { en: 'meter', ar: 'متر' },
    'metre': { en: 'metre', ar: 'متر' },
    'kilogram': { en: 'kilogram', ar: 'كيلوغرام' },
    'second': { en: 'second', ar: 'ثانية' },
    'ampere': { en: 'ampere', ar: 'أمبير' },
    'kelvin': { en: 'kelvin', ar: 'كلفن' },
    'celsius': { en: 'celsius', ar: 'سلزيوس' },
    'mole': { en: 'mole', ar: 'مول' },
    'candela': { en: 'candela', ar: 'شمعة' },
    'liter': { en: 'liter', ar: 'لتر' },
    'litre': { en: 'litre', ar: 'لتر' },
    'square meter': { en: 'square meter', ar: 'متر مربع' },
    'square metre': { en: 'square metre', ar: 'متر مربع' },
    'cubic meter': { en: 'cubic meter', ar: 'متر مكعب' },
    'cubic metre': { en: 'cubic metre', ar: 'متر مكعب' },
    'meter/second': { en: 'meter/second', ar: 'متر/ثانية' },
    'metre/second': { en: 'metre/second', ar: 'متر/ثانية' },
    'meter/sq second': { en: 'meter/sq second', ar: 'متر/ثانية²' },
    'metre/sq second': { en: 'metre/sq second', ar: 'متر/ثانية²' },
    'newton': { en: 'newton', ar: 'نيوتن' },
    'pascal': { en: 'pascal', ar: 'باسكال' },
    'joule': { en: 'joule', ar: 'جول' },
    'watt': { en: 'watt', ar: 'واط' },
    'newton meter': { en: 'newton meter', ar: 'نيوتن متر' },
    'newton metre': { en: 'newton metre', ar: 'نيوتن متر' },
    'liter/second': { en: 'liter/second', ar: 'لتر/ثانية' },
    'litre/second': { en: 'litre/second', ar: 'لتر/ثانية' },
    'coulomb': { en: 'coulomb', ar: 'كولوم' },
    'volt': { en: 'volt', ar: 'فولت' },
    'farad': { en: 'farad', ar: 'فاراد' },
    'ohm': { en: 'ohm', ar: 'أوم' },
    'siemens': { en: 'siemens', ar: 'سيمنز' },
    'henry': { en: 'henry', ar: 'هنري' },
    'weber': { en: 'weber', ar: 'ويبر' },
    'tesla': { en: 'tesla', ar: 'تسلا' },
    'becquerel': { en: 'becquerel', ar: 'بكريل' },
    'gray': { en: 'gray', ar: 'غراي' },
    'sievert': { en: 'sievert', ar: 'سيفرت' },
    'katal': { en: 'katal', ar: 'كاتال' },
    'radian': { en: 'radian', ar: 'راديان' },
    'degree': { en: 'degree', ar: 'درجة' },
    'steradian': { en: 'steradian', ar: 'ستراديان' },
    'hertz': { en: 'hertz', ar: 'هرتز' },
    'decibel': { en: 'decibel', ar: 'ديسيبل' },
    'lumen': { en: 'lumen', ar: 'لومن' },
    'lux': { en: 'lux', ar: 'لوكس' },
    'lumen/square-meter': { en: 'lumen/square-meter', ar: 'لومن/متر²' },
    'lumen/square-metre': { en: 'lumen/square-metre', ar: 'لومن/متر²' },
    'candela/square-meter': { en: 'candela/square-meter', ar: 'شمعة/متر²' },
    'candela/square-metre': { en: 'candela/square-metre', ar: 'شمعة/متر²' },
    'reciprocal-meter': { en: 'reciprocal-meter', ar: 'متر⁻¹' },
    'reciprocal-metre': { en: 'reciprocal-metre', ar: 'متر⁻¹' },
    'byte': { en: 'byte', ar: 'بايت' },
    'point': { en: 'point', ar: 'نقطة' },
    'newton/meter': { en: 'newton/meter', ar: 'نيوتن/متر' },
    'newton/metre': { en: 'newton/metre', ar: 'نيوتن/متر' },
    'pascal-second': { en: 'pascal-second', ar: 'باسكال ثانية' },
    // Unit names (all capitalized forms from conversion-data.ts)
    'Meter': { 
      en: 'Meter', ar: 'متر', de: 'Meter',
      es: 'Metro', fr: 'Mètre', it: 'Metro',
      pt: 'Metro', ru: 'Метр', zh: '米', ja: 'メートル'
    },
    'Metre': { 
      en: 'Metre', ar: 'متر', de: 'Meter',
      es: 'Metro', fr: 'Mètre', it: 'Metro',
      pt: 'Metro', ru: 'Метр', zh: '米', ja: 'メートル'
    },
    'Millimeter': { 
      en: 'Millimeter', ar: 'مليمتر', de: 'Millimeter',
      es: 'Milímetro', fr: 'Millimètre', it: 'Millimetro',
      pt: 'Milímetro', ru: 'Миллиметр', zh: '毫米', ja: 'ミリメートル'
    },
    'Inch': { 
      en: 'Inch', ar: 'بوصة', de: 'Zoll',
      es: 'Pulgada', fr: 'Pouce', it: 'Pollice',
      pt: 'Polegada', ru: 'Дюйм', zh: '英寸', ja: 'インチ'
    },
    'Foot': { 
      en: 'Foot', ar: 'قدم', de: 'Fuß',
      es: 'Pie', fr: 'Pied', it: 'Piede',
      pt: 'Pé', ru: 'Фут', zh: '英尺', ja: 'フィート'
    },
    'Foot:Inch': { 
      en: 'Foot:Inch', ar: 'قدم:بوصة', de: 'Fuß:Zoll',
      es: 'Pie:Pulgada', fr: 'Pied:Pouce', it: 'Piede:Pollice',
      pt: 'Pé:Polegada', ru: 'Фут:Дюйм', zh: '英尺:英寸', ja: 'フィート:インチ'
    },
    'Yard': { 
      en: 'Yard', ar: 'ياردة', de: 'Yard',
      es: 'Yarda', fr: 'Yard', it: 'Iarda',
      pt: 'Jarda', ru: 'Ярд', zh: '码', ja: 'ヤード'
    },
    'Mile': { 
      en: 'Mile', ar: 'ميل', de: 'Meile',
      es: 'Milla', fr: 'Mille', it: 'Miglio',
      pt: 'Milha', ru: 'Миля', zh: '英里', ja: 'マイル'
    },
    'Nautical Mile': { 
      en: 'Nautical Mile', ar: 'ميل بحري', de: 'Seemeile',
      es: 'Milla Náutica', fr: 'Mille Marin', it: 'Miglio Nautico',
      pt: 'Milha Náutica', ru: 'Морская Миля', zh: '海里', ja: '海里'
    },
    'Link (Gunter)': { en: 'Link (Gunter)', ar: 'وصلة (غونتر)' },
    'Rod': { en: 'Rod', ar: 'قضيب' },
    'Chain': { en: 'Chain', ar: 'سلسلة' },
    'Furlong': { en: 'Furlong', ar: 'فرلنغ' },
    'Fathom': { en: 'Fathom', ar: 'قامة' },
    'Parsec': { en: 'Parsec', ar: 'فرسخ فلكي' },
    'Astronomical Unit': { en: 'Astronomical Unit', ar: 'وحدة فلكية' },
    'Light Year': { en: 'Light Year', ar: 'سنة ضوئية' },
    'Angstrom': { en: 'Angstrom', ar: 'أنجستروم' },
    'Kilogram': { 
      en: 'Kilogram', ar: 'كيلوغرام', de: 'Kilogramm',
      es: 'Kilogramo', fr: 'Kilogramme', it: 'Chilogrammo',
      pt: 'Quilograma', ru: 'Килограмм', zh: '千克', ja: 'キログラム'
    },
    'Gram': { 
      en: 'Gram', ar: 'غرام', de: 'Gramm',
      es: 'Gramo', fr: 'Gramme', it: 'Grammo',
      pt: 'Grama', ru: 'Грамм', zh: '克', ja: 'グラム'
    },
    'Tonne': { 
      en: 'Tonne', ar: 'طن متري', de: 'Tonne',
      es: 'Tonelada', fr: 'Tonne', it: 'Tonnellata',
      pt: 'Tonelada', ru: 'Тонна', zh: '吨', ja: 'トン'
    },
    'Ounce': { 
      en: 'Ounce', ar: 'أونصة', de: 'Unze',
      es: 'Onza', fr: 'Once', it: 'Oncia',
      pt: 'Onça', ru: 'Унция', zh: '盎司', ja: 'オンス'
    },
    'Pound': { 
      en: 'Pound', ar: 'باوند', de: 'Pfund',
      es: 'Libra', fr: 'Livre', it: 'Libbra',
      pt: 'Libra', ru: 'Фунт', zh: '磅', ja: 'ポンド'
    },
    'Stone': { 
      en: 'Stone', ar: 'ستون', de: 'Stone',
      es: 'Stone', fr: 'Stone', it: 'Stone',
      pt: 'Stone', ru: 'Стоун', zh: '英石', ja: 'ストーン'
    },
    'Short Ton (US)': { 
      en: 'Short Ton (US)', ar: 'طن قصير (أمريكي)', de: 'Short Ton (US)',
      es: 'Tonelada Corta (EE.UU.)', fr: 'Tonne Courte (US)', it: 'Tonnellata Corta (US)',
      pt: 'Tonelada Curta (EUA)', ru: 'Короткая Тонна (США)', zh: '短吨（美国）', ja: 'ショートトン（米国）'
    },
    'Long Ton (UK)': { 
      en: 'Long Ton (UK)', ar: 'طن طويل (بريطاني)', de: 'Long Ton (UK)',
      es: 'Tonelada Larga (UK)', fr: 'Tonne Longue (UK)', it: 'Tonnellata Lunga (UK)',
      pt: 'Tonelada Longa (Reino Unido)', ru: 'Длинная Тонна (Великобритания)', zh: '长吨（英国）', ja: 'ロングトン（英国）'
    },
    'Grain': { en: 'Grain', ar: 'حبة' },
    'Pennyweight': { en: 'Pennyweight', ar: 'بيني وايت' },
    'Troy Ounce': { en: 'Troy Ounce', ar: 'أونصة ترويا' },
    'Carat': { en: 'Carat', ar: 'قيراط' },
    'Slug': { en: 'Slug', ar: 'سلَغ' },
    'Second': { 
      en: 'Second', ar: 'ثانية', de: 'Sekunde',
      es: 'Segundo', fr: 'Seconde', it: 'Secondo',
      pt: 'Segundo', ru: 'Секунда', zh: '秒', ja: '秒'
    },
    'Minute': { 
      en: 'Minute', ar: 'دقيقة', de: 'Minute',
      es: 'Minuto', fr: 'Minute', it: 'Minuto',
      pt: 'Minuto', ru: 'Минута', zh: '分钟', ja: '分'
    },
    'Hour': { 
      en: 'Hour', ar: 'ساعة', de: 'Stunde',
      es: 'Hora', fr: 'Heure', it: 'Ora',
      pt: 'Hora', ru: 'Час', zh: '小时', ja: '時間'
    },
    'Day': { 
      en: 'Day', ar: 'يوم', de: 'Tag',
      es: 'Día', fr: 'Jour', it: 'Giorno',
      pt: 'Dia', ru: 'День', zh: '天', ja: '日'
    },
    'Week': { 
      en: 'Week', ar: 'أسبوع', de: 'Woche',
      es: 'Semana', fr: 'Semaine', it: 'Settimana',
      pt: 'Semana', ru: 'Неделя', zh: '周', ja: '週'
    },
    'Month (Avg)': { 
      en: 'Month (Avg)', ar: 'شهر (متوسط)', de: 'Monat (Durchschn.)',
      es: 'Mes (Promedio)', fr: 'Mois (Moy.)', it: 'Mese (Media)',
      pt: 'Mês (Média)', ru: 'Месяц (Средн.)', zh: '月（平均）', ja: '月（平均）'
    },
    'Year': { 
      en: 'Year', ar: 'سنة', de: 'Jahr',
      es: 'Año', fr: 'Année', it: 'Anno',
      pt: 'Ano', ru: 'Год', zh: '年', ja: '年'
    },
    'Shake': { en: 'Shake', ar: 'شيك' },
    'Ampere': { en: 'Ampere', ar: 'أمبير' },
    'Biot (abampere)': { en: 'Biot (abampere)', ar: 'بيوت (أمبير مطلق)' },
    'Statampere': { en: 'Statampere', ar: 'ستات أمبير' },
    'Celsius': { 
      en: 'Celsius', ar: 'سلزيوس', de: 'Celsius',
      es: 'Celsius', fr: 'Celsius', it: 'Celsius',
      pt: 'Celsius', ru: 'Цельсий', zh: '摄氏度', ja: '摂氏'
    },
    'Fahrenheit': { 
      en: 'Fahrenheit', ar: 'فهرنهايت', de: 'Fahrenheit',
      es: 'Fahrenheit', fr: 'Fahrenheit', it: 'Fahrenheit',
      pt: 'Fahrenheit', ru: 'Фаренгейт', zh: '华氏度', ja: '華氏'
    },
    'Kelvin': { 
      en: 'Kelvin', ar: 'كلفن', de: 'Kelvin',
      es: 'Kelvin', fr: 'Kelvin', it: 'Kelvin',
      pt: 'Kelvin', ru: 'Кельвин', zh: '开尔文', ja: 'ケルビン'
    },
    'Rankine': { 
      en: 'Rankine', ar: 'رانكين', de: 'Rankine',
      es: 'Rankine', fr: 'Rankine', it: 'Rankine',
      pt: 'Rankine', ru: 'Ранкин', zh: '兰氏度', ja: 'ランキン'
    },
    'Mole': { en: 'Mole', ar: 'مول' },
    'Pound-mole': { en: 'Pound-mole', ar: 'باوند مول' },
    'Candela': { en: 'Candela', ar: 'شمعة' },
    'Candlepower': { en: 'Candlepower', ar: 'قوة شمعة' },
    'Hefnerkerze': { en: 'Hefnerkerze', ar: 'هيفنركيرزي' },
    'Square Meter': { 
      en: 'Square Meter', ar: 'متر مربع', de: 'Quadratmeter',
      es: 'Metro Cuadrado', fr: 'Mètre Carré', it: 'Metro Quadrato',
      pt: 'Metro Quadrado', ru: 'Квадратный Метр', zh: '平方米', ja: '平方メートル'
    },
    'Square Metre': { 
      en: 'Square Metre', ar: 'متر مربع', de: 'Quadratmeter',
      es: 'Metro Cuadrado', fr: 'Mètre Carré', it: 'Metro Quadrato',
      pt: 'Metro Quadrado', ru: 'Квадратный Метр', zh: '平方米', ja: '平方メートル'
    },
    'Hectare': { 
      en: 'Hectare', ar: 'هكتار', de: 'Hektar',
      es: 'Hectárea', fr: 'Hectare', it: 'Ettaro',
      pt: 'Hectare', ru: 'Гектар', zh: '公顷', ja: 'ヘクタール'
    },
    'Square Inch': { 
      en: 'Square Inch', ar: 'بوصة مربعة', de: 'Quadratzoll',
      es: 'Pulgada Cuadrada', fr: 'Pouce Carré', it: 'Pollice Quadrato',
      pt: 'Polegada Quadrada', ru: 'Квадратный Дюйм', zh: '平方英寸', ja: '平方インチ'
    },
    'Square Foot': { 
      en: 'Square Foot', ar: 'قدم مربع', de: 'Quadratfuß',
      es: 'Pie Cuadrado', fr: 'Pied Carré', it: 'Piede Quadrato',
      pt: 'Pé Quadrado', ru: 'Квадратный Фут', zh: '平方英尺', ja: '平方フィート'
    },
    'Square Yard': { 
      en: 'Square Yard', ar: 'ياردة مربعة', de: 'Quadratyard',
      es: 'Yarda Cuadrada', fr: 'Yard Carré', it: 'Iarda Quadrata',
      pt: 'Jarda Quadrada', ru: 'Квадратный Ярд', zh: '平方码', ja: '平方ヤード'
    },
    'Acre': { 
      en: 'Acre', ar: 'فدان', de: 'Acre',
      es: 'Acre', fr: 'Acre', it: 'Acro',
      pt: 'Acre', ru: 'Акр', zh: '英亩', ja: 'エーカー'
    },
    'Square Mile': { 
      en: 'Square Mile', ar: 'ميل مربع', de: 'Quadratmeile',
      es: 'Milla Cuadrada', fr: 'Mille Carré', it: 'Miglio Quadrato',
      pt: 'Milha Quadrada', ru: 'Квадратная Миля', zh: '平方英里', ja: '平方マイル'
    },
    'Barn': { en: 'Barn', ar: 'بارن' },
    'Dunam': { en: 'Dunam', ar: 'دونم' },
    'Township (US)': { en: 'Township (US)', ar: 'بلدية (أمريكي)' },
    'Section (US)': { en: 'Section (US)', ar: 'قسم (أمريكي)' },
    'Square Degree': { en: 'Square Degree', ar: 'درجة مربعة' },
    'Cubic Meter': { en: 'Cubic Meter', ar: 'متر مكعب' },
    'Cubic Metre': { en: 'Cubic Metre', ar: 'متر مكعب' },
    'Liter': { 
      en: 'Liter', ar: 'لتر', de: 'Liter',
      es: 'Litro', fr: 'Litre', it: 'Litro',
      pt: 'Litro', ru: 'Литр', zh: '升', ja: 'リットル'
    },
    'Litre': { 
      en: 'Litre', ar: 'لتر', de: 'Liter',
      es: 'Litro', fr: 'Litre', it: 'Litro',
      pt: 'Litro', ru: 'Литр', zh: '升', ja: 'リットル'
    },
    'Milliliter': { 
      en: 'Milliliter', ar: 'مليلتر', de: 'Milliliter',
      es: 'Mililitro', fr: 'Millilitre', it: 'Millilitro',
      pt: 'Mililitro', ru: 'Миллилитр', zh: '毫升', ja: 'ミリリットル'
    },
    'Millilitre': { 
      en: 'Millilitre', ar: 'مليلتر', de: 'Milliliter',
      es: 'Mililitro', fr: 'Millilitre', it: 'Millilitro',
      pt: 'Mililitro', ru: 'Миллилитр', zh: '毫升', ja: 'ミリリットル'
    },
    'Cubic Foot': { en: 'Cubic Foot', ar: 'قدم مكعب' },
    'Cubic Yard': { en: 'Cubic Yard', ar: 'ياردة مكعبة' },
    'Fluid Ounce (US)': { en: 'Fluid Ounce (US)', ar: 'أونصة سائلة (أمريكي)' },
    'Fluid Ounce (Imp)': { en: 'Fluid Ounce (Imp)', ar: 'أونصة سائلة (إمبراطوري)' },
    'Tablespoon (US)': { en: 'Tablespoon (US)', ar: 'ملعقة كبيرة (أمريكي)' },
    'Tablespoon (Imp)': { en: 'Tablespoon (Imp)', ar: 'ملعقة كبيرة (إمبراطوري)' },
    'Teaspoon (US)': { en: 'Teaspoon (US)', ar: 'ملعقة صغيرة (أمريكي)' },
    'Teaspoon (Imp)': { en: 'Teaspoon (Imp)', ar: 'ملعقة صغيرة (إمبراطوري)' },
    'Cup (US)': { en: 'Cup (US)', ar: 'كوب (أمريكي)' },
    'Pint (US)': { en: 'Pint (US)', ar: 'باينت (أمريكي)' },
    'Pint (Imp)': { en: 'Pint (Imp)', ar: 'باينت (إمبراطوري)' },
    'Quart (US)': { en: 'Quart (US)', ar: 'كوارت (أمريكي)' },
    'Quart (Imp)': { en: 'Quart (Imp)', ar: 'كوارت (إمبراطوري)' },
    'Gallon (US)': { 
      en: 'Gallon (US)', ar: 'جالون (أمريكي)', de: 'Gallone (US)',
      es: 'Galón (EE.UU.)', fr: 'Gallon (US)', it: 'Gallone (US)',
      pt: 'Galão (EUA)', ru: 'Галлон (США)', zh: '加仑（美国）', ja: 'ガロン（米国）'
    },
    'Gallon (Imp)': { 
      en: 'Gallon (Imp)', ar: 'جالون (إمبراطوري)', de: 'Gallone (Imp)',
      es: 'Galón (Imperial)', fr: 'Gallon (Imp)', it: 'Gallone (Imp)',
      pt: 'Galão (Imperial)', ru: 'Галлон (Имперский)', zh: '加仑（英制）', ja: 'ガロン（英国）'
    },
    'Barrel (Oil)': { en: 'Barrel (Oil)', ar: 'برميل (نفط)' },
    'Barrel (Beer)': { en: 'Barrel (Beer)', ar: 'برميل (بيرة)' },
    'Keg (Beer)': { en: 'Keg (Beer)', ar: 'برميل صغير (بيرة)' },
    'Mini Keg (Beer)': { en: 'Mini Keg (Beer)', ar: 'برميل صغير جداً (بيرة)' },
    'Bottle (Wine)': { en: 'Bottle (Wine)', ar: 'زجاجة (نبيذ)' },
    'Magnum (Wine)': { en: 'Magnum (Wine)', ar: 'ماغنوم (نبيذ)' },
    'Bottle (Beer, small)': { en: 'Bottle (Beer, small)', ar: 'زجاجة (بيرة، صغيرة)' },
    'Bottle (Beer, longneck)': { en: 'Bottle (Beer, longneck)', ar: 'زجاجة (بيرة، طويلة)' },
    'Bottle (Beer, large)': { en: 'Bottle (Beer, large)', ar: 'زجاجة (بيرة، كبيرة)' },
    'Bushel': { en: 'Bushel', ar: 'بوشل' },
    'Acre-foot': { en: 'Acre-foot', ar: 'فدان قدم' },
    'Cubic Mile': { en: 'Cubic Mile', ar: 'ميل مكعب' },
    'Hertz': { en: 'Hertz', ar: 'هرتز' },
    'Meter/Second': { en: 'Meter/Second', ar: 'متر/ثانية' },
    'Meter/sq sec': { en: 'Meter/sq sec', ar: 'متر/ثانية²' },
    'Kilometer/Hour': { en: 'Kilometer/Hour', ar: 'كيلومتر/ساعة' },
    'Mile/Hour': { en: 'Mile/Hour', ar: 'ميل/ساعة' },
    'Knot': { en: 'Knot', ar: 'عقدة' },
    'Speed of Light': { en: 'Speed of Light', ar: 'سرعة الضوء' },
    'Mach': { en: 'Mach', ar: 'ماخ' },
    'Foot/sq sec': { en: 'Foot/sq sec', ar: 'قدم/ثانية²' },
    'Gal': { en: 'Gal', ar: 'غال' },
    'g-force': { en: 'g-force', ar: 'قوة جاذبية' },
    'Newton': { en: 'Newton', ar: 'نيوتن' },
    'Dyne': { en: 'Dyne', ar: 'داين' },
    'Kilogram-force': { en: 'Kilogram-force', ar: 'كيلوغرام قوة' },
    'Pound-force': { en: 'Pound-force', ar: 'باوند قوة' },
    'Poundal': { en: 'Poundal', ar: 'باوندال' },
    'Kip': { en: 'Kip', ar: 'كيب' },
    'Pascal': { en: 'Pascal', ar: 'باسكال' },
    'Bar': { en: 'Bar', ar: 'بار' },
    'Millibar': { en: 'Millibar', ar: 'ميليبار' },
    'Microbar': { en: 'Microbar', ar: 'ميكروبار' },
    'Atmosphere': { en: 'Atmosphere', ar: 'ضغط جوي' },
    'PSI': { en: 'PSI', ar: 'باوند/بوصة²' },
    'Torr': { en: 'Torr', ar: 'تور' },
    'mmHg': { en: 'mmHg', ar: 'ملم زئبق' },
    'Dyne/cm²': { en: 'Dyne/cm²', ar: 'داين/سم²' },
    'Joule': { en: 'Joule', ar: 'جول' },
    'Kilojoule': { en: 'Kilojoule', ar: 'كيلوجول' },
    'Calorie': { en: 'Calorie', ar: 'سعرة' },
    'Kilocalorie': { en: 'Kilocalorie', ar: 'كيلوسعرة' },
    'BTU': { en: 'BTU', ar: 'وحدة حرارية بريطانية' },
    'Watt-hour': { en: 'Watt-hour', ar: 'واط ساعة' },
    'Kilowatt-hour': { en: 'Kilowatt-hour', ar: 'كيلوواط ساعة' },
    'Electronvolt': { en: 'Electronvolt', ar: 'إلكترون فولت' },
    'Erg': { en: 'Erg', ar: 'إرغ' },
    'Foot-pound': { en: 'Foot-pound', ar: 'قدم باوند' },
    'Ton of TNT': { en: 'Ton of TNT', ar: 'طن TNT' },
    'Watt': { en: 'Watt', ar: 'واط' },
    'Kilowatt': { en: 'Kilowatt', ar: 'كيلوواط' },
    'Horsepower': { en: 'Horsepower', ar: 'حصان' },
    'Metric HP': { en: 'Metric HP', ar: 'حصان متري' },
    'Ton Refrigeration': { en: 'Ton Refrigeration', ar: 'طن تبريد' },
    'Coulomb': { en: 'Coulomb', ar: 'كولوم' },
    'Ampere-hour': { en: 'Ampere-hour', ar: 'أمبير ساعة' },
    'Milliamp-hour': { en: 'Milliamp-hour', ar: 'ميلي أمبير ساعة' },
    'Faraday': { en: 'Faraday', ar: 'فاراداي' },
    'Volt': { en: 'Volt', ar: 'فولت' },
    'Statvolt': { en: 'Statvolt', ar: 'ستات فولت' },
    'Farad': { en: 'Farad', ar: 'فاراد' },
    'Ohm': { en: 'Ohm', ar: 'أوم' },
    'Siemens': { en: 'Siemens', ar: 'سيمنز' },
    'Mho': { en: 'Mho', ar: 'موه' },
    'Henry': { en: 'Henry', ar: 'هنري' },
    'Weber': { en: 'Weber', ar: 'ويبر' },
    'Maxwell': { en: 'Maxwell', ar: 'ماكسويل' },
    'Tesla': { en: 'Tesla', ar: 'تسلا' },
    'Gauss': { en: 'Gauss', ar: 'غاوس' },
    'Becquerel': { en: 'Becquerel', ar: 'بكريل' },
    'Curie': { en: 'Curie', ar: 'كوري' },
    'Rutherford': { en: 'Rutherford', ar: 'رذرفورد' },
    'Gray': { en: 'Gray', ar: 'غراي' },
    'Rad': { en: 'Rad', ar: 'راد' },
    'Sievert': { en: 'Sievert', ar: 'سيفرت' },
    'Rem': { en: 'Rem', ar: 'ريم' },
    'Roentgen': { en: 'Roentgen', ar: 'رونتجن' },
    'Katal': { en: 'Katal', ar: 'كاتال' },
    'Enzyme Unit': { en: 'Enzyme Unit', ar: 'وحدة إنزيم' },
    'Radian': { en: 'Radian', ar: 'راديان' },
    'Degree': { en: 'Degree', ar: 'درجة' },
    'Degree (DMS)': { en: 'Degree (DMS)', ar: 'درجة (د:د:ث)' },
    'Arcminute': { en: 'Arcminute', ar: 'دقيقة قوسية' },
    'Arcsecond': { en: 'Arcsecond', ar: 'ثانية قوسية' },
    'Gradian': { en: 'Gradian', ar: 'غراديان' },
    'Turn': { en: 'Turn', ar: 'دورة' },
    'Spat': { en: 'Spat', ar: 'سبات' },
    'Steradian': { en: 'Steradian', ar: 'ستراديان' },
    'Decibel': { en: 'Decibel', ar: 'ديسيبل' },
    'Lumen': { en: 'Lumen', ar: 'لومن' },
    'Talbot': { en: 'Talbot', ar: 'تالبوت' },
    'Candlepower (spherical)': { en: 'Candlepower (spherical)', ar: 'قوة شمعة (كروية)' },
    'Lux': { en: 'Lux', ar: 'لوكس' },
    'Foot-candle': { en: 'Foot-candle', ar: 'قدم شمعة' },
    'Lumen/m²': { en: 'Lumen/m²', ar: 'لومن/م²' },
    'Foot-lambert': { en: 'Foot-lambert', ar: 'قدم لامبرت' },
    'Candela/m²': { en: 'Candela/m²', ar: 'شمعة/م²' },
    'Lambert': { en: 'Lambert', ar: 'لامبرت' },
    'Stilb': { en: 'Stilb', ar: 'ستيلب' },
    'Diopter': { en: 'Diopter', ar: 'ديوبتر' },
    'Bit': { en: 'Bit', ar: 'بت' },
    'Byte': { en: 'Byte', ar: 'بايت' },
    'Kilobyte': { en: 'Kilobyte', ar: 'كيلوبايت' },
    'Megabyte': { en: 'Megabyte', ar: 'ميغابايت' },
    'Gigabyte': { en: 'Gigabyte', ar: 'غيغابايت' },
    'Terabyte': { en: 'Terabyte', ar: 'تيرابايت' },
    'Point': { en: 'Point', ar: 'نقطة' },
    'Pica': { en: 'Pica', ar: 'بيكا' },
    'Didot': { en: 'Didot', ar: 'ديدوت' },
    'Cicero': { en: 'Cicero', ar: 'شيشرون' },
    'Twip': { en: 'Twip', ar: 'تويب' },
    'Newton-meter': { en: 'Newton-meter', ar: 'نيوتن متر' },
    'Newton-metre': { en: 'Newton-metre', ar: 'نيوتن متر' },
    'Kilogram-meter': { en: 'Kilogram-meter', ar: 'كيلوغرام متر' },
    'Inch-pound': { en: 'Inch-pound', ar: 'بوصة باوند' },
    'kg/m³': { en: 'kg/m³', ar: 'كغ/م³' },
    'g/cm³': { en: 'g/cm³', ar: 'غ/سم³' },
    'lb/ft³': { en: 'lb/ft³', ar: 'رطل/قدم³' },
    'Liter/second': { en: 'Liter/second', ar: 'لتر/ثانية' },
    'Liter/minute': { en: 'Liter/minute', ar: 'لتر/دقيقة' },
    'Gallon/minute': { en: 'Gallon/minute', ar: 'جالون/دقيقة' },
    'Cubic ft/minute': { en: 'Cubic ft/minute', ar: 'قدم³/دقيقة' },
    'm³/s': { en: 'm³/s', ar: 'م³/ث' },
    'Pascal-second': { en: 'Pascal-second', ar: 'باسكال ثانية' },
    'Centipoise': { en: 'Centipoise', ar: 'سنتي بواز' },
    'Newton/meter': { en: 'Newton/meter', ar: 'نيوتن/متر' },
    'Newton/metre': { en: 'Newton/metre', ar: 'نيوتن/متر' },
    'Dyne/centimeter': { en: 'Dyne/centimeter', ar: 'داين/سنتيمتر' },
  };

  // Helper: Get translated text - uses language dropdown
  // Translates ALL labels: UI labels, category names, quantity names, and unit names
  // NOTE: Symbols (m, ft, kg) and prefixes (k, M, G) are NEVER translated - they always remain in Latin/ISO SI
  const t = (key: string): string => {
    // Check if we have a translation for the selected language
    if (TRANSLATIONS[key]) {
      const trans = TRANSLATIONS[key];
      // Check for translation in selected language
      if (language === 'de' && trans.de) return trans.de;
      if (language === 'es' && trans.es) return trans.es;
      if (language === 'fr' && trans.fr) return trans.fr;
      if (language === 'it' && trans.it) return trans.it;
      if (language === 'pt' && trans.pt) return trans.pt;
      if (language === 'ru' && trans.ru) return trans.ru;
      if (language === 'zh' && trans.zh) return trans.zh;
      if (language === 'ja' && trans.ja) return trans.ja;
      if (language === 'ar' && trans.ar) return trans.ar;
      // Falls back to English if no translation exists for the selected language
      return trans.en || key;
    }
    return key;
  };

  // Helper: Translate unit names while keeping symbols in Latin
  // Unit NAMES are translated (e.g., "Meter" → "Metro" in Spanish), but unit SYMBOLS remain Latin (e.g., "m" stays "m")
  const translateUnitName = (unitName: string): string => {
    // First try to get translation using t() function
    const translated = t(unitName);
    // If translation found (different from key), use it
    if (translated !== unitName) {
      return translated;
    }
    // Otherwise, apply regional spelling variations (meter vs metre) for English variations
    return applyRegionalSpelling(unitName);
  };

  // Auto-set language to Arabic when Arabic number formats are selected
  React.useEffect(() => {
    if (numberFormat === 'arabic' || numberFormat === 'arabic-latin') {
      setLanguage('ar');
    }
  }, [numberFormat]);

  const CATEGORY_GROUPS = [
    {
      name: "Base Quantities",
      categories: ['length', 'mass', 'time', 'current', 'temperature', 'amount', 'intensity']
    },
    {
      name: "Mechanics",
      categories: ['area', 'volume', 'speed', 'acceleration', 'force', 'pressure', 'energy', 'power', 'torque', 'flow', 'density', 'viscosity', 'surface_tension']
    },
    {
      name: "Electricity & Magnetism",
      categories: ['charge', 'potential', 'capacitance', 'resistance', 'conductance', 'inductance', 'magnetic_flux', 'magnetic_density']
    },
    {
      name: "Radiation & Physics",
      categories: ['radioactivity', 'radiation_dose', 'equivalent_dose', 'catalytic', 'angle', 'solid_angle', 'frequency', 'sound_pressure']
    },
    {
      name: "Human Response",
      categories: ['luminous_flux', 'illuminance', 'luminous_exitance', 'luminance', 'refractive_power']
    },
    {
      name: "Specialized",
      categories: ['digital']
    }
  ];

  const categoryData = CONVERSION_DATA.find(c => c.id === activeCategory)!;
  
  // Helper to categorize units
  const getUnitCategory = (unit: any, category: string): 'si' | 'non-si' | 'astronomy' => {
    // Define SI units for each category
    const siUnits: Record<string, string[]> = {
      'length': ['m'],
      'mass': ['kg', 'g', 't'],
      'time': ['s'],
      'current': ['a'],
      'temperature': ['k', 'c'],
      'amount': ['mol'],
      'intensity': ['cd'],
      'area': ['m2', 'ha'],
      'volume': ['l'],
      'speed': ['mps', 'kmh'],
      'acceleration': ['mps2'],
      'force': ['n'],
      'pressure': ['pa', 'bar'],
      'energy': ['j', 'kwh', 'wh'],
      'power': ['w'],
      'frequency': ['hz'],
      'torque': ['nm'],
      'viscosity': ['pas'],
      'surface_tension': ['nm'],
      'radiation_dose': ['gy'],
      'equivalent_dose': ['sv'],
      'catalytic': ['kat'],
      'angle': ['rad'],
      'solid_angle': ['sr'],
      'sound_pressure': ['pa'],
      'refractive_power': ['m-1'],
      'digital': ['B'],
      'printing': ['pt'],
      'luminous_flux': ['lm'],
      'illuminance': ['lx'],
      'luminous_exitance': ['lmm2'],
      'luminance': ['nit'],
    };
    
    // Define astronomy units (for length category)
    const astronomyUnits: string[] = ['au', 'ly', 'parsec'];
    
    if (siUnits[category]?.includes(unit.id)) {
      return 'si';
    } else if (category === 'length' && astronomyUnits.includes(unit.id)) {
      return 'astronomy';
    } else {
      return 'non-si';
    }
  };
  
  // Helper to get filtered and sorted units
  const getFilteredSortedUnits = (category: string, includeBeer: boolean) => {
    const catData = CONVERSION_DATA.find(c => c.id === category);
    if (!catData) return [];
    
    // Filter based on beer/wine checkbox
    let units = category === 'volume' && !includeBeer 
      ? catData.units.filter(u => !u.beerWine)
      : catData.units;
      
    // Sort: SI units first, then non-SI, then astronomy units (for length)
    return [...units].sort((a, b) => {
      const aCat = getUnitCategory(a, category);
      const bCat = getUnitCategory(b, category);
      
      // Order: si < non-si < astronomy
      const order = { 'si': 0, 'non-si': 1, 'astronomy': 2 };
      if (order[aCat] !== order[bCat]) {
        return order[aCat] - order[bCat];
      }
      
      // Within same category, prioritize base SI unit first
      const aIsBase = catData.baseSISymbol && a.symbol === catData.baseSISymbol;
      const bIsBase = catData.baseSISymbol && b.symbol === catData.baseSISymbol;
      if (aIsBase && !bIsBase) return -1;
      if (!aIsBase && bIsBase) return 1;
      
      // Then sort by size (factor)
      return a.factor - b.factor;
    });
  };
  
  const filteredUnits = getFilteredSortedUnits(activeCategory, includeBeerWine);

  // Reset units when category changes
  useEffect(() => {
    const sorted = getFilteredSortedUnits(activeCategory, includeBeerWine);
    if (sorted.length > 0) {
      // Default to first unit in sorted list (SI units are sorted first)
      setFromUnit(sorted[0].id);
      setToUnit(sorted[0].id);
      setFromPrefix('none');
      setToPrefix('none');
    }
  }, [activeCategory, includeBeerWine]);

  // Focus input field on mount and keep it focused
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Refocus input after interactions
  const refocusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const fromUnitData = categoryData.units.find(u => u.id === fromUnit);
  const toUnitData = categoryData.units.find(u => u.id === toUnit);
  const fromPrefixData = PREFIXES.find(p => p.id === fromPrefix) || PREFIXES.find(p => p.id === 'none') || PREFIXES[0];
  const toPrefixData = PREFIXES.find(p => p.id === toPrefix) || PREFIXES.find(p => p.id === 'none') || PREFIXES[0];

  // Helper: Map category to dimensional formula
  const getCategoryDimensions = (category: UnitCategory): DimensionalFormula => {
    const dimensionMap: Record<UnitCategory, DimensionalFormula> = {
      length: { length: 1 },
      mass: { mass: 1 },
      time: { time: 1 },
      current: { current: 1 },
      temperature: { temperature: 1 },
      amount: { amount: 1 },
      intensity: { intensity: 1 },
      area: { length: 2 },
      volume: { length: 3 },
      frequency: { time: -1 },
      speed: { length: 1, time: -1 },
      acceleration: { length: 1, time: -2 },
      force: { mass: 1, length: 1, time: -2 },
      pressure: { mass: 1, length: -1, time: -2 },
      energy: { mass: 1, length: 2, time: -2 },
      power: { mass: 1, length: 2, time: -3 },
      charge: { current: 1, time: 1 },
      potential: { mass: 1, length: 2, time: -3, current: -1 },
      capacitance: { mass: -1, length: -2, time: 4, current: 2 },
      resistance: { mass: 1, length: 2, time: -3, current: -2 },
      conductance: { mass: -1, length: -2, time: 3, current: 2 },
      inductance: { mass: 1, length: 2, time: -2, current: -2 },
      magnetic_flux: { mass: 1, length: 2, time: -2, current: -1 },
      magnetic_density: { mass: 1, time: -2, current: -1 },
      radioactivity: { time: -1 },
      radiation_dose: { length: 2, time: -2 },
      equivalent_dose: { length: 2, time: -2 },
      catalytic: { amount: 1, time: -1 },
      angle: {},
      solid_angle: {},
      digital: {},
      luminous_flux: { intensity: 1 },
      illuminance: { intensity: 1, length: -2 },
      luminous_exitance: { intensity: 1, length: -2 },
      luminance: { intensity: 1, length: -2 },
      torque: { mass: 1, length: 2, time: -2 },
      density: { mass: 1, length: -3 },
      flow: { length: 3, time: -1 },
      viscosity: { mass: 1, length: -1, time: -1 },
      surface_tension: { mass: 1, time: -2 },
      refractive_power: { length: -1 },
      sound_pressure: { mass: 1, length: -1, time: -2 }
    };
    return dimensionMap[category] || {};
  };

  // Helper: Convert from SI base unit to category base unit
  const siToCategoryBase = (value: number, category: UnitCategory): number => {
    const cat = CONVERSION_DATA.find(c => c.id === category);
    if (!cat) return value;
    
    // Find the SI base unit (unit with symbol matching baseSISymbol)
    const siBaseUnit = cat.units.find(u => u.symbol === cat.baseSISymbol);
    if (!siBaseUnit) return value;
    
    // Convert: value is in SI base, multiply by SI unit's factor to get category base
    return value * siBaseUnit.factor;
  };

  // Helper: Convert from category base unit to SI base unit
  const categoryToSIBase = (value: number, category: UnitCategory): number => {
    const cat = CONVERSION_DATA.find(c => c.id === category);
    if (!cat) return value;
    
    // Find the SI base unit (unit with symbol matching baseSISymbol)
    const siBaseUnit = cat.units.find(u => u.symbol === cat.baseSISymbol);
    if (!siBaseUnit) return value;
    
    // Convert: value is in category base, divide by SI unit's factor to get SI base
    return value / siBaseUnit.factor;
  };

  // Helper: Multiply dimensional formulas
  const multiplyDimensions = (d1: DimensionalFormula, d2: DimensionalFormula): DimensionalFormula => {
    const result: DimensionalFormula = { ...d1 };
    for (const [dim, exp] of Object.entries(d2)) {
      const key = dim as keyof DimensionalFormula;
      result[key] = (result[key] || 0) + exp;
      if (result[key] === 0) delete result[key];
    }
    return result;
  };

  // Helper: Divide dimensional formulas
  const divideDimensions = (d1: DimensionalFormula, d2: DimensionalFormula): DimensionalFormula => {
    const result: DimensionalFormula = { ...d1 };
    for (const [dim, exp] of Object.entries(d2)) {
      const key = dim as keyof DimensionalFormula;
      result[key] = (result[key] || 0) - exp;
      if (result[key] === 0) delete result[key];
    }
    return result;
  };

  // Helper: Format dimensional formula as unit string
  // Order: time, length, mass, electric current, thermodynamic temperature, amount of substance, luminous intensity
  const formatDimensions = (dims: DimensionalFormula): string => {
    const dimSymbols: Record<keyof DimensionalFormula, string> = {
      time: 's',
      length: 'm',
      mass: 'kg',
      current: 'A',
      temperature: 'K',
      amount: 'mol',
      intensity: 'cd'
    };

    // Define the standard order for base units
    // Order: length, mass, time, electric current, thermodynamic temperature, amount of substance, luminous intensity
    const dimensionOrder: (keyof DimensionalFormula)[] = [
      'length', 'mass', 'time', 'current', 'temperature', 'amount', 'intensity'
    ];

    const superscripts: Record<string, string> = {
      '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
      '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
      '-': '⁻'
    };

    const toSuperscript = (num: number): string => {
      return num.toString().split('').map(c => superscripts[c] || c).join('');
    };

    const parts: string[] = [];

    // Iterate in the specified order
    for (const dim of dimensionOrder) {
      const exp = dims[dim];
      if (exp === undefined || exp === 0) continue;
      
      const symbol = dimSymbols[dim];

      if (exp === 1) {
        parts.push(symbol);
      } else {
        parts.push(symbol + toSuperscript(exp));
      }
    }

    return parts.join('⋅');
  };

  // Alias for backward compatibility with factorization code
  const dimensionsToSymbol = formatDimensions;

  // Helper: Get derived unit symbol from dimensions
  const getDerivedUnit = (dims: DimensionalFormula): string => {
    const dimsStr = JSON.stringify(dims);
    
    const derivedUnits: Record<string, string> = {
      // Base units
      [JSON.stringify({ length: 1 })]: 'm',
      [JSON.stringify({ mass: 1 })]: 'kg',
      [JSON.stringify({ time: 1 })]: 's',
      [JSON.stringify({ current: 1 })]: 'A',
      [JSON.stringify({ temperature: 1 })]: 'K',
      [JSON.stringify({ amount: 1 })]: 'mol',
      [JSON.stringify({ intensity: 1 })]: 'cd',
      // Derived units
      [JSON.stringify({ length: 2 })]: 'm²',
      [JSON.stringify({ length: 3 })]: 'm³',
      [JSON.stringify({ time: -1 })]: 'Hz',
      [JSON.stringify({ length: 1, time: -1 })]: 'm/s',
      [JSON.stringify({ length: 1, time: -2 })]: 'm/s²',
      [JSON.stringify({ mass: 1, length: 1, time: -2 })]: 'N',
      [JSON.stringify({ mass: 1, length: -1, time: -2 })]: 'Pa',
      [JSON.stringify({ mass: 1, length: 2, time: -2 })]: 'J',
      [JSON.stringify({ mass: 1, length: 2, time: -3 })]: 'W',
      [JSON.stringify({ current: 1, time: 1 })]: 'C',
      [JSON.stringify({ mass: 1, length: 2, time: -3, current: -1 })]: 'V',
      [JSON.stringify({ mass: -1, length: -2, time: 4, current: 2 })]: 'F',
      [JSON.stringify({ mass: 1, length: 2, time: -3, current: -2 })]: 'Ω',
      [JSON.stringify({ mass: -1, length: -2, time: 3, current: 2 })]: 'S',
      [JSON.stringify({ mass: 1, length: 2, time: -2, current: -2 })]: 'H',
      [JSON.stringify({ mass: 1, length: 2, time: -2, current: -1 })]: 'Wb',
      [JSON.stringify({ mass: 1, time: -2, current: -1 })]: 'T',
      [JSON.stringify({ intensity: 1, length: -2 })]: 'lx',
      [JSON.stringify({ mass: 1, length: -3 })]: 'kg/m³',
      [JSON.stringify({ length: 3, time: -1 })]: 'm³/s',
      [JSON.stringify({ mass: 1, length: -1, time: -1 })]: 'Pa⋅s',
      [JSON.stringify({ mass: 1, time: -2 })]: 'N/m',
      [JSON.stringify({ length: -1 })]: 'm⁻¹',
      [JSON.stringify({ amount: 1, time: -1 })]: 'kat'
    };

    return derivedUnits[dimsStr] || '';
  };

  // Helper to parse number from string with a specific format
  const parseNumberWithSpecificFormat = (str: string, formatKey: NumberFormat): number => {
    const format = NUMBER_FORMATS[formatKey];
    // Convert Arabic numerals to Latin if present
    let cleaned = toLatinNumerals(str);
    // Remove thousands separator
    if (format.thousands) {
      cleaned = cleaned.split(format.thousands).join('');
    }
    // Replace decimal separator with period for parsing
    if (format.decimal !== '.') {
      cleaned = cleaned.replace(format.decimal, '.');
    }
    return parseFloat(cleaned);
  };

  // Helper to parse number from string with current format
  const parseNumberWithFormat = (str: string): number => {
    return parseNumberWithSpecificFormat(str, numberFormat);
  };

  // Helper to format number with a specific format (for reformatting when locale changes)
  const formatNumberWithSpecificFormat = (num: number, formatKey: NumberFormat): string => {
    const format = NUMBER_FORMATS[formatKey];
    
    // Handle special cases
    if (isNaN(num) || !isFinite(num)) return '';
    
    // Get the string representation
    const numStr = num.toString();
    const [integer, decimal] = numStr.split('.');
    
    // Add thousands separator if format has one
    let formattedInteger = integer;
    if (format.thousands) {
      if (formatKey === 'south-asian') {
        // Indian numbering system: 3-2-2 grouping (e.g., 12,34,56,789)
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
        // Myriad grouping: 4-4-4 grouping (e.g., 1,2345,6789)
        formattedInteger = integer.replace(/\B(?=(\d{4})+(?!\d))/g, format.thousands);
      } else {
        // Standard 3-3-3 grouping
        formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, format.thousands);
      }
    }
    
    // Combine with decimal part
    let result = decimal ? `${formattedInteger}${format.decimal}${decimal}` : formattedInteger;
    
    // Convert to Arabic numerals if needed
    if (format.useArabicNumerals) {
      result = toArabicNumerals(result);
    }
    
    return result;
  };

  // Reformat input value when number format changes
  const reformatInputValue = (oldFormat: NumberFormat, newFormat: NumberFormat): void => {
    if (!inputValue || inputValue === '') return;
    
    // Skip reformatting for special formats (DMS, ft'in")
    if (fromUnit === 'deg_dms' || fromUnit === 'ft_in') return;
    
    // Parse with old format
    const numericValue = parseNumberWithSpecificFormat(inputValue, oldFormat);
    
    if (!isNaN(numericValue) && isFinite(numericValue)) {
      // Format with new format
      const reformatted = formatNumberWithSpecificFormat(numericValue, newFormat);
      setInputValue(reformatted);
    }
  };

  const formatDMS = (decimal: number): string => {
    const d = Math.floor(Math.abs(decimal));
    const mFloat = (Math.abs(decimal) - d) * 60;
    const m = Math.floor(mFloat);
    const s = (mFloat - m) * 60;
    const sign = decimal < 0 ? "-" : "";
    
    const sFixed = toFixedBanker(s, precision);
    const [sInt, sDec] = sFixed.split('.');
    const sDisplay = `${sInt.padStart(2, '0')}${sDec ? '.' + sDec : ''}`;

    return `${sign}${d}:${m.toString().padStart(2, '0')}:${sDisplay}`;
  };

  const parseDMS = (dms: string): number => {
    if (!dms.includes(':')) return parseNumberWithFormat(dms);
    const parts = dms.split(':').map(p => parseNumberWithFormat(p));
    let val = 0;
    if (parts.length > 0) val += parts[0];
    if (parts.length > 1) val += (parts[0] >= 0 ? parts[1] : -parts[1]) / 60;
    if (parts.length > 2) val += (parts[0] >= 0 ? parts[2] : -parts[2]) / 3600;
    return val;
  };

  const formatFtIn = (decimalFeet: number): string => {
    const sign = decimalFeet < 0 ? "-" : "";
    const absVal = Math.abs(decimalFeet);
    const ft = Math.floor(absVal);
    const inches = (absVal - ft) * 12;

    const inFixed = toFixedBanker(inches, precision);

    return `${sign}${ft}'${inFixed}"`;
  };

  const parseFtIn = (ftIn: string): number => {
    // Remove quotes and replace with colon for parsing
    const cleaned = ftIn.replace(/['"]/g, ':');
    if (!cleaned.includes(':')) return parseNumberWithFormat(cleaned);
    const parts = cleaned.split(':').map(p => parseNumberWithFormat(p));
    let val = 0;
    if (parts.length > 0) val += parts[0];
    if (parts.length > 1) val += (parts[0] >= 0 ? parts[1] : -parts[1]) / 12;
    return val;
  };

  // Calculate result
  useEffect(() => {
    if (!inputValue || !fromUnit || !toUnit) {
      setResult(null);
      return;
    }

    let val: number;
    if (fromUnit === 'deg_dms') {
      val = parseDMS(inputValue);
      if (isNaN(val)) { setResult(null); return; }
    } else if (fromUnit === 'ft_in') {
      val = parseFtIn(inputValue);
      if (isNaN(val)) { setResult(null); return; }
    } else {
      val = parseNumberWithFormat(inputValue);
      if (isNaN(val)) { setResult(null); return; }
    }
    
    // Determine prefix factors (1 if not supported or none selected)
    // For special units (DMS/FtIn), we ignore prefixes
    const isSpecialFrom = fromUnit === 'deg_dms' || fromUnit === 'ft_in';
    const isSpecialTo = toUnit === 'deg_dms' || toUnit === 'ft_in';

    const fromFactor = (fromUnitData?.allowPrefixes && fromPrefixData && !isSpecialFrom) ? fromPrefixData.factor : 1;
    const toFactor = (toUnitData?.allowPrefixes && toPrefixData && !isSpecialTo) ? toPrefixData.factor : 1;

    const res = convert(val, fromUnit, toUnit, activeCategory, fromFactor, toFactor);
    setResult(res);
  }, [inputValue, fromUnit, toUnit, activeCategory, fromPrefix, toPrefix, fromUnitData, toUnitData]);

  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempPrefix = fromPrefix;
    setFromUnit(toUnit);
    setFromPrefix(toPrefix);
    setToUnit(tempUnit);
    setToPrefix(tempPrefix);
  };

  const copyResult = () => {
    if (result !== null && toUnitData) {
      let formattedResult = result.toString();
      if (toUnit === 'deg_dms') formattedResult = formatDMS(result);
      if (toUnit === 'ft_in') formattedResult = formatFtIn(result);

      const unitSymbol = toUnitData?.symbol || '';
      const prefixSymbol = (toUnitData?.allowPrefixes && toPrefixData?.id !== 'none') ? toPrefixData.symbol : '';
      
      // Include unit symbol with prefix in the copied text
      const textToCopy = `${formattedResult} ${prefixSymbol}${unitSymbol}`;
      navigator.clipboard.writeText(textToCopy);
      
      // Trigger flash animation
      setFlashCopyResult(true);
      setTimeout(() => setFlashCopyResult(false), 300);
      
      // Add to calculator (first three fields only) - convert to SI base units
      const firstEmptyIndex = calcValues.findIndex((v, i) => i < 3 && v === null);
      if (firstEmptyIndex !== -1) {
        // Convert result to SI base units (which equals category base for most categories)
        const siBaseValue = result * toUnitData.factor * toPrefixData.factor;
        
        // Auto-select best prefix for display (but not for mass - always use kg without prefix)
        const bestPrefix = activeCategory === 'mass' ? 'none' : findBestPrefix(siBaseValue);
        
        const newCalcValues = [...calcValues];
        newCalcValues[firstEmptyIndex] = {
          value: siBaseValue,
          dimensions: getCategoryDimensions(activeCategory),
          prefix: bestPrefix
        };
        setCalcValues(newCalcValues);
      }
    }
  };

  // Helper: Compare two dimensional formulas
  const dimensionsEqual = (d1: DimensionalFormula, d2: DimensionalFormula): boolean => {
    const keys1 = Object.keys(d1) as (keyof DimensionalFormula)[];
    const keys2 = Object.keys(d2) as (keyof DimensionalFormula)[];
    
    if (keys1.length !== keys2.length) return false;
    
    for (const key of keys1) {
      if (d1[key] !== d2[key]) return false;
    }
    
    return true;
  };

  // Helper: Find category that matches dimensions
  const findCategoryForDimensions = (dims: DimensionalFormula): UnitCategory | null => {
    for (const cat of CONVERSION_DATA) {
      const catDims = getCategoryDimensions(cat.id);
      if (dimensionsEqual(catDims, dims)) {
        return cat.id;
      }
    }
    return null;
  };

  // Helper: Find best unit for a value (prefer SI units with shortest integer representation)
  const findBestUnit = (value: number, category: UnitCategory): string | null => {
    const cat = CONVERSION_DATA.find(c => c.id === category);
    if (!cat) return null;

    // Define SI units for each category
    const siUnits: Record<string, string[]> = {
      'area': ['m2', 'ha'],
      'volume': ['ml', 'l', 'm3'],
      'length': ['m'],
      'mass': ['kg', 'g'],
      'time': ['s'],
      // Add other categories as needed - most use allowPrefixes for SI units
    };

    let bestUnit: string | null = null;
    let bestScore = Infinity;

    for (const unit of cat.units) {
      const convertedValue = Math.abs(value / unit.factor);
      
      // Check if this is an SI unit
      const isSI = siUnits[category]?.includes(unit.id) || unit.allowPrefixes;
      
      // Only consider SI units
      if (!isSI) continue;
      
      // Calculate the length of the integer part
      const integerPart = Math.floor(convertedValue);
      
      // Prefer values >= 1 (integers), then prefer fewest digits
      let score: number;
      if (convertedValue >= 1) {
        // For values >= 1, score is the number of digits
        const numDigits = integerPart === 0 ? 1 : Math.floor(Math.log10(integerPart)) + 1;
        score = numDigits;
      } else {
        // For values < 1, add a large penalty to avoid fractional results
        score = 1000 + (1 - convertedValue); // Heavily penalize < 1
      }
      
      if (score < bestScore) {
        bestScore = score;
        bestUnit = unit.id;
      }
    }

    return bestUnit;
  };

  // Helper: Find best SI prefix for a value (prefix that produces smallest integer)
  const findBestPrefix = (value: number): string => {
    if (value === 0) return 'none';
    
    const absValue = Math.abs(value);
    let bestPrefix = 'none';
    let bestScore = Infinity;

    for (const prefix of PREFIXES) {
      const convertedValue = absValue / prefix.factor;
      
      // Calculate score based on integer part length
      let score: number;
      if (convertedValue >= 1) {
        const integerPart = Math.floor(convertedValue);
        const numDigits = integerPart === 0 ? 1 : Math.floor(Math.log10(integerPart)) + 1;
        score = numDigits;
      } else {
        // Penalize fractional results heavily
        score = 1000 + (1 - convertedValue);
      }
      
      if (score < bestScore) {
        bestScore = score;
        bestPrefix = prefix.id;
      }
    }

    return bestPrefix;
  };

  // Helper: Subtract dimensions (for factorization)
  const subtractDimensions = (d1: DimensionalFormula, d2: DimensionalFormula): DimensionalFormula => {
    const result: DimensionalFormula = { ...d1 };
    
    for (const key of Object.keys(d2) as (keyof DimensionalFormula)[]) {
      if (result[key] === undefined) {
        result[key] = -(d2[key] || 0);
      } else {
        const newVal = (result[key] || 0) - (d2[key] || 0);
        if (newVal === 0) {
          delete result[key];
        } else {
          result[key] = newVal;
        }
      }
    }
    
    return result;
  };

  // Helper: Check if derived unit can be factored out of dimensions
  const canFactorOut = (dimensions: DimensionalFormula, derivedUnit: DerivedUnitInfo): boolean => {
    for (const key of Object.keys(derivedUnit.dimensions) as (keyof DimensionalFormula)[]) {
      const dimValue = dimensions[key] || 0;
      const derivedValue = derivedUnit.dimensions[key] || 0;
      
      // Check if the derived unit dimension has the same sign and magnitude <= target dimension
      if (derivedValue > 0 && dimValue < derivedValue) return false;
      if (derivedValue < 0 && dimValue > derivedValue) return false;
      if (derivedValue !== 0 && dimValue === 0) return false;
    }
    return true;
  };

  // Helper: Check if remaining dimensions introduce new dimensional types
  const hasOnlyOriginalDimensions = (original: DimensionalFormula, remaining: DimensionalFormula): boolean => {
    for (const key of Object.keys(remaining) as (keyof DimensionalFormula)[]) {
      // If the remaining has a dimension that the original doesn't have, reject
      if (remaining[key] !== 0 && original[key] === undefined) {
        return false;
      }
    }
    return true;
  };

  // Helper: Generate alternative representations for complex dimensions
  const generateAlternativeRepresentations = (dimensions: DimensionalFormula): AlternativeRepresentation[] => {
    const alternatives: AlternativeRepresentation[] = [];
    
    // First, add the raw SI base units representation
    const rawSymbol = dimensionsToSymbol(dimensions);
    alternatives.push({
      displaySymbol: rawSymbol,
      category: null,
      unitId: null,
      isHybrid: false,
      components: {}
    });
    
    // Check if dimensions exactly match any single derived unit
    const exactMatch = DERIVED_UNITS_CATALOG.find(du => dimensionsEqual(du.dimensions, dimensions));
    if (exactMatch) {
      alternatives.push({
        displaySymbol: exactMatch.symbol,
        category: exactMatch.category,
        unitId: exactMatch.unitId,
        isHybrid: false,
        components: { derivedUnit: exactMatch }
      });
      return alternatives; // If exact match, return only base and derived
    }
    
    // Try to factor out each derived unit and generate hybrid representations
    for (const derivedUnit of DERIVED_UNITS_CATALOG) {
      if (canFactorOut(dimensions, derivedUnit)) {
        const remaining = subtractDimensions(dimensions, derivedUnit.dimensions);
        
        // Verify remaining dimensions don't introduce new dimensional types
        if (!hasOnlyOriginalDimensions(dimensions, remaining)) {
          continue; // Skip this factorization
        }
        
        // Only create hybrid if there's something remaining
        if (Object.keys(remaining).length > 0) {
          const remainingSymbol = dimensionsToSymbol(remaining);
          const hybridSymbol = `${remainingSymbol}⋅${derivedUnit.symbol}`;
          
          alternatives.push({
            displaySymbol: hybridSymbol,
            category: null,
            unitId: null,
            isHybrid: true,
            components: {
              derivedUnit,
              remainingDimensions: remaining
            }
          });
        }
      }
    }
    
    return alternatives;
  };

  // Auto-select multiplication operator when values are entered
  useEffect(() => {
    if (calcValues[0] && calcValues[1] && !calcOp1) {
      setCalcOp1('*');
    }
  }, [calcValues[0], calcValues[1], calcOp1]);

  useEffect(() => {
    if (calcValues[1] && calcValues[2] && !calcOp2) {
      setCalcOp2('*');
    }
  }, [calcValues[1], calcValues[2], calcOp2]);

  // Calculate result field
  useEffect(() => {
    if (calcValues[0]) {
      let resultValue = calcValues[0].value;
      let resultDimensions = { ...calcValues[0].dimensions };
      
      // If we have field 2 and an operator, calculate
      if (calcValues[1] && calcOp1) {
        if (calcOp1 === '*') {
          resultValue = resultValue * calcValues[1].value;
          resultDimensions = multiplyDimensions(resultDimensions, calcValues[1].dimensions);
        } else {
          resultValue = resultValue / calcValues[1].value;
          resultDimensions = divideDimensions(resultDimensions, calcValues[1].dimensions);
        }
        
        // If we have field 3 and operator, continue calculation
        if (calcValues[2] && calcOp2) {
          if (calcOp2 === '*') {
            resultValue = resultValue * calcValues[2].value;
            resultDimensions = multiplyDimensions(resultDimensions, calcValues[2].dimensions);
          } else {
            resultValue = resultValue / calcValues[2].value;
            resultDimensions = divideDimensions(resultDimensions, calcValues[2].dimensions);
          }
        }
      }
      
      // Check if result is dimensionless (unitless)
      const isDimensionless = Object.keys(resultDimensions).length === 0;
      
      // Auto-select best prefix for result field (only if not dimensionless)
      const resultBestPrefix = isDimensionless ? 'none' : findBestPrefix(resultValue);
      
      setCalcValues(prev => {
        const newValues = [...prev];
        newValues[3] = {
          value: resultValue,
          dimensions: resultDimensions,
          prefix: resultBestPrefix
        };
        return newValues;
      });

      // Find matching category and auto-select default unit with best prefix
      if (isDimensionless) {
        // For dimensionless results, clear unit selection
        setResultCategory(null);
        setResultUnit(null);
        setResultPrefix('none');
        setSelectedAlternative(0);
      } else {
        const matchingCategory = findCategoryForDimensions(resultDimensions);
        setResultCategory(matchingCategory);
        if (matchingCategory) {
          // Find the category data
          const cat = CONVERSION_DATA.find(c => c.id === matchingCategory);
          
          // Default to the first unit with allowPrefixes=true (the primary SI derived unit)
          // Otherwise use base SI unit (null)
          const primaryUnit = cat?.units.find(u => u.allowPrefixes);
          if (primaryUnit) {
            setResultUnit(primaryUnit.id);
            // Find best prefix for the primary unit
            const unitValue = resultValue / primaryUnit.factor;
            const bestPrefix = findBestPrefix(unitValue);
            setResultPrefix(bestPrefix);
          } else {
            setResultUnit(null);
            const bestPrefix = findBestPrefix(resultValue);
            setResultPrefix(bestPrefix);
          }
          setSelectedAlternative(0); // Reset for category-matched results
        } else {
          // For complex dimensions with no matching category, generate alternatives
          const alternatives = generateAlternativeRepresentations(resultDimensions);
          // Default to derived unit representation (index 1) if exact match exists, else raw SI (index 0)
          setSelectedAlternative(alternatives.length > 1 && !alternatives[1].isHybrid ? 1 : 0);
        }
      }
    } else if (calcValues[3] !== null) {
      setCalcValues(prev => {
        const newValues = [...prev];
        newValues[3] = null;
        return newValues;
      });
      setResultUnit(null);
      setResultCategory(null);
    }
  }, [calcValues[0], calcValues[1], calcValues[2], calcOp1, calcOp2]);

  // Auto-select prefix when user manually changes result unit
  // If the result category matches the active category, use the TO prefix instead of best prefix
  useEffect(() => {
    if (resultCategory && calcValues[3]) {
      const cat = CONVERSION_DATA.find(c => c.id === resultCategory);
      
      // If resultUnit is null, we're using the base SI unit
      if (resultUnit === null) {
        // Base SI unit always allows prefixes
        // If result category matches the active category, use the TO prefix
        if (resultCategory === activeCategory) {
          setResultPrefix(toPrefix);
        } else {
          // Otherwise, use the best prefix based on the SI base value
          const bestPrefix = findBestPrefix(calcValues[3].value);
          setResultPrefix(bestPrefix);
        }
      } else if (resultUnit) {
        // User selected a specific unit
        const unit = cat?.units.find(u => u.id === resultUnit);
        if (unit?.allowPrefixes) {
          // If result category matches the active category, use the TO prefix
          if (resultCategory === activeCategory) {
            setResultPrefix(toPrefix);
          } else {
            // Otherwise, use the best prefix based on the value
            const bestPrefix = findBestPrefix(calcValues[3].value / unit.factor);
            setResultPrefix(bestPrefix);
          }
        } else {
          setResultPrefix('none');
        }
      }
    }
  }, [resultUnit, resultCategory, activeCategory, toPrefix, calcValues[3]]);

  const clearCalculator = () => {
    setCalcValues([null, null, null, null]);
    setCalcOp1(null);
    setCalcOp2(null);
    setResultUnit(null);
    setResultCategory(null);
    setResultPrefix('none');
  };

  const clearField1 = () => {
    setCalcValues(prev => {
      const newValues = [...prev];
      newValues[0] = null;
      return newValues;
    });
    setCalcOp1(null);
  };

  const clearField2 = () => {
    setCalcValues(prev => {
      const newValues = [...prev];
      newValues[1] = null;
      return newValues;
    });
    setCalcOp2(null);
  };

  const clearField3 = () => {
    setCalcValues(prev => {
      const newValues = [...prev];
      newValues[2] = null;
      return newValues;
    });
  };

  const copyCalcResult = () => {
    if (calcValues[3]) {
      let valueToCopy = calcValues[3].value;
      let unitSymbol = '';
      
      // If user has selected a specific unit, convert to that unit
      if (resultUnit && resultCategory) {
        const cat = CONVERSION_DATA.find(c => c.id === resultCategory);
        const unit = cat?.units.find(u => u.id === resultUnit);
        
        if (unit) {
          const prefixData = PREFIXES.find(p => p.id === resultPrefix) || PREFIXES.find(p => p.id === 'none')!;
          const prefixFactor = unit.allowPrefixes ? prefixData.factor : 1;
          valueToCopy = calcValues[3].value / (unit.factor * prefixFactor);
          const prefixSymbol = unit.allowPrefixes && resultPrefix !== 'none' ? prefixData.symbol : '';
          unitSymbol = `${prefixSymbol}${unit.symbol}`;
        }
      } else if (resultCategory) {
        // If result has a category but no specific unit, use SI base unit
        const cat = CONVERSION_DATA.find(c => c.id === resultCategory);
        const prefixData = PREFIXES.find(p => p.id === resultPrefix) || PREFIXES.find(p => p.id === 'none')!;
        valueToCopy = calcValues[3].value / prefixData.factor;
        const prefixSymbol = resultPrefix !== 'none' ? prefixData.symbol : '';
        unitSymbol = `${prefixSymbol}${cat?.baseSISymbol || ''}`;
      } else {
        // Use dimensional formula if no category
        const val = calcValues[3];
        const prefix = PREFIXES.find(p => p.id === val.prefix) || PREFIXES.find(p => p.id === 'none')!;
        valueToCopy = val.value / prefix.factor;
        unitSymbol = `${prefix.symbol}${formatDimensions(val.dimensions)}`;
      }
      
      // Copy with only decimal separator, no thousands separator
      const format = NUMBER_FORMATS[numberFormat];
      const valueStr = cleanNumber(valueToCopy, calculatorPrecision);
      // Replace period with format's decimal separator
      const formattedStr = format.decimal !== '.' ? valueStr.replace('.', format.decimal) : valueStr;
      const textToCopy = unitSymbol ? `${formattedStr} ${unitSymbol}` : formattedStr;
      navigator.clipboard.writeText(textToCopy);
      
      // Trigger flash animation
      setFlashCopyCalc(true);
      setTimeout(() => setFlashCopyCalc(false), 300);
    }
  };

  // Helper to clean up trailing zeros from decimal numbers
  const cleanNumber = (num: number, precision: number): string => {
    const fixed = toFixedBanker(num, precision);
    // Remove trailing zeros after decimal point
    const cleaned = fixed.replace(/(\.\d*?[1-9])0+$/, '$1').replace(/\.0+$/, '');
    return cleaned;
  };

  // Copy calculator field to clipboard and flash
  const copyCalcField = (fieldIndex: number) => {
    const val = calcValues[fieldIndex];
    if (!val) return;
    
    const prefix = PREFIXES.find(p => p.id === val.prefix) || PREFIXES.find(p => p.id === 'none')!;
    const displayValue = val.value / prefix.factor;
    const unitSymbol = `${prefix.symbol}${formatDimensions(val.dimensions)}`;
    
    // Copy with only decimal separator, no thousands separator
    const format = NUMBER_FORMATS[numberFormat];
    const valueStr = cleanNumber(displayValue, calculatorPrecision);
    const formattedStr = format.decimal !== '.' ? valueStr.replace('.', format.decimal) : valueStr;
    const textToCopy = unitSymbol ? `${formattedStr} ${unitSymbol}` : formattedStr;
    navigator.clipboard.writeText(textToCopy);
    
    // Trigger flash animation for the specific field
    if (fieldIndex === 0) {
      setFlashCalcField1(true);
      setTimeout(() => setFlashCalcField1(false), 300);
    } else if (fieldIndex === 1) {
      setFlashCalcField2(true);
      setTimeout(() => setFlashCalcField2(false), 300);
    } else if (fieldIndex === 2) {
      setFlashCalcField3(true);
      setTimeout(() => setFlashCalcField3(false), 300);
    }
  };

  // Helper to format number with separators based on selected format
  const formatNumberWithSeparators = (num: number, precision: number): string => {
    const format = NUMBER_FORMATS[numberFormat];
    const cleaned = cleanNumber(num, precision);
    const [integer, decimal] = cleaned.split('.');
    
    // Add thousands separator if format has one
    let formattedInteger = integer;
    if (format.thousands) {
      if (numberFormat === 'south-asian') {
        // Indian numbering system: 3-2-2 grouping (e.g., 12,34,56,789)
        // First separator after 3 digits from right, then every 2 digits
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
        // Myriad grouping: 4-4-4 grouping (e.g., 1,2345,6789)
        formattedInteger = integer.replace(/\B(?=(\d{4})+(?!\d))/g, format.thousands);
      } else {
        // Standard 3-3-3 grouping for other formats
        formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, format.thousands);
      }
    }
    
    // Use format's decimal separator
    let result = decimal ? `${formattedInteger}${format.decimal}${decimal}` : formattedInteger;
    
    // Convert to Arabic numerals if format requires it
    if (format.useArabicNumerals) {
      result = toArabicNumerals(result);
    }
    
    return result;
  };

  const formatFactor = (f: number) => {
    if (f === 1) return "1";
    if (f >= 1e9 || f <= 1e-8) return `×${f.toExponential(7)}`;
    
    // Format with up to 9 total digits and 8 decimal places
    // Use toPrecision for total significant figures, then clean up
    const str = f.toPrecision(9);
    const num = parseFloat(str);
    
    // Format with up to 8 decimal places, removing trailing zeros
    const formatted = formatNumberWithSeparators(num, 8);
    return `×${formatted}`;
  };

  // Helper to determine input placeholder
  const getPlaceholder = () => {
    if (fromUnit === 'deg_dms') return "dd:mm:ss";
    if (fromUnit === 'ft_in') return "ft'in\"";
    return "0";
  };

  // Helper to validate and filter input
  const handleInputChange = (value: string) => {
    const format = NUMBER_FORMATS[numberFormat];
    const decimalSep = format.decimal === '.' ? '\\.' : format.decimal === "'" ? "\\'" : format.decimal;
    const thousandsSep = format.thousands ? (format.thousands === ' ' ? '\\s' : format.thousands === "'" ? "\\'" : format.thousands) : '';
    
    // For Arabic formats, allow both Latin and Arabic numerals
    const isArabicFormat = numberFormat === 'arabic' || numberFormat === 'arabic-latin';
    const digitPattern = isArabicFormat ? '0-9٠-٩' : '0-9';
    
    // For special formats (DMS/FtIn), allow: digits, colon, decimal separator, thousands separator, minus, quotes
    if (fromUnit === 'deg_dms' || fromUnit === 'ft_in') {
      const pattern = new RegExp(`[^${digitPattern}:\\-${decimalSep}${thousandsSep}'"']`, 'g');
      const filtered = value.replace(pattern, '');
      setInputValue(filtered);
      return;
    }
    
    // For regular numeric input, allow: digits, current decimal separator, current thousands separator, minus
    // Build regex pattern: digits, minus sign, decimal separator, thousands separator
    const pattern = new RegExp(`[^${digitPattern}\\-${decimalSep}${thousandsSep}]`, 'g');
    const filtered = value.replace(pattern, '');
    setInputValue(filtered);
  };

  // Helper to handle keyboard navigation for category switching
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault();
      
      // Get flat list of all categories in order
      const allCategories = CATEGORY_GROUPS.flatMap(group => group.categories);
      const currentIndex = allCategories.indexOf(activeCategory);
      
      if (currentIndex === -1) return;
      
      let newIndex: number;
      if (e.key === 'ArrowUp') {
        newIndex = currentIndex > 0 ? currentIndex - 1 : allCategories.length - 1;
      } else {
        newIndex = currentIndex < allCategories.length - 1 ? currentIndex + 1 : 0;
      }
      
      setActiveCategory(allCategories[newIndex] as UnitCategory);
    }
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 md:px-8 md:pb-8 md:pt-1 grid md:grid-cols-[260px_1fr] gap-8">
      
      {/* Sidebar */}
      <nav className="space-y-2 h-fit sticky top-0 overflow-y-auto max-h-[calc(100vh-2rem)] pr-2 -mt-1">
        {CATEGORY_GROUPS.map((group) => (
          <div key={group.name} className="space-y-1">
            <h2 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground/80 px-2 font-bold">{t(group.name)}</h2>
            <div className="space-y-0">
              {group.categories.map((catId) => {
                const cat = CONVERSION_DATA.find(c => c.id === catId);
                if (!cat) return null;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as UnitCategory)}
                    className={`w-full text-left px-3 py-[1px] rounded-sm text-xs font-medium transition-all duration-200 border-l-2 flex items-center justify-between group ${
                      activeCategory === cat.id 
                        ? 'bg-accent/10 border-accent text-accent-foreground' 
                        : 'hover:bg-muted/50 border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {t(cat.name)}
                    {activeCategory === cat.id && (
                      <motion.div layoutId="active-indicator" className="w-1 h-1 rounded-full bg-accent" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Main Converter */}
      <div className="space-y-4 -mt-1">
        <div className="mb-2">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">{t(applyRegionalSpelling(categoryData.name))}</h1>
          <div className="flex items-center justify-between mt-1">
            <p className="text-muted-foreground text-sm font-mono">
              {t('Base unit:')} <span className="text-primary">{t(applyRegionalSpelling(categoryData.baseUnit))}</span>
            </p>
            <div className="flex items-center gap-3">
              {activeCategory === 'volume' && (
                <label className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors">
                  <input
                    type="checkbox"
                    checked={includeBeerWine}
                    onChange={(e) => setIncludeBeerWine(e.target.checked)}
                    className="w-4 h-4 cursor-pointer accent-accent rounded border-border"
                  />
                  <span className="text-xs text-foreground">{t('Include Beer/Wine')}</span>
                </label>
              )}
              <Select 
                value={numberFormat} 
                onValueChange={(val) => { 
                  const newFormat = val as NumberFormat;
                  const oldFormat = numberFormat;
                  // If switching away from Arabic formats, set language to English
                  if ((oldFormat === 'arabic' || oldFormat === 'arabic-latin') && 
                      newFormat !== 'arabic' && newFormat !== 'arabic-latin') {
                    setLanguage('en');
                  }
                  // Reformat input value with new format
                  reformatInputValue(oldFormat, newFormat);
                  setNumberFormat(newFormat); 
                  refocusInput(); 
                }}
                onOpenChange={(open) => { if (!open) refocusInput(); }}
              >
                <SelectTrigger tabIndex={6} className="h-6 w-[180px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us" className="text-xs">US</SelectItem>
                  <SelectItem value="uk" className="text-xs">UK & offshoots</SelectItem>
                  <SelectItem value="europe-latin" className="text-xs">World</SelectItem>
                  <SelectItem value="period" className="text-xs">Period</SelectItem>
                  <SelectItem value="comma" className="text-xs">Comma</SelectItem>
                  <SelectItem value="arabic" className="text-xs">العربية</SelectItem>
                  <SelectItem value="arabic-latin" className="text-xs">العربية (Latin)</SelectItem>
                  <SelectItem value="east-asian" className="text-xs">East Asian</SelectItem>
                  <SelectItem value="south-asian" className="text-xs">South Asian (Indian)</SelectItem>
                  <SelectItem value="swiss" className="text-xs">Swiss</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={numberFormat === 'arabic' || numberFormat === 'arabic-latin' ? '' : language} 
                onValueChange={(val) => { setLanguage(val); refocusInput(); }}
                onOpenChange={(open) => { if (!open) refocusInput(); }}
                disabled={numberFormat === 'arabic' || numberFormat === 'arabic-latin'}
              >
                <SelectTrigger tabIndex={7} className="h-6 w-[60px] text-xs">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {ISO_LANGUAGES.map((lang) => (
                    <SelectItem key={lang} value={lang} className="text-xs">{lang}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card className="p-6 md:p-8 bg-card border-border/50 shadow-xl relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="grid gap-8 relative z-10">
            
            {/* Input Section */}
            <div className="grid gap-4">
              <Label className="text-xs font-mono uppercase text-muted-foreground">{t('From')}</Label>
              <div className="grid sm:grid-cols-[1fr_80px_220px] gap-2">
                <Input 
                  ref={inputRef}
                  type="text" 
                  inputMode="decimal"
                  value={inputValue}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleInputKeyDown}
                  tabIndex={1}
                  className="font-mono h-16 px-4 bg-background/50 border-border focus:border-accent focus:ring-accent/20 transition-all text-left w-full"
                  style={{ fontSize: '0.875rem', minWidth: '220px' }}
                  placeholder={getPlaceholder()}
                  data-testid="input-value"
                />
                
                {/* Prefix Dropdown */}
                <Select 
                  value={fromPrefix} 
                  onValueChange={(val) => { 
                    const normalized = normalizeMassUnit(fromUnit, val);
                    setFromUnit(normalized.unit);
                    setFromPrefix(normalized.prefix);
                    refocusInput(); 
                  }}
                  onOpenChange={(open) => { if (!open) refocusInput(); }}
                  disabled={!fromUnitData?.allowPrefixes}
                >
                  <SelectTrigger tabIndex={2} className="h-16 w-[50px] bg-background/30 border-border font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                    <SelectValue placeholder={t('Prefix')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {PREFIXES.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="font-mono text-sm">
                        {p.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select 
                  value={fromUnit} 
                  onValueChange={(val) => { setFromUnit(val); setFromPrefix('none'); refocusInput(); }}
                  onOpenChange={(open) => { if (!open) refocusInput(); }}
                >
                  <SelectTrigger tabIndex={3} className="h-16 w-[220px] bg-background/30 border-border font-medium shrink-0">
                    <SelectValue placeholder={t('Unit')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {filteredUnits.map((u) => (
                      <SelectItem key={u.id} value={u.id} className="font-mono text-sm">
                        {u.symbol === u.name ? (
                          <span className="font-bold">{u.symbol}</span>
                        ) : (
                          <>
                            <span className="font-bold mr-2">{u.symbol}</span>
                            <span className="opacity-70">{translateUnitName(u.name)}</span>
                          </>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid sm:grid-cols-[1fr_220px] gap-2">
                <div className="p-2 rounded bg-muted/20 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-mono">{t('Base Factor')}</div>
                  <div className="font-mono text-sm text-foreground/80 truncate" title={fromUnitData ? (fromUnitData.factor * fromPrefixData.factor).toString() : ''}>
                    {fromUnitData ? formatFactor(fromUnitData.factor * fromPrefixData.factor) : '-'}
                  </div>
                </div>
                <div className="p-2 rounded bg-muted/20 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-mono">{t('SI Base Units')}</div>
                  <div className="font-mono text-sm text-foreground/80 truncate">
                    {categoryData.baseSISymbol || '-'}
                  </div>
                </div>
              </div>

              {fromUnitData?.description && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Info className="w-3 h-3" /> {fromUnitData.description}
                </p>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-center -my-2">
              <Button 
                variant="outline" 
                size="icon" 
                onClick={swapUnits}
                className="rounded-full w-10 h-10 border-border bg-background hover:border-accent hover:text-accent transition-colors"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </Button>
            </div>

            {/* Output Section */}
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-mono uppercase text-muted-foreground">{t('To')}</Label>
                <Select 
                  value={precision.toString()} 
                  onValueChange={(val) => { setPrecision(parseInt(val)); refocusInput(); }}
                  onOpenChange={(open) => { if (!open) refocusInput(); }}
                >
                  <SelectTrigger tabIndex={4} className="h-6 w-[100px] text-xs bg-transparent border-border/50">
                    <SelectValue placeholder="Digits" />
                  </SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3,4,5,6,7,8].map(n => (
                      <SelectItem key={n} value={n.toString()} className="text-xs">
                        {numberFormat === 'arabic' ? toArabicNumerals(n.toString()) : n} {t('Decimals')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid sm:grid-cols-[1fr_80px_220px] gap-2">
                <motion.div 
                  className={`h-16 px-4 bg-background/50 border border-border rounded-md flex items-center overflow-x-auto text-left justify-start w-full select-none ${result !== null ? 'cursor-pointer hover:bg-background/70 active:bg-background/90' : ''}`}
                  style={{ minWidth: '220px', pointerEvents: 'auto' }}
                  onClick={() => result !== null && copyResult()}
                  animate={{
                    opacity: flashCopyResult ? [1, 0.3, 1] : 1,
                    scale: flashCopyResult ? [1, 1.02, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="font-mono text-primary whitespace-nowrap" style={{ fontSize: '0.875rem' }}>
                    {result !== null 
                      ? (toUnit === 'deg_dms' 
                          ? formatDMS(result) 
                          : toUnit === 'ft_in'
                            ? formatFtIn(result)
                            : formatNumberWithSeparators(result, precision)) 
                      : '...'}
                  </span>
                </motion.div>

                {/* Prefix Dropdown */}
                <Select 
                  value={toPrefix} 
                  onValueChange={(val) => {
                    const normalized = normalizeMassUnit(toUnit, val);
                    setToUnit(normalized.unit);
                    setToPrefix(normalized.prefix);
                  }}
                  disabled={!toUnitData?.allowPrefixes}
                >
                  <SelectTrigger className="h-16 w-[50px] bg-background/30 border-border font-medium disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                    <SelectValue placeholder={t('Prefix')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {PREFIXES.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="font-mono text-sm">
                        {p.symbol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={toUnit} onValueChange={(val) => { setToUnit(val); setToPrefix('none'); }}>
                  <SelectTrigger className="h-16 w-[220px] bg-background/30 border-border font-medium shrink-0">
                    <SelectValue placeholder={t('Unit')} />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {filteredUnits.map((u) => (
                      <SelectItem key={u.id} value={u.id} className="font-mono text-sm">
                        {u.symbol === u.name ? (
                          <span className="font-bold">{u.symbol}</span>
                        ) : (
                          <>
                            <span className="font-bold mr-2">{u.symbol}</span>
                            <span className="opacity-70">{translateUnitName(u.name)}</span>
                          </>
                        )}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid sm:grid-cols-[1fr_220px] gap-2">
                <div className="p-2 rounded bg-muted/20 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-mono">{t('Base Factor')}</div>
                  <div className="font-mono text-sm text-foreground/80 truncate" title={toUnitData ? (toUnitData.factor * toPrefixData.factor).toString() : ''}>
                    {toUnitData ? formatFactor(toUnitData.factor * toPrefixData.factor) : '-'}
                  </div>
                </div>
                <div className="p-2 rounded bg-muted/20 border border-border/50">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1 font-mono">{t('SI Base Units')}</div>
                  <div className="font-mono text-sm text-foreground/80 truncate">
                    {categoryData.baseSISymbol || '-'}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-[1fr_auto] gap-2 items-start">
                <div className="space-y-2">
                  {toUnitData?.description && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Info className="w-3 h-3" /> {toUnitData.description}
                    </p>
                  )}
                  {result !== null && fromUnitData && toUnitData && (
                    <div className="p-2 rounded bg-muted/20 border border-border/50">
                      <div className="text-xs font-mono text-muted-foreground flex gap-2 items-center">
                        <span className="text-foreground font-bold">
                          1 {fromPrefixData.id !== 'none' ? fromPrefixData.symbol : ''}{fromUnitData.symbol}
                        </span>
                        <span>=</span>
                        <span className="text-foreground font-bold">
                          {formatNumberWithSeparators(convert(1, fromUnit, toUnit, activeCategory, fromPrefixData.factor, toPrefixData.factor), precision)} {toPrefixData.id !== 'none' ? toPrefixData.symbol : ''}{toUnitData.symbol}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => { copyResult(); refocusInput(); }}
                  onBlur={refocusInput}
                  tabIndex={5}
                  className="text-xs hover:text-accent gap-2"
                >
                  <Copy className="w-3 h-3" />
                  <motion.span
                    animate={{
                      opacity: flashCopyResult ? [1, 0.3, 1] : 1,
                      scale: flashCopyResult ? [1, 1.1, 1] : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {t('Copy')} {t('Result')}
                  </motion.span>
                </Button>
              </div>
            </div>

          </div>
        </Card>

        {/* Mini Calculator */}
        <Card className="p-6 bg-card border-border/50">
          <div className="flex gap-2 mb-4">
            <div className="flex-1 flex items-center justify-between">
              <Label className="text-xs font-mono uppercase text-muted-foreground">{t('Calculator')}</Label>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">{t('Decimals')}</Label>
                <Select 
                  value={calculatorPrecision.toString()} 
                  onValueChange={(val) => setCalculatorPrecision(parseInt(val))}
                >
                  <SelectTrigger className="h-7 w-[70px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(p => (
                      <SelectItem key={p} value={p.toString()} className="text-xs">
                        {numberFormat === 'arabic' ? toArabicNumerals(p.toString()) : p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-1 justify-end w-[220px]">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearCalculator}
                className="text-xs"
              >
                {t('Clear')} {t('Calculator')}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {/* Field 1 */}
            <div className="flex gap-2">
              <motion.div 
                className={`h-10 px-3 bg-muted/30 border border-border/50 rounded-md flex items-center justify-between flex-1 select-none ${calcValues[0] ? 'cursor-pointer hover:bg-muted/50 active:bg-muted/70' : ''}`}
                onClick={() => calcValues[0] && copyCalcField(0)}
                style={{ pointerEvents: 'auto' }}
                animate={{
                  opacity: flashCalcField1 ? [1, 0.3, 1] : 1,
                  scale: flashCalcField1 ? [1, 1.02, 1] : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm font-mono text-foreground truncate">
                  {calcValues[0] ? (() => {
                    const val = calcValues[0];
                    if (!val) return '';
                    const prefix = PREFIXES.find(p => p.id === val.prefix) || PREFIXES.find(p => p.id === 'none')!;
                    const displayValue = val.value / prefix.factor;
                    return formatNumberWithSeparators(displayValue, calculatorPrecision);
                  })() : ''}
                </span>
                <span className="text-xs font-mono text-muted-foreground ml-2 shrink-0">
                  {calcValues[0] ? (() => {
                    const val = calcValues[0];
                    if (!val) return '';
                    const prefix = PREFIXES.find(p => p.id === val.prefix) || PREFIXES.find(p => p.id === 'none')!;
                    return `${prefix.symbol}${formatDimensions(val.dimensions)}`;
                  })() : ''}
                </span>
              </motion.div>
              <div className="flex gap-1 justify-end w-[220px]">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearField1}
                  disabled={!calcValues[0]}
                  className="text-xs"
                >
                  {t('Clear')}
                </Button>
              </div>
            </div>

            {/* Field 2 */}
            <div className="flex gap-2">
              <motion.div 
                className={`h-10 px-3 bg-muted/30 border border-border/50 rounded-md flex items-center justify-between flex-1 select-none ${calcValues[1] ? 'cursor-pointer hover:bg-muted/50 active:bg-muted/70' : ''}`}
                onClick={() => calcValues[1] && copyCalcField(1)}
                style={{ pointerEvents: 'auto' }}
                animate={{
                  opacity: flashCalcField2 ? [1, 0.3, 1] : 1,
                  scale: flashCalcField2 ? [1, 1.02, 1] : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm font-mono text-foreground truncate">
                  {calcValues[1] ? (() => {
                    const val = calcValues[1];
                    if (!val) return '';
                    const prefix = PREFIXES.find(p => p.id === val.prefix) || PREFIXES.find(p => p.id === 'none')!;
                    const displayValue = val.value / prefix.factor;
                    return formatNumberWithSeparators(displayValue, calculatorPrecision);
                  })() : ''}
                </span>
                <span className="text-xs font-mono text-muted-foreground ml-2 shrink-0">
                  {calcValues[1] ? (() => {
                    const val = calcValues[1];
                    if (!val) return '';
                    const prefix = PREFIXES.find(p => p.id === val.prefix) || PREFIXES.find(p => p.id === 'none')!;
                    return `${prefix.symbol}${formatDimensions(val.dimensions)}`;
                  })() : ''}
                </span>
              </motion.div>
              <div className="flex gap-1 justify-between w-[220px]">
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCalcOp1('*')}
                    className={`text-sm ${calcOp1 === '*' ? 'text-accent font-bold' : ''}`}
                  >
                    ×
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCalcOp1('/')}
                    className={`text-sm ${calcOp1 === '/' ? 'text-accent font-bold' : ''}`}
                  >
                    /
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearField2}
                  disabled={!calcValues[1]}
                  className="text-xs"
                >
                  {t('Clear')}
                </Button>
              </div>
            </div>

            {/* Field 3 */}
            <div className="flex gap-2">
              <motion.div 
                className={`h-10 px-3 bg-muted/30 border border-border/50 rounded-md flex items-center justify-between flex-1 select-none ${calcValues[2] ? 'cursor-pointer hover:bg-muted/50 active:bg-muted/70' : ''}`}
                onClick={() => calcValues[2] && copyCalcField(2)}
                style={{ pointerEvents: 'auto' }}
                animate={{
                  opacity: flashCalcField3 ? [1, 0.3, 1] : 1,
                  scale: flashCalcField3 ? [1, 1.02, 1] : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm font-mono text-foreground truncate">
                  {calcValues[2] ? (() => {
                    const val = calcValues[2];
                    if (!val) return '';
                    const prefix = PREFIXES.find(p => p.id === val.prefix) || PREFIXES.find(p => p.id === 'none')!;
                    const displayValue = val.value / prefix.factor;
                    return formatNumberWithSeparators(displayValue, calculatorPrecision);
                  })() : ''}
                </span>
                <span className="text-xs font-mono text-muted-foreground ml-2 shrink-0">
                  {calcValues[2] ? (() => {
                    const val = calcValues[2];
                    if (!val) return '';
                    const prefix = PREFIXES.find(p => p.id === val.prefix) || PREFIXES.find(p => p.id === 'none')!;
                    return `${prefix.symbol}${formatDimensions(val.dimensions)}`;
                  })() : ''}
                </span>
              </motion.div>
              <div className="flex gap-1 justify-between w-[220px]">
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCalcOp2('*')}
                    className={`text-sm ${calcOp2 === '*' ? 'text-accent font-bold' : ''}`}
                  >
                    ×
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setCalcOp2('/')}
                    className={`text-sm ${calcOp2 === '/' ? 'text-accent font-bold' : ''}`}
                  >
                    /
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearField3}
                  disabled={!calcValues[2]}
                  className="text-xs"
                >
                  {t('Clear')}
                </Button>
              </div>
            </div>

            {/* Result Field 4 */}
            <div className="flex gap-2">
              <motion.div 
                className={`h-10 px-3 bg-muted/20 border border-accent/50 rounded-md flex items-center justify-between flex-1 select-none ${calcValues[3] ? 'cursor-pointer hover:bg-muted/40 active:bg-muted/60' : ''}`}
                style={{ pointerEvents: 'auto' }}
                onClick={() => calcValues[3] && copyCalcResult()}
                animate={{
                  opacity: flashCopyCalc ? [1, 0.3, 1] : 1,
                  scale: flashCopyCalc ? [1, 1.02, 1] : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-sm font-mono text-primary font-bold truncate">
                  {calcValues[3] && resultUnit && resultCategory ? (() => {
                    const cat = CONVERSION_DATA.find(c => c.id === resultCategory);
                    const unit = cat?.units.find(u => u.id === resultUnit);
                    if (unit) {
                      // Apply the result prefix if the unit allows prefixes
                      const prefixData = PREFIXES.find(p => p.id === resultPrefix) || PREFIXES.find(p => p.id === 'none')!;
                      const prefixFactor = unit.allowPrefixes ? prefixData.factor : 1;
                      let convertedValue = calcValues[3].value / (unit.factor * prefixFactor);
                      
                      return formatNumberWithSeparators(convertedValue, calculatorPrecision);
                    }
                    return formatNumberWithSeparators(calcValues[3].value, calculatorPrecision);
                  })() : calcValues[3] && resultCategory ? (() => {
                    const val = calcValues[3];
                    if (!val) return '';
                    
                    // Display using SI base unit with selected prefix
                    const prefixData = PREFIXES.find(p => p.id === resultPrefix) || PREFIXES.find(p => p.id === 'none')!;
                    const displayValue = val.value / prefixData.factor;
                    return formatNumberWithSeparators(displayValue, calculatorPrecision);
                  })() : calcValues[3] ? (() => {
                    const val = calcValues[3];
                    if (!val) return '';
                    const prefix = PREFIXES.find(p => p.id === val.prefix) || PREFIXES.find(p => p.id === 'none')!;
                    const displayValue = val.value / prefix.factor;
                    return formatNumberWithSeparators(displayValue, calculatorPrecision);
                  })() : ''}
                </span>
                <span className="text-xs font-mono text-muted-foreground ml-2 shrink-0">
                  {calcValues[3] && resultUnit && resultCategory ? (() => {
                    const val = calcValues[3];
                    if (!val) return '';
                    const cat = CONVERSION_DATA.find(c => c.id === resultCategory);
                    const unit = cat?.units.find(u => u.id === resultUnit);
                    if (!unit) return formatDimensions(val.dimensions);
                    
                    // Include prefix symbol if unit allows prefixes
                    const prefixData = PREFIXES.find(p => p.id === resultPrefix) || PREFIXES.find(p => p.id === 'none')!;
                    const prefixSymbol = unit.allowPrefixes && resultPrefix !== 'none' ? prefixData.symbol : '';
                    return `${prefixSymbol}${unit.symbol}`;
                  })() : calcValues[3] && resultCategory ? (() => {
                    const val = calcValues[3];
                    if (!val) return '';
                    const cat = CONVERSION_DATA.find(c => c.id === resultCategory);
                    if (!cat) return formatDimensions(val.dimensions);
                    
                    // Display SI base unit symbol with prefix
                    const prefixData = PREFIXES.find(p => p.id === resultPrefix) || PREFIXES.find(p => p.id === 'none')!;
                    const prefixSymbol = resultPrefix !== 'none' ? prefixData.symbol : '';
                    return `${prefixSymbol}${cat.baseSISymbol}`;
                  })() : calcValues[3] ? (() => {
                    const val = calcValues[3];
                    if (!val) return '';
                    // For complex dimensions, use selected alternative representation
                    const alternatives = generateAlternativeRepresentations(val.dimensions);
                    if (selectedAlternative < alternatives.length) {
                      return alternatives[selectedAlternative].displaySymbol;
                    }
                    // Fallback to raw dimensions
                    return formatDimensions(val.dimensions);
                  })() : ''}
                </span>
              </motion.div>
              <div className="flex gap-1 w-[220px]">
                {calcValues[3] && (
                  <React.Fragment>
                    {resultCategory ? (
                      <>
                        <Select 
                          value={resultPrefix} 
                          onValueChange={setResultPrefix}
                          disabled={(() => {
                            const cat = CONVERSION_DATA.find(c => c.id === resultCategory);
                            const unit = cat?.units.find(u => u.id === resultUnit);
                            // For base SI unit (resultUnit === null), check if the category's first SI unit allows prefixes
                            // For mass, kg is the base but doesn't allow prefixes (use g instead)
                            if (resultUnit === null) {
                              // Find the primary SI unit for this category (the one with factor=1 and allowPrefixes)
                              const primarySI = cat?.units.find(u => u.factor === 1 && u.allowPrefixes);
                              // If there's a primary SI unit with allowPrefixes, enable prefixes
                              // Otherwise, disable (e.g., mass base is kg which doesn't have allowPrefixes)
                              return primarySI ? false : true;
                            }
                            return !unit?.allowPrefixes;
                          })()}
                        >
                          <SelectTrigger className="h-9 w-[50px] text-xs disabled:opacity-50 disabled:cursor-not-allowed shrink-0">
                            <SelectValue placeholder={t('Prefix')} />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
                            {PREFIXES.map((p) => (
                              <SelectItem key={p.id} value={p.id} className="text-xs font-mono">
                                {p.symbol || ''}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Select value={resultUnit || 'base'} onValueChange={(val) => setResultUnit(val === 'base' ? null : val)}>
                          <SelectTrigger className="h-9 flex-1 text-xs">
                            <SelectValue placeholder={CONVERSION_DATA.find(c => c.id === resultCategory)?.baseSISymbol || "SI Units"} />
                          </SelectTrigger>
                          <SelectContent>
                            {(() => {
                              const cat = CONVERSION_DATA.find(c => c.id === resultCategory);
                              if (!cat) return null;
                              
                              // Filter based on beer/wine checkbox
                              let units = resultCategory === 'volume' && !includeBeerWine 
                                ? cat.units.filter(u => !u.beerWine)
                                : cat.units;
                              
                              // Check if base SI unit exists in units array with same symbol
                              const baseUnitExists = units.some(u => u.symbol === cat.baseSISymbol);
                              
                              return (
                                <>
                                  {!baseUnitExists && (
                                    <SelectItem value="base" className="text-xs font-mono">
                                      <span className="font-bold mr-2">{cat.baseSISymbol}</span>
                                      <span className="opacity-70">{t(cat.baseUnit.charAt(0).toUpperCase() + cat.baseUnit.slice(1))}</span>
                                    </SelectItem>
                                  )}
                                  {units.map(unit => (
                                    <SelectItem key={unit.id} value={unit.id} className="text-xs font-mono">
                                      {unit.symbol === unit.name ? (
                                        <span className="font-bold">{unit.symbol}</span>
                                      ) : (
                                        <>
                                          <span className="font-bold mr-2">{unit.symbol}</span>
                                          <span className="opacity-70">{translateUnitName(unit.name)}</span>
                                        </>
                                      )}
                                    </SelectItem>
                                  ))}
                                </>
                              );
                            })()}
                          </SelectContent>
                        </Select>
                      </>
                    ) : (
                      (() => {
                        // For complex dimensions that don't match a category, show alternative representations
                        const val = calcValues[3];
                        if (!val || Object.keys(val.dimensions).length === 0) {
                          // Dimensionless
                          return (
                            <Select value="unitless" disabled>
                              <SelectTrigger className="h-9 flex-1 text-xs">
                                <SelectValue placeholder="" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="unitless" className="text-xs"></SelectItem>
                              </SelectContent>
                            </Select>
                          );
                        }
                        
                        // Generate alternative representations
                        const alternatives = generateAlternativeRepresentations(val.dimensions);
                        
                        return (
                          <Select 
                            value={selectedAlternative.toString()} 
                            onValueChange={(val) => setSelectedAlternative(parseInt(val))}
                          >
                            <SelectTrigger className="h-9 flex-1 text-xs">
                              <SelectValue placeholder="Select representation" />
                            </SelectTrigger>
                            <SelectContent>
                              {alternatives.map((alt, index) => (
                                <SelectItem key={index} value={index.toString()} className="text-xs font-mono">
                                  <span className="font-bold">{alt.displaySymbol}</span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        );
                      })()
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={copyCalcResult}
                      disabled={!calcValues[3]}
                      className="text-xs hover:text-accent gap-1 shrink-0"
                    >
                      <Copy className="w-3 h-3" />
                      <motion.span
                        animate={{
                          opacity: flashCopyCalc ? [1, 0.3, 1] : 1,
                          scale: flashCopyCalc ? [1, 1.1, 1] : 1
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        {t('Copy')}
                      </motion.span>
                    </Button>
                  </React.Fragment>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}