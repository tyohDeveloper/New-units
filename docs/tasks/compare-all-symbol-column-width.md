# Compare All: widen symbol column

## What & Why
The first column in the Compare All panel uses `w-24` (96px), which is only wide enough for about 13 monospace characters at `text-xs`. The longest symbols in the dataset — such as `cal⋅s⁻¹⋅cm⁻¹⋅°C⁻¹` and `BTU⋅h⁻¹⋅ft⁻¹⋅°F⁻¹` (17 characters each) — overflow and wrap. Since symbols never need localization, the right width can be computed statically.

## Done looks like
- The symbol column in the Compare All panel is wide enough that no symbol ever wraps, regardless of which category is shown.
- The name and value columns still receive the remaining space.

## Out of scope
- Any change to other columns (name, value).
- Changing the column width for any UI element outside the Compare All comparison-mode panel.

## Tasks
1. **Widen the symbol column** — Scan all unit symbols in `client/src/data/conversion/` JSON files to confirm the longest possible display symbol (including prefix+symbol combos). Change the column's fixed width class from `w-24` to the smallest Tailwind width value that comfortably fits the longest symbol at `text-xs` font-mono — based on the audit this is `w-36` (144px, ~20 monospace chars).

## Relevant files
- `client/src/features/unit-converter/components/ConverterPane.tsx:505-525`
- `client/src/data/conversion/`
