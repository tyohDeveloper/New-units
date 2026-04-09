import type { UiPrefsState } from '../uiPrefsReducer';

export const selectNumberFormat = (s: UiPrefsState) => s.numberFormat;
export const selectLanguage = (s: UiPrefsState) => s.language;
export const selectActiveTab = (s: UiPrefsState) => s.activeTab;
export const selectDirectValue = (s: UiPrefsState) => s.directValue;
export const selectDirectExponents = (s: UiPrefsState) => s.directExponents;
