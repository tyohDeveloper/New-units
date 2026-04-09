# Update SI Fuel Unit Symbols to "petrol"

## What & Why
The fuel energy unit symbols in the data file use "(gas)" for both US common and SI units. The convention should distinguish between the two: US common units (gallon, lb) keep "(gas)", while SI units (litre, kilogram) should use "(petrol)" to reflect regional naming. Litre continues to use the capital `L` symbol.

## Done looks like
- The litre of gasoline symbol shows `L (petrol)` instead of `L (gas)`
- The kilogram of gasoline symbol shows `kg (petrol)` instead of `kg (gas)`
- US common units `lb (gas)` and `gal (gas)` remain unchanged

## Out of scope
- Changing unit names or conversion factors
- Updating diesel, jet, or any other fuel type symbols
- Changes to any other unit categories

## Tasks
1. In `fuel.json`, update the symbol for `l_gasoline` from `L (gas)` to `L (petrol)` and the symbol for `kg_gasoline` from `kg (gas)` to `kg (petrol)`.
2. Check if the symbols appear in any localization files and update them there too if needed.

## Relevant files
- `client/src/data/conversion/fuel.json:178-191`
- `client/src/data/localization/units/en.json`
