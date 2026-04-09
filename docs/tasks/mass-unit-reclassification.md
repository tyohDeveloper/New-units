# Mass Unit Reclassification

## What & Why
Stone, Troy Ounce, and Troy Pound are commonly used imperial/troy measures and belong in the standard Mass category rather than Archaic Mass. Stone and Troy Ounce are already present in standard mass; this task cleans up archaic mass and fills the missing Troy Pound entry.

## Done looks like
- Stone (UK), Troy Ounce, and Troy Pound no longer appear in the Archaic Mass list
- Troy Pound appears in the standard Mass list (Stone and Troy Ounce are already there)
- The Stone entry in standard mass remains named simply "Stone" (no regional qualifier)
- All other entries in both categories are unchanged

## Out of scope
- Changes to any other quantity category
- Localization file cleanup for removed entries

## Tasks
1. Remove the `stone_uk`, `troy_oz`, and `troy_lb` entries from `archaic_mass.json`.
2. Add a Troy Pound entry (`lb t`, factor 0.3732417) to `mass.json`, positioned near the other troy unit (Troy Ounce).

## Relevant files
- `client/src/data/conversion/archaic_mass.json`
- `client/src/data/conversion/mass.json`
