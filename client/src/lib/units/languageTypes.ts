export const ISO_LANGUAGES = [
  'ar', 'bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'fi', 'fr', 'he', 'hi', 
  'hr', 'hu', 'id', 'it', 'ja', 'ko', 'lt', 'lv', 'nl', 'no', 'pl', 'pt', 
  'ro', 'ru', 'sk', 'sl', 'sv', 'th', 'tr', 'uk', 'vi', 'zh', 'zh_TW'
] as const;

export type SupportedLanguageCode = typeof ISO_LANGUAGES[number];
