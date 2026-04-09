# Rack Geometry Unit Cleanup

## What & Why
Remove units that are nonsensical for rack geometry sizing, rename "Meter" to "Metre", and keep Parsec as a novelty entry.

## Done looks like
- Angstrom (Å), Light Year (ly), Nautical Mile (nmi), Mile (mi), Astronomical Unit (AU), and Fathom (ftm) no longer appear in the rack geometry unit list
- The base unit "Meter" is renamed to "Metre"
- Parsec remains in the list
- All other rack geometry units (RU, 2U, 4U, 12U, 24U, 42U, inch, foot, foot & inch, yard, U-width, cabinet width) are unchanged

## Out of scope
- Changes to any other quantity category (length, archaic length, etc.)
- Localization file updates for the removed units (they can be left as dead keys)

## Tasks
1. Edit `rack_geometry.json` to remove the six nonsensical units (Å, ly, nmi, mi, AU, ftm), rename "Meter" to "Metre", and leave Parsec in place.

## Relevant files
- `client/src/data/conversion/rack_geometry.json`
