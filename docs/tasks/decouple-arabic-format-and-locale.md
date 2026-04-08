# Arabic Text RTL, Layout Stays LTR

## What & Why
Currently, selecting Arabic language or the Arabic numeral format sets `dir="rtl"` on the entire document, which flips the whole app layout (sidebars, buttons, input alignment, etc.). The user wants Arabic text to read right-to-left, but the overall app layout should remain left-to-right at all times.

The fix is to stop applying `dir="rtl"` globally, and instead apply it only to text content elements (labels, translated strings, result values) when the language is Arabic.

## Done looks like
- The overall app layout (button positions, sidebar, input fields, number pickers) always stays left-to-right, regardless of language or number format.
- When Arabic language is selected, Arabic text content (unit labels, category names, translated strings) renders right-to-left within its own element.
- When a non-Arabic language is selected, all text renders left-to-right as normal.
- Switching between Arabic and Latin numeral formats does not affect the layout direction.
- The `document.documentElement` never has `dir="rtl"` set.

## Out of scope
- Changes to numeral conversion logic (already correct in formatting.ts).
- Adding new number formats or locales.
- Full i18n text layout audit beyond the direction attribute on text elements.

## Tasks
1. **Remove global RTL** — Delete (or neutralize) the `useEffect` in `UnitConverterApp.tsx` that sets `document.documentElement.dir` to `rtl`. The document root should always be `ltr`.

2. **Apply RTL to text content only** — Identify the elements that render translated/Arabic text (unit names, category labels, result labels, any translated UI strings) and add `dir="rtl"` (or a utility class that sets `direction: rtl`) conditionally when `language === 'ar'`.

3. **Decouple format and language pickers** — Remove any remaining logic that disables or forces one setting based on the other, so both the language picker and number format picker are always independently usable.

4. **Audit for regressions** — Check `ConverterPane.tsx` and other components for any `dir="ltr"` overrides that were workarounds for the global RTL; remove ones that are no longer needed and keep any that are genuinely required for number/symbol ordering.

## Relevant files
- `client/src/features/unit-converter/app/UnitConverterApp.tsx`
- `client/src/features/unit-converter/components/ConverterPane.tsx`
- `client/src/lib/formatting.ts`
- `client/src/lib/units/numberFormat.ts`
