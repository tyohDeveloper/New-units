# Extract Orchestration Layer from God Components

## What & Why
`UnitConverterApp.tsx` (1,679 lines) and `CalculatorPane.tsx` (1,225 lines) still act as god components despite the earlier reducer/state refactor. Both coordinate logic across multiple domains (converter, calculator, RPN, formatting, paste flows) inside component bodies. Additionally, state ownership is inconsistent — reducer/context state is mixed with local `useState` for the same concepts, and `preserveSourceUnit` in the calculator state has no matching hook/action, creating an asymmetry that is a bug risk.

## Done looks like
- `UnitConverterApp.tsx` is dramatically smaller — it delegates to per-pane controller hooks and is primarily responsible for layout and routing between panes.
- `CalculatorPane.tsx` no longer receives dozens of individual props; it consumes a compact controller object from its own hook.
- Three controller hooks exist (`useConverterController`, `useCalculatorController`, `useRpnController` or equivalent) that encapsulate event handling and side-effect logic for each pane.
- All shared state lives in the reducer/context; no parallel `useState` exists for the same concept.
- `preserveSourceUnit` is exposed through the calculator hook/actions consistently with other fields.
- Hooks dispatch via action creators, not raw action literals.
- No behavioral regressions — existing tests pass and the app functions identically.

## Out of scope
- Adding new features or units.
- Redesigning the reducer structure (already sound).
- Migrating to a different state management library.

## Tasks
1. **Extract `useConverterController`** — Move converter-domain event handlers and side effects out of `UnitConverterApp` into a dedicated hook. The pane component receives only the hook's return value.
2. **Extract `useCalculatorController`** — Move calculator/RPN event handlers and orchestration logic out of `UnitConverterApp` and `CalculatorPane` into a dedicated hook. Expose `preserveSourceUnit` read/write through this hook consistently with other fields.
3. **Shrink prop interfaces** — Replace wide individual-prop surfaces on `CalculatorPane` (and any other panes) with compact controller objects returned from the new hooks.
4. **Standardize state ownership** — Remove `useState` from `UnitConverterApp` for any concepts already managed by the reducer/context. Ensure all hooks dispatch via action creators, not raw literals.

## Relevant files
- `client/src/features/unit-converter/app/UnitConverterApp.tsx`
- `client/src/features/unit-converter/components/CalculatorPane.tsx`
- `client/src/features/unit-converter/components/ConverterPane.tsx`
- `client/src/features/unit-converter/components/DirectPane.tsx`
- `client/src/components/unit-converter/context/ConverterContext.tsx`
- `client/src/components/unit-converter/hooks/useCalculatorState.ts`
- `client/src/components/unit-converter/hooks/useConverterState.ts`
- `client/src/components/unit-converter/hooks/useRpnStack.ts`
- `client/src/components/unit-converter/hooks/index.ts`
- `client/src/components/unit-converter/state/actions/calculatorActions.ts`
- `client/src/components/unit-converter/state/actions/converterActions.ts`
- `client/src/components/unit-converter/state/actions/rpnActions.ts`
- `client/src/components/unit-converter/state/actions/uiActions.ts`
- `client/src/components/unit-converter/state/selectors/calculatorSelectors.ts`
- `client/src/components/unit-converter/state/selectors/converterSelectors.ts`
- `client/src/components/unit-converter/state/calculatorReducer.ts`
- `client/src/components/unit-converter/state/converterReducer.ts`
- `client/src/components/unit-converter/state/rpnReducer.ts`
