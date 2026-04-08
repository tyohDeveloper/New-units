# Localize missing UI strings

## What & Why
Several labels, buttons, and status messages in the app are hardcoded English strings not covered by the translation system. This task adds them to all 12 per-language UI JSON files so they display correctly in every supported locale.

## Done looks like
- Switching the language selector to any supported language shows translated text for all of the following:
  - "Smart Paste" button (converter tab and custom tab), plus its two status variants "Not recognised" and "Unavailable"
  - Calculator mode label: the word "Calculator" is translated; "RPN" stays the same in all languages
  - "Clear calculator", "Keep source units", "Clear" (individual field clear buttons), "Precision" labels in both calculator modes
  - Custom Entry pane: "Value", "Result", "Dimensions", "Clear Dimensions", "Copy"
  - Converter pane: "From", "To", "Prefix", "Unit", "Base Factor", "SI Base Units", "Compare All", "Compare", "Base unit:", "Copy"
- Calculator function key labels (e.g. ENTER, DROP, SIN, COS, y^x…) are left in English — HP calculator convention.
- "RPN" is unchanged across all languages.
- No regressions in existing translated strings.

## Out of scope
- Translating calculator function button labels (intentionally kept in English).
- Adding new languages beyond the current 12.
- Changing any conversion logic or UI layout.

## Tasks
1. **Identify all missing keys** — compile the full list of untranslated `t(...)` call keys in `CalculatorPane.tsx`, `ConverterPane.tsx`, `DirectPane.tsx`, and `UnitConverterApp.tsx` that are absent from `en.json`. Keys to add (confirmed missing): `CALCULATOR`, `CALCULATOR - RPN`, `Clear calculator`, `Keep source units`, `Clear`, `Smart Paste`, `Not recognised`, `Unavailable`, `Value`, `Result`, `Dimensions`, `Clear Dimensions`, `From`, `To`, `Prefix`, `Unit`, `Base Factor`, `SI Base Units`, `Compare All`, `Compare`, `Base unit:`, `Copy`, `Precision`. Verify `Converter` and `Custom` are already present (they are).
2. **Add keys to all language files** — add each missing key to `en.json` first, then add appropriate translations to the 11 other language files (`ar`, `de`, `es`, `fr`, `it`, `ja`, `ko`, `pt`, `ru`, `zh`, `en-us`). "RPN" is invariant and must remain "RPN" in every language. For `CALCULATOR` and `CALCULATOR - RPN`, translate only the word "Calculator/Calculatrice/Rechner/…" — the "- RPN" suffix is appended in code and must not be duplicated in the translation value.

## Relevant files
- `client/src/data/localization/ui/en.json`
- `client/src/data/localization/ui/ar.json`
- `client/src/data/localization/ui/de.json`
- `client/src/data/localization/ui/es.json`
- `client/src/data/localization/ui/fr.json`
- `client/src/data/localization/ui/it.json`
- `client/src/data/localization/ui/ja.json`
- `client/src/data/localization/ui/ko.json`
- `client/src/data/localization/ui/pt.json`
- `client/src/data/localization/ui/ru.json`
- `client/src/data/localization/ui/zh.json`
- `client/src/data/localization/ui/en-us.json`
- `client/src/features/unit-converter/components/CalculatorPane.tsx`
- `client/src/features/unit-converter/components/ConverterPane.tsx`
- `client/src/features/unit-converter/components/DirectPane.tsx`
- `client/src/features/unit-converter/app/UnitConverterApp.tsx`
