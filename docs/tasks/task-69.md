---
title: Add beats/hour to frequency
---
# Add Beats/Hour to Frequency

## What & Why
Add beats/hour (bph) as a named frequency unit. This is the standard unit used in watchmaking to describe a mechanical watch's escapement frequency — common values are 18,000, 21,600, 28,800, and 36,000 bph. Without it, users must work with the generic "Per Hour" unit which carries no watchmaking context.

## Done looks like
- "Beats/Hour" appears as a selectable unit in the Frequency category with the symbol "bph"
- Converting 28,800 bph gives correct results (e.g. 8 Hz, 0.1333… s⁻¹ × 8)
- The unit has localized names in all supported language files (or falls back gracefully)

## Out of scope
- Adding beats/minute (BPM) — that is already covered by "Per Minute" and "RPM"
- Any UI changes beyond the unit data

## Tasks
1. **Add bph unit to frequency data** — Add a `beats_per_hour` entry to `frequency.json` with the symbol `bph`, the same conversion factor as `per_hour` (1/3600 ≈ 2.7778×10⁻⁴), and `unitType: "OTHER"` (or whichever type fits watchmaking specialty units).

2. **Add localized names** — Add "Beats/Hour" translations to each language file in `client/src/data/localization/units/`. Where no translation is available, the English name "Beats/Hour" is acceptable as a fallback.

## Relevant files
- `client/src/data/conversion/frequency.json`
- `client/src/data/localization/units/en.json`
- `client/src/data/localization/units/en-us.json`
- `client/src/data/localization/units/de.json`
- `client/src/data/localization/units/fr.json`
- `client/src/data/localization/units/es.json`
- `client/src/data/localization/units/it.json`
- `client/src/data/localization/units/pt.json`
- `client/src/data/localization/units/ar.json`
- `client/src/data/localization/units/ru.json`
- `client/src/data/localization/units/ja.json`
- `client/src/data/localization/units/ko.json`
- `client/src/data/localization/units/zh.json`