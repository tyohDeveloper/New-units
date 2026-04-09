import type { NumberFormat } from '@/lib/formatting';
import type { UiPrefsAction } from '../uiPrefsReducer';

export const setNumberFormat = (v: NumberFormat): UiPrefsAction =>
  ({ type: 'SET_NUMBER_FORMAT', payload: v });

export const setLanguage = (v: string): UiPrefsAction =>
  ({ type: 'SET_LANGUAGE', payload: v });

export const setActiveTab = (v: string): UiPrefsAction =>
  ({ type: 'SET_ACTIVE_TAB', payload: v });

export const setDirectValue = (v: string): UiPrefsAction =>
  ({ type: 'SET_DIRECT_VALUE', payload: v });

export const setDirectExponents = (v: Record<string, number>): UiPrefsAction =>
  ({ type: 'SET_DIRECT_EXPONENTS', payload: v });

export const updateDirectExponents = (
  updater: (prev: Record<string, number>) => Record<string, number>
): UiPrefsAction => ({ type: 'UPDATE_DIRECT_EXPONENTS', payload: updater });
