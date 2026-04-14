import type { CalcValue } from '@/lib/units/calcValue';
import { useConverterContext } from '../context/ConverterContext';
import * as actions from '../state/actions/rpnActions';

export interface UseRpnStackReturn {
  rpnStack: Array<CalcValue | null>;
  setRpnStack: (value: Array<CalcValue | null> | ((prev: Array<CalcValue | null>) => Array<CalcValue | null>)) => void;
  previousRpnStack: Array<CalcValue | null>;
  setPreviousRpnStack: (value: Array<CalcValue | null>) => void;
  lastX: CalcValue | null;
  setLastX: (value: CalcValue | null) => void;
  rpnResultPrefix: string;
  setRpnResultPrefix: (value: string) => void;
  rpnSelectedAlternative: number;
  setRpnSelectedAlternative: (value: number) => void;
  rpnXEditing: boolean;
  setRpnXEditing: (value: boolean) => void;
  rpnXEditValue: string;
  setRpnXEditValue: (value: string) => void;
  saveAndUpdateStack: (updater: (stack: Array<CalcValue | null>) => Array<CalcValue | null>) => void;
  pushValue: (value: CalcValue) => void;
  dropValue: () => void;
  swapXY: () => void;
  clearStack: () => void;
  undoStack: () => void;
  recallLastX: () => void;
}

export function useRpnStack(): UseRpnStackReturn {
  const { state, dispatch } = useConverterContext();
  const s = state.rpn;

  return {
    rpnStack: s.rpnStack,
    setRpnStack: (v) => typeof v === 'function'
      ? dispatch({ domain: 'rpn', ...actions.updateRpnStack(v) })
      : dispatch({ domain: 'rpn', ...actions.setRpnStack(v) }),
    previousRpnStack: s.previousRpnStack,
    setPreviousRpnStack: (v) => dispatch({ domain: 'rpn', ...actions.setPreviousRpnStack(v) }),
    lastX: s.lastX,
    setLastX: (v) => dispatch({ domain: 'rpn', ...actions.setLastX(v) }),
    rpnResultPrefix: s.rpnResultPrefix,
    setRpnResultPrefix: (v) => dispatch({ domain: 'rpn', ...actions.setRpnResultPrefix(v) }),
    rpnSelectedAlternative: s.rpnSelectedAlternative,
    setRpnSelectedAlternative: (v) => dispatch({ domain: 'rpn', ...actions.setRpnSelectedAlternative(v) }),
    rpnXEditing: s.rpnXEditing,
    setRpnXEditing: (v) => dispatch({ domain: 'rpn', ...actions.setRpnXEditing(v) }),
    rpnXEditValue: s.rpnXEditValue,
    setRpnXEditValue: (v) => dispatch({ domain: 'rpn', ...actions.setRpnXEditValue(v) }),
    saveAndUpdateStack: (updater) => dispatch({ domain: 'rpn', ...actions.saveAndUpdateStack(updater) }),
    pushValue: (v) => dispatch({ domain: 'rpn', ...actions.pushValue(v) }),
    dropValue: () => dispatch({ domain: 'rpn', ...actions.dropValue() }),
    swapXY: () => dispatch({ domain: 'rpn', ...actions.swapXY() }),
    clearStack: () => dispatch({ domain: 'rpn', ...actions.clearStack() }),
    undoStack: () => dispatch({ domain: 'rpn', ...actions.undoStack() }),
    recallLastX: () => dispatch({ domain: 'rpn', ...actions.recallLastX() }),
  };
}
