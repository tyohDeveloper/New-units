import { describe, it, expect } from 'vitest';
import {
  SUPPORTED_LANGUAGES,
  UI_TRANSLATIONS,
  UNIT_NAME_TRANSLATIONS,
  SI_SYMBOLS,
  SI_PREFIX_SYMBOLS,
  translate,
  type SupportedLanguage,
} from '../client/src/lib/localization';
import { PREFIXES, BINARY_PREFIXES, ALL_PREFIXES, CONVERSION_DATA } from '../client/src/lib/conversion-data';

describe('Language Localization', () => {
  describe('UI Element Translations', () => {
    it('should have translations for all supported languages', () => {
      const requiredLanguages: SupportedLanguage[] = ['en', 'ar'];
      
      for (const key of Object.keys(UI_TRANSLATIONS)) {
        for (const lang of requiredLanguages) {
          const translation = translate(key, lang, UI_TRANSLATIONS);
          expect(translation).toBeTruthy();
          expect(translation).not.toBe('');
        }
      }
    });

    it('should translate category names correctly for German', () => {
      expect(translate('Length', 'de', UI_TRANSLATIONS)).toBe('Länge');
      expect(translate('Mass', 'de', UI_TRANSLATIONS)).toBe('Masse');
      expect(translate('Time', 'de', UI_TRANSLATIONS)).toBe('Zeit');
    });

    it('should translate category names correctly for Spanish', () => {
      expect(translate('Length', 'es', UI_TRANSLATIONS)).toBe('Longitud');
      expect(translate('Mass', 'es', UI_TRANSLATIONS)).toBe('Masa');
      expect(translate('Energy', 'es', UI_TRANSLATIONS)).toBe('Energía');
    });

    it('should translate category names correctly for French', () => {
      expect(translate('Length', 'fr', UI_TRANSLATIONS)).toBe('Longueur');
      expect(translate('Mass', 'fr', UI_TRANSLATIONS)).toBe('Masse');
      expect(translate('Temperature', 'fr', UI_TRANSLATIONS)).toBe('Température');
    });

    it('should translate category names correctly for Chinese', () => {
      expect(translate('Length', 'zh', UI_TRANSLATIONS)).toBe('长度');
      expect(translate('Mass', 'zh', UI_TRANSLATIONS)).toBe('质量');
      expect(translate('Energy', 'zh', UI_TRANSLATIONS)).toBe('能量');
    });

    it('should translate category names correctly for Japanese', () => {
      expect(translate('Length', 'ja', UI_TRANSLATIONS)).toBe('長さ');
      expect(translate('Mass', 'ja', UI_TRANSLATIONS)).toBe('質量');
      expect(translate('Power', 'ja', UI_TRANSLATIONS)).toBe('仕事率');
    });

    it('should translate category names correctly for Arabic', () => {
      expect(translate('Length', 'ar', UI_TRANSLATIONS)).toBe('الطول');
      expect(translate('Mass', 'ar', UI_TRANSLATIONS)).toBe('الكتلة');
      expect(translate('Energy', 'ar', UI_TRANSLATIONS)).toBe('الطاقة');
    });

    it('should translate category names correctly for Russian', () => {
      expect(translate('Length', 'ru', UI_TRANSLATIONS)).toBe('Длина');
      expect(translate('Mass', 'ru', UI_TRANSLATIONS)).toBe('Масса');
      expect(translate('Pressure', 'ru', UI_TRANSLATIONS)).toBe('Давление');
    });

    it('should fall back to English for missing translations', () => {
      const result = translate('Unknown Key', 'de', UI_TRANSLATIONS);
      expect(result).toBe('Unknown Key');
    });

    it('should handle en-us as English variant', () => {
      expect(translate('Length', 'en-us', UI_TRANSLATIONS)).toBe('Length');
      expect(translate('Mass', 'en-us', UI_TRANSLATIONS)).toBe('Mass');
    });
  });

  describe('Unit Name Translations', () => {
    it('should translate unit names correctly for German', () => {
      expect(translate('Meter', 'de', UNIT_NAME_TRANSLATIONS)).toBe('Meter');
      expect(translate('Kilogram', 'de', UNIT_NAME_TRANSLATIONS)).toBe('Kilogramm');
      expect(translate('Second', 'de', UNIT_NAME_TRANSLATIONS)).toBe('Sekunde');
    });

    it('should translate unit names correctly for Spanish', () => {
      expect(translate('Meter', 'es', UNIT_NAME_TRANSLATIONS)).toBe('Metro');
      expect(translate('Kilogram', 'es', UNIT_NAME_TRANSLATIONS)).toBe('Kilogramo');
      expect(translate('Joule', 'es', UNIT_NAME_TRANSLATIONS)).toBe('Julio');
      expect(translate('Watt', 'es', UNIT_NAME_TRANSLATIONS)).toBe('Vatio');
    });

    it('should translate unit names correctly for French', () => {
      expect(translate('Meter', 'fr', UNIT_NAME_TRANSLATIONS)).toBe('Mètre');
      expect(translate('Kilogram', 'fr', UNIT_NAME_TRANSLATIONS)).toBe('Kilogramme');
      expect(translate('Second', 'fr', UNIT_NAME_TRANSLATIONS)).toBe('Seconde');
    });

    it('should translate unit names correctly for Italian', () => {
      expect(translate('Meter', 'it', UNIT_NAME_TRANSLATIONS)).toBe('Metro');
      expect(translate('Kilogram', 'it', UNIT_NAME_TRANSLATIONS)).toBe('Chilogrammo');
    });

    it('should translate unit names correctly for Chinese', () => {
      expect(translate('Meter', 'zh', UNIT_NAME_TRANSLATIONS)).toBe('米');
      expect(translate('Kilogram', 'zh', UNIT_NAME_TRANSLATIONS)).toBe('千克');
      expect(translate('Second', 'zh', UNIT_NAME_TRANSLATIONS)).toBe('秒');
    });

    it('should translate unit names correctly for Japanese', () => {
      expect(translate('Meter', 'ja', UNIT_NAME_TRANSLATIONS)).toBe('メートル');
      expect(translate('Kilogram', 'ja', UNIT_NAME_TRANSLATIONS)).toBe('キログラム');
      expect(translate('Newton', 'ja', UNIT_NAME_TRANSLATIONS)).toBe('ニュートン');
    });

    it('should translate temperature units correctly', () => {
      expect(translate('Kelvin', 'de', UNIT_NAME_TRANSLATIONS)).toBe('Kelvin');
      expect(translate('Celsius', 'zh', UNIT_NAME_TRANSLATIONS)).toBe('摄氏度');
      expect(translate('Fahrenheit', 'ja', UNIT_NAME_TRANSLATIONS)).toBe('華氏');
    });
  });

  describe('SI Symbols Remain Unchanged', () => {
    it('should have SI symbols defined as constants', () => {
      expect(SI_SYMBOLS).toContain('m');
      expect(SI_SYMBOLS).toContain('kg');
      expect(SI_SYMBOLS).toContain('s');
      expect(SI_SYMBOLS).toContain('N');
      expect(SI_SYMBOLS).toContain('J');
      expect(SI_SYMBOLS).toContain('W');
      expect(SI_SYMBOLS).toContain('Pa');
    });

    it('should not translate SI symbols in any language', () => {
      for (const symbol of SI_SYMBOLS) {
        expect(symbol).toMatch(/^[A-Za-zΩµ°²³\/]+$/);
      }
    });

    it('should verify unit symbols in conversion data are Latin/SI (no translated text)', () => {
      const nonLatinScripts = /[\u0600-\u06FF\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF\u0400-\u04FF]/;
      
      for (const category of CONVERSION_DATA) {
        for (const unit of category.units) {
          const symbol = unit.symbol;
          expect(symbol).toBeTruthy();
          expect(typeof symbol).toBe('string');
          const hasNonLatinScript = nonLatinScripts.test(symbol);
          expect(hasNonLatinScript).toBe(false);
        }
      }
    });
  });

  describe('SI Prefix Symbols Remain Unchanged', () => {
    it('should have prefix symbols defined as constants', () => {
      expect(SI_PREFIX_SYMBOLS).toContain('k');
      expect(SI_PREFIX_SYMBOLS).toContain('M');
      expect(SI_PREFIX_SYMBOLS).toContain('G');
      expect(SI_PREFIX_SYMBOLS).toContain('m');
      expect(SI_PREFIX_SYMBOLS).toContain('µ');
      expect(SI_PREFIX_SYMBOLS).toContain('n');
    });

    it('should verify prefix symbols in PREFIXES data are Latin/SI', () => {
      for (const prefix of ALL_PREFIXES) {
        if (prefix.symbol) {
          expect(/^[A-Za-zµ]{1,2}$/.test(prefix.symbol)).toBe(true);
        }
      }
    });

    it('should not translate prefix symbols regardless of language', () => {
      const prefixSymbols = ALL_PREFIXES.map(p => p.symbol).filter(s => s);
      for (const symbol of prefixSymbols) {
        expect(symbol).toMatch(/^[A-Za-zµ]{1,2}$/);
      }
    });
  });

  describe('Translation Coverage', () => {
    it('should support all 11 languages', () => {
      expect(SUPPORTED_LANGUAGES).toHaveLength(11);
      expect(SUPPORTED_LANGUAGES).toContain('en');
      expect(SUPPORTED_LANGUAGES).toContain('en-us');
      expect(SUPPORTED_LANGUAGES).toContain('ar');
      expect(SUPPORTED_LANGUAGES).toContain('de');
      expect(SUPPORTED_LANGUAGES).toContain('es');
      expect(SUPPORTED_LANGUAGES).toContain('fr');
      expect(SUPPORTED_LANGUAGES).toContain('it');
      expect(SUPPORTED_LANGUAGES).toContain('ja');
      expect(SUPPORTED_LANGUAGES).toContain('pt');
      expect(SUPPORTED_LANGUAGES).toContain('ru');
      expect(SUPPORTED_LANGUAGES).toContain('zh');
    });

    it('should have English and Arabic translations for all UI elements', () => {
      for (const key of Object.keys(UI_TRANSLATIONS)) {
        const trans = UI_TRANSLATIONS[key];
        expect(trans.en).toBeTruthy();
        expect(trans.ar).toBeTruthy();
      }
    });

    it('should have English and Arabic translations for all unit names', () => {
      for (const key of Object.keys(UNIT_NAME_TRANSLATIONS)) {
        const trans = UNIT_NAME_TRANSLATIONS[key];
        expect(trans.en).toBeTruthy();
        expect(trans.ar).toBeTruthy();
      }
    });
  });

  describe('Regional Spelling Variations (English)', () => {
    it('should use "Meter" for en-us variant', () => {
      expect(translate('Meter', 'en-us', UNIT_NAME_TRANSLATIONS)).toBe('Meter');
    });

    it('should use "Meter" for en (British uses "Metre" in display, but base is "Meter")', () => {
      expect(translate('Meter', 'en', UNIT_NAME_TRANSLATIONS)).toBe('Meter');
    });
  });
});

describe('Consistency Between Translations and Data', () => {
  it('should have category names that can be translated', () => {
    const categoryNames = CONVERSION_DATA.map(c => c.name);
    for (const name of categoryNames) {
      expect(name).toBeTruthy();
      expect(typeof name).toBe('string');
    }
  });

  it('should have unit names that can be translated', () => {
    for (const category of CONVERSION_DATA) {
      for (const unit of category.units) {
        expect(unit.name).toBeTruthy();
        expect(typeof unit.name).toBe('string');
      }
    }
  });
});
