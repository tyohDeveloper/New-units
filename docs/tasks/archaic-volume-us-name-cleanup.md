# Archaic Volume US Name Cleanup

## What & Why
Peck, Bushel, and Cord are unambiguously US measures — the "(US)" qualifier in their names is redundant and should be dropped.

## Done looks like
- "Peck (US)" is displayed as "Peck"
- "Bushel (US)" is displayed as "Bushel"
- "Cord (US)" is displayed as "Cord"
- All other entries in archaic volume are unchanged

## Out of scope
- Changes to ids, symbols, factors, or unitTypes
- Changes to any other category
- Localization file updates

## Tasks
1. In `archaic_volume.json`, remove the " (US)" suffix from the `name` field of the peck, bushel, and cord entries.

## Relevant files
- `client/src/data/conversion/archaic_volume.json:176-203`
