import type { RpnState } from '../rpnReducer';

export const selectRpnStack = (s: RpnState) => s.rpnStack;
export const selectPreviousRpnStack = (s: RpnState) => s.previousRpnStack;
export const selectLastX = (s: RpnState) => s.lastX;
export const selectRpnResultPrefix = (s: RpnState) => s.rpnResultPrefix;
export const selectRpnSelectedAlternative = (s: RpnState) => s.rpnSelectedAlternative;
export const selectRpnXEditing = (s: RpnState) => s.rpnXEditing;
export const selectRpnXEditValue = (s: RpnState) => s.rpnXEditValue;
