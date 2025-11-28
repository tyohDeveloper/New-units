export const SUPPORTED_LANGUAGES = [
  'en',
  'en-us',
  'ar',
  'de',
  'es',
  'fr',
  'it',
  'ja',
  'pt',
  'ru',
  'zh',
] as const;

export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export interface Translation {
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
}

export const UI_TRANSLATIONS: Record<string, Translation> = {
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
  'Temperature': { 
    en: 'Temperature', ar: 'درجة الحرارة', de: 'Temperatur',
    es: 'Temperatura', fr: 'Température', it: 'Temperatura',
    pt: 'Temperatura', ru: 'Температура', zh: '温度', ja: '温度'
  },
  'Energy': { 
    en: 'Energy', ar: 'الطاقة', de: 'Energie',
    es: 'Energía', fr: 'Énergie', it: 'Energia',
    pt: 'Energia', ru: 'Энергия', zh: '能量', ja: 'エネルギー'
  },
  'Pressure': { 
    en: 'Pressure', ar: 'الضغط', de: 'Druck',
    es: 'Presión', fr: 'Pression', it: 'Pressione',
    pt: 'Pressão', ru: 'Давление', zh: '压力', ja: '圧力'
  },
  'Power': { 
    en: 'Power', ar: 'القدرة', de: 'Leistung',
    es: 'Potencia', fr: 'Puissance', it: 'Potenza',
    pt: 'Potência', ru: 'Мощность', zh: '功率', ja: '仕事率'
  },
};

export const UNIT_NAME_TRANSLATIONS: Record<string, Translation> = {
  'Meter': { 
    en: 'Meter', ar: 'متر', de: 'Meter',
    es: 'Metro', fr: 'Mètre', it: 'Metro',
    pt: 'Metro', ru: 'Метр', zh: '米', ja: 'メートル'
  },
  'Kilogram': { 
    en: 'Kilogram', ar: 'كيلوغرام', de: 'Kilogramm',
    es: 'Kilogramo', fr: 'Kilogramme', it: 'Chilogrammo',
    pt: 'Quilograma', ru: 'Килограмм', zh: '千克', ja: 'キログラム'
  },
  'Second': { 
    en: 'Second', ar: 'ثانية', de: 'Sekunde',
    es: 'Segundo', fr: 'Seconde', it: 'Secondo',
    pt: 'Segundo', ru: 'Секунда', zh: '秒', ja: '秒'
  },
  'Newton': { 
    en: 'Newton', ar: 'نيوتن', de: 'Newton',
    es: 'Newton', fr: 'Newton', it: 'Newton',
    pt: 'Newton', ru: 'Ньютон', zh: '牛顿', ja: 'ニュートン'
  },
  'Joule': { 
    en: 'Joule', ar: 'جول', de: 'Joule',
    es: 'Julio', fr: 'Joule', it: 'Joule',
    pt: 'Joule', ru: 'Джоуль', zh: '焦耳', ja: 'ジュール'
  },
  'Watt': { 
    en: 'Watt', ar: 'واط', de: 'Watt',
    es: 'Vatio', fr: 'Watt', it: 'Watt',
    pt: 'Watt', ru: 'Ватт', zh: '瓦特', ja: 'ワット'
  },
  'Pascal': { 
    en: 'Pascal', ar: 'باسكال', de: 'Pascal',
    es: 'Pascal', fr: 'Pascal', it: 'Pascal',
    pt: 'Pascal', ru: 'Паскаль', zh: '帕斯卡', ja: 'パスカル'
  },
  'Kelvin': { 
    en: 'Kelvin', ar: 'كلفن', de: 'Kelvin',
    es: 'Kelvin', fr: 'Kelvin', it: 'Kelvin',
    pt: 'Kelvin', ru: 'Кельвин', zh: '开尔文', ja: 'ケルビン'
  },
  'Celsius': { 
    en: 'Celsius', ar: 'مئوية', de: 'Celsius',
    es: 'Celsius', fr: 'Celsius', it: 'Celsius',
    pt: 'Celsius', ru: 'Цельсий', zh: '摄氏度', ja: '摂氏'
  },
  'Fahrenheit': { 
    en: 'Fahrenheit', ar: 'فهرنهايت', de: 'Fahrenheit',
    es: 'Fahrenheit', fr: 'Fahrenheit', it: 'Fahrenheit',
    pt: 'Fahrenheit', ru: 'Фаренгейт', zh: '华氏度', ja: '華氏'
  },
};

export const SI_SYMBOLS = [
  'm', 'kg', 'g', 's', 'A', 'K', 'mol', 'cd',
  'Hz', 'N', 'Pa', 'J', 'W', 'C', 'V', 'F',
  'Ω', 'S', 'Wb', 'T', 'H', 'lm', 'lx', 'Bq',
  'Gy', 'Sv', 'kat', 'rad', 'sr',
  'm²', 'm³', 'L', 'ha',
];

export const SI_PREFIX_SYMBOLS = [
  'Y', 'Z', 'E', 'P', 'T', 'G', 'M', 'k',
  'c', 'm', 'µ', 'n', 'p', 'f', 'a', 'z', 'y',
];

export const translate = (
  key: string, 
  language: SupportedLanguage, 
  translations: Record<string, Translation>
): string => {
  if (!translations[key]) {
    return key;
  }
  
  const trans = translations[key];
  
  if (language === 'en' || language === 'en-us') return trans.en;
  
  const langKey = language as keyof Translation;
  if (trans[langKey]) return trans[langKey] as string;
  
  return trans.en || key;
};
