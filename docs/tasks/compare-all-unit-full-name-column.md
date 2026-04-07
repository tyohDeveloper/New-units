# Compare All: show full unit name column

## What & Why
The Compare All panel currently shows only the unit symbol on the left and the converted value on the right. Adding the full unit name as a middle column gives users better context — especially for less familiar symbols (e.g., "fur" → "furlong", "fath" → "fathom").

## Done looks like
- Each row in the Compare All panel displays three pieces of information: symbol (left), full unit name (centre), and converted value (right).
- The layout remains clean and readable at the existing panel width; the name column uses a secondary/muted style to keep visual hierarchy intact.
- Clicking a row still selects that unit as before.

## Out of scope
- Any changes to the converter's main input/output rows.
- Sorting or filtering the comparison list.

## Tasks
1. **Add full name column to comparison rows** — In the comparison panel render loop, insert `unit.name` as a centred/muted text element between the symbol and value spans. Adjust the row flex layout so all three columns align neatly (symbol left, name centre, value right).

## Relevant files
- `client/src/features/unit-converter/components/ConverterPane.tsx:503-521`
