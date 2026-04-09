# Typography & Watch Length Category

## What & Why
The `typography` unit category exists in the data but is not wired into the sidebar navigation, so it never appears in the UI. The user expected to find it under "Other." Additionally, the category is missing the Ligne (the essential French watchmaking unit) and an explicit Didot point, leaving the five measurement systems (French, English, US, CSS, Swiss) incomplete.

## Done looks like
- A "Typography & Watch Lengths" (or similarly named) category appears under "Other" in the sidebar.
- The category contains units covering all five systems:
  - **French / Swiss**: Didot point, Cicero, Ligne (watch unit)
  - **English**: Traditional point (pica point), Traditional pica
  - **US**: American point, Agate
  - **CSS / Web**: CSS point, CSS pica, Pixel (96 PPI), Twip, Em
  - **SI**: Meter, Millimeter, Inch, Foot
- All new unit names have localization entries in every language file (en, en-us, fr, de, es, it, pt, ru, zh, ko, ja, ar).
- The category display name is localized in all UI language files.

## Out of scope
- Adding the `measurementSystem` field to units (that is covered by Task #66).
- Changing units in other existing categories.

## Tasks
1. **Add `typography` to the sidebar** — Include `typography` in the "Other" group inside `CATEGORY_GROUPS` in `UnitConverterApp.tsx`, and ensure the default unit selection logic handles it properly (line 369 already seeds it with `{ length: 1 }`).

2. **Add missing units to `typography.json`** — Add `didot` (Didot point, ≈0.376065 mm), `ligne` (French/Swiss watch ligne, ≈2.2558 mm), and `agate` (US agate, ≈1.8142 mm). Verify and correct the `unitType` labels on existing entries so each unit is tagged to the right system (e.g. Cicero → FRENCH or EUROPEAN rather than IMPERIAL).

3. **Update localization files** — Add display name entries for the new units (`didot`, `ligne`, `agate`) in all 12 unit localization files (`client/src/data/localization/units/*.json`). If the category display name is updated (e.g. to "Typography & Watch Lengths"), update that key in all 12 UI localization files (`client/src/data/localization/ui/*.json`) too.

## Relevant files
- `client/src/features/unit-converter/app/UnitConverterApp.tsx:167-176`
- `client/src/data/conversion/typography.json`
- `client/src/lib/units/unitCategory.ts`
- `client/src/data/localization/ui/en.json`
- `client/src/data/localization/units/en.json`
