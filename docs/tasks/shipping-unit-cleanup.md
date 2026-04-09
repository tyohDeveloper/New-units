# Shipping Container Unit Cleanup

## What & Why
Remove units from the Shipping Containers category that are more than one order of magnitude away from a TEU (6.096 m), leaving only units relevant to container sizing.

## Done looks like
- The following units no longer appear in the shipping containers list: Angstrom (Å), Inch (in), Link (li), Foot (ft), Foot & Inch (ft'in"), Furlong (fur), Mile (mi), Nautical Mile (nmi), Astronomical Unit (AU), Light Year (ly), Parsec
- Remaining units: Metre (m), Yard (yd), Fathom (ftm), TEU Width, DEU Width, TEU Height, DEU Height, Rod (rd), TEU (6.096 m), DEU (12.192 m), Chain (ch)

## Out of scope
- Changes to any other quantity category
- Renaming "Meter" to "Metre" (not requested for this category)
- Localization file cleanup for removed units

## Tasks
1. Edit `shipping.json` to remove the eleven out-of-range units listed above, leaving all container-relevant units intact.

## Relevant files
- `client/src/data/conversion/shipping.json`
