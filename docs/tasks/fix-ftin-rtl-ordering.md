# Fix ft'in" RTL Bidi Reversal

## What & Why
In Arabic (RTL) locale the document direction is set to `rtl`, which causes the browser's Unicode bidirectional algorithm to render the `ft'in"` symbol as `in"ft'` — the foot and inch portions swap because the quote characters act as bidi punctuation anchors. The fix is to pin `dir="ltr"` on every element that renders an ft_in symbol or value, so the ordering is always foot-first regardless of document direction.

## Done looks like
- When Arabic locale is active and ft'in" is the selected unit, the placeholder text in the from-input reads `ft'in"` (not `in"ft'`).
- The result value (e.g. `5'10"`) in the to-field renders with feet before inches.
- The "1 unit = X" conversion ratio row also shows the ft_in value feet-first.
- All other RTL behaviour (Arabic numerals, right-aligned layout) is unaffected.

## Out of scope
- Any change to the ft_in parsing, formatting logic, or conversion maths.
- RTL fixes for deg_dms or any other compound unit.

## Tasks
1. In `ConverterPane.tsx`, add `dir="ltr"` to the from-input element when `fromUnit === 'ft_in'`, and add `dir="ltr"` to the result display span and the conversion-ratio span when `toUnit === 'ft_in'` (or `fromUnit === 'ft_in'` for the ratio row). This is purely a DOM attribute change; no logic changes are needed.
2. Add a test case to the localization or formatting test suite asserting that `formatFtIn` output and the `ft'in"` placeholder string render with feet before inches in an RTL context (i.e. the strings themselves are not reversed).

## Relevant files
- `client/src/features/unit-converter/components/ConverterPane.tsx:140-155,310-323,420-436`
- `client/src/features/unit-converter/app/UnitConverterApp.tsx:444-451,1248-1252`
- `tests/formatting.test.ts`
- `tests/localization.test.ts`
