# Paper Sizes Quality

## What & Why
Add a "Paper Sizes" quality under the Other group so users can compare and convert between international, US, and Japanese paper format standards. Paper sizes are modelled as area (m²), so "1 A4" = 0.062370 m², enabling natural questions like "how many A5 sheets fit in an A4?" (answer: 2).

## Done looks like
- A "Paper Sizes" entry appears in the sidebar under the Other group.
- Selecting it shows a converter where each unit is a named paper format.
- The ISO A-series (A0–A10), ISO B-series (B0–B10), US standard sizes, and Japanese JIS B-series are all present.
- Compare All works correctly — selecting e.g. A4 shows how many sheets of every other format equal the same area.
- All paper size names have localization entries in all 12 unit locale files.
- The "Paper Sizes" category label is localized in all 12 UI locale files.
- Each unit has `measurementSystem` set (ISO series → `SI`, US sizes → `US_CUSTOMARY`, JIS → `JAPANESE`).

## Paper sizes to include

**ISO A-series** (base: m²)
A0 (0.999949 m²), A1 (0.499549), A2 (0.249480), A3 (0.124740), A4 (0.062370), A5 (0.031080), A6 (0.015540), A7 (0.007770), A8 (0.003885), A9 (0.001942), A10 (0.000971)

**ISO B-series**
B0 (1.414000 m²), B1 (0.707000), B2 (0.353500), B3 (0.176750), B4 (0.088375), B5 (0.044188), B6 (0.022094), B7 (0.011047), B8 (0.005523), B9 (0.002762), B10 (0.001381)

**US standard sizes** (in × in → m²)
- Letter: 8.5 × 11 in → 0.060387 m²
- Legal: 8.5 × 14 in → 0.076774 m²
- Tabloid / Ledger: 11 × 17 in → 0.120774 m²
- Executive: 7.25 × 10.5 in → 0.049094 m²
- Statement: 5.5 × 8.5 in → 0.030194 m²
- 8×10 (US photo): 8 × 10 in → 0.051613 m²
- ANSI C: 17 × 22 in → 0.240968 m²
- ANSI D: 22 × 34 in → 0.481935 m²
- ANSI E: 34 × 44 in → 0.963871 m²

**Japanese JIS B-series** (different from ISO B)
JIS B0 (1.498560 m²), JIS B1 (0.749840), JIS B2 (0.374920), JIS B3 (0.187460), JIS B4 (0.093548), JIS B5 (0.046774), JIS B6 (0.023387), JIS B7 (0.011693), JIS B8 (0.005847)

The executor should verify all factor values against authoritative sources (ISO 216, ANSI/ASME Y14.1, JIS P 0138) before committing.

## Out of scope
- ISO C-series (envelope sizes) — can be added in a follow-up.
- SRA / RA bleed sizes — can be added in a follow-up.
- Displaying both dimensions (width × height) in the UI — the converter shows area only; the unit name conveys the format identity.
- German DIN sizes (they are the same as ISO A/B, no additional entries needed).

## Tasks
1. **Create `paper_sizes.json`** — New conversion data file in `client/src/data/conversion/`. Base unit is m² (`baseSISymbol: "m²"`). Include all sizes listed above with correct factors and `measurementSystem` values. Use `unitType: "SI_BASE"` for ISO, `unitType: "US_COMMON"` for US sizes, `unitType: "SI_BASE"` for JIS (closest available tag; `measurementSystem: "JAPANESE"` carries the distinction).
2. **Register the category** — Add `"paper_sizes"` to the `UnitCategory` union in `client/src/lib/units/unitCategory.ts`. Add it to the Other group in `CATEGORY_GROUPS` in `UnitConverterApp.tsx`. Add its dimension seed `paper_sizes: { length: 2 }` alongside the other area-like categories.
3. **Add localization** — Add the display name (e.g. "Paper Sizes") to all 12 UI locale files (`client/src/data/localization/ui/*.json`). Add a name entry for every paper size unit in all 12 unit locale files (`client/src/data/localization/units/*.json`). For non-English locales, use the internationally recognised format designator (e.g. "A4", "Letter") with any locale-specific qualifier appended where appropriate.
4. **Wire category dimensions** — Add `paper_sizes` to the `categoryDimensions` map in `client/src/lib/units/categoryDimensions.ts` with the same dimensional formula as area (`{ length: 2 }`).

## Relevant files
- `client/src/data/conversion/area.json`
- `client/src/lib/units/unitCategory.ts`
- `client/src/lib/units/categoryDimensions.ts`
- `client/src/features/unit-converter/app/UnitConverterApp.tsx:167-176,358-369`
- `client/src/data/localization/ui/en.json`
- `client/src/data/localization/units/en.json`
