import type { CalcValue } from '@/lib/units/calcValue';
import type { RpnAction } from '../rpnReducer';

export const setRpnStack = (v: Array<CalcValue | null>): RpnAction =>
  ({ type: 'SET_RPN_STACK', payload: v });

export const updateRpnStack = (
  updater: (prev: Array<CalcValue | null>) => Array<CalcValue | null>
): RpnAction => ({ type: 'UPDATE_RPN_STACK', payload: updater });

export const setPreviousRpnStack = (v: Array<CalcValue | null>): RpnAction =>
  ({ type: 'SET_PREVIOUS_RPN_STACK', payload: v });

export const setLastX = (v: CalcValue | null): RpnAction =>
  ({ type: 'SET_LAST_X', payload: v });

export const setRpnResultPrefix = (v: string): RpnAction =>
  ({ type: 'SET_RPN_RESULT_PREFIX', payload: v });

export const setRpnSelectedAlternative = (v: number): RpnAction =>
  ({ type: 'SET_RPN_SELECTED_ALTERNATIVE', payload: v });

export const setRpnXEditing = (v: boolean): RpnAction =>
  ({ type: 'SET_RPN_X_EDITING', payload: v });

export const setRpnXEditValue = (v: string): RpnAction =>
  ({ type: 'SET_RPN_X_EDIT_VALUE', payload: v });

export const saveAndUpdateStack = (
  updater: (stack: Array<CalcValue | null>) => Array<CalcValue | null>
): RpnAction => ({ type: 'SAVE_AND_UPDATE_STACK', payload: updater });

export const pushValue = (v: CalcValue): RpnAction =>
  ({ type: 'PUSH_VALUE', payload: v });

export const dropValue = (): RpnAction =>
  ({ type: 'DROP_VALUE' });

export const swapXY = (): RpnAction =>
  ({ type: 'SWAP_XY' });

export const clearStack = (): RpnAction =>
  ({ type: 'CLEAR_STACK' });

export const undoStack = (): RpnAction =>
  ({ type: 'UNDO_STACK' });

export const recallLastX = (): RpnAction =>
  ({ type: 'RECALL_LAST_X' });
