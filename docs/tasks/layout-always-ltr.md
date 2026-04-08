# Lock Layout to LTR Always

## What & Why
After the recent Arabic RTL changes, `dir="rtl"` is still being set on `document.documentElement` when the Arabic language is selected. This flips the entire app layout — sidebars, button positions, input alignment, columns — whenever the user switches to Arabic. The app layout must remain identical regardless of the selected language or number format.

## Done looks like
- Switching to Arabic language produces no visible change in the app's structural layout (sidebars, buttons, inputs, columns all stay in the same positions).
- Switching number formats produces no visible change in the app's structural layout.
- The `document.documentElement` always has `dir="ltr"` (or no `dir` attribute), never `dir="rtl"`.
- Arabic text content still reads correctly (the browser will handle bidi text within LTR containers).
- Any `dir="ltr"` overrides that were added as workarounds for the global RTL (e.g., on ft_in displays) are cleaned up if they are no longer necessary.

## Out of scope
- Changes to numeral conversion logic.
- Adding or removing language/format options.
- Explicit per-element `dir="rtl"` styling on text content (not needed if the layout stays LTR throughout).

## Tasks
1. **Remove global `dir` mutation** — Delete the `useEffect` in `UnitConverterApp.tsx` that sets `document.documentElement.dir` to `rtl` or `ltr` based on language. The document root should never be set to `rtl`.

2. **Remove redundant `dir="ltr"` overrides** — Audit `ConverterPane.tsx` and any other components for `dir="ltr"` attributes that were added solely as workarounds for the global RTL. Remove them to keep the codebase clean; keep only any that are genuinely needed for symbol/number ordering correctness independent of layout direction.

3. **Verify no other direction-setting side effects** — Check for any other places in the codebase that set `document.dir`, `document.documentElement.dir`, or apply a CSS `direction: rtl` rule at the root/container level, and remove them.

## Relevant files
- `client/src/features/unit-converter/app/UnitConverterApp.tsx`
- `client/src/features/unit-converter/components/ConverterPane.tsx`
