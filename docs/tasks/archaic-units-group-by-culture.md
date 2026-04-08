# Group Archaic Units by Culture/Source

## What & Why
The archaic & local quality categories (area, length, mass, volume) list units sorted by size, mixing units from Japan, Korea, China, India, US, etc. randomly together. Units also inconsistently include their source country/culture in parentheses — some have it (e.g. "Tsubo (Japan)") and others don't (e.g. "Fathom", "Grain", "Palm"). This makes the lists hard to read and compare units from the same tradition.

## Done looks like
- Within each archaic category (area, length, mass, volume), units are clustered by their country/culture of origin — all Japanese units together, all Korean together, all Chinese together, all US/Imperial together, etc.
- Every unit name includes its source in parentheses — no unit is missing a label (e.g. "Fathom (US)", "Grain (US)", "Palm (Ancient)", "Pennyweight (Imperial)", "Fluid Dram (US)")
- The SI base/reference unit (Metre, Kilogram, etc.) remains at the top of each list
- Existing units that already have correct labels (e.g. "Section (US)", "Township (US)", "Go (Japan)") are unchanged in their label

## Out of scope
- Changing conversion factors or symbols
- Adding or removing units
- Changes to any category other than the four archaic ones (archaic_area, archaic_length, archaic_mass, archaic_volume)

## Tasks
1. **Add missing source labels** — For each unit in the four archaic JSON files that lacks a country/culture label in its name, add the appropriate label in parentheses. Key additions: "Palm (Ancient)", "Hand (US)", "Span (Ancient)", "Fathom (US)", "Rod/Pole/Perch (US)", "Furlong (US)", "League (US)", "Grain (US)", "Pennyweight (Imperial)", "Dram (US)", "Troy Ounce (US)", "Troy Pound (US)", "Fluid Scruple (Imperial)", "Fluid Dram (US)", "Apothecary Ounce (US)", "Jigger (US)", "Firkin (Imperial)", "Hogshead (US)". Also fix "Dan (China volume)" → "Dan (China)" for consistency with other China units.
2. **Reorder units by cultural group** — Within each archaic JSON file, reorder the units array so units are clustered by their country/culture: SI reference unit first, then cultural groups in a logical sequence (e.g. East Asian: Japan → Korea → China; then South/Southeast Asia; then Middle East/Near East; then European regional; then US/Imperial/Ancient). Within each group, keep units sorted by factor (small to large).

## Relevant files
- `client/src/data/conversion/archaic_area.json`
- `client/src/data/conversion/archaic_length.json`
- `client/src/data/conversion/archaic_mass.json`
- `client/src/data/conversion/archaic_volume.json`
