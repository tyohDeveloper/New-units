# Code Hygiene & Housekeeping

## What & Why
Address the minor-severity findings from the April 2026 code review that have no bearing on features or architecture — dependency tidying, magic numbers, CSS cross-browser gap, version drift, and a small DRY extraction. These are low-risk, high-clarity improvements.

## Done looks like
- All test/build packages are in `devDependencies`; unused runtime packages are removed
- Dead boilerplate (`queryClient.ts`) is deleted
- The flash duration (300 ms), paste-reset timeout (3000 ms), and default precision (4) are named constants used everywhere they appear rather than magic literals
- `scrollbar-color` and `scrollbar-width` are added to `index.css` so scrollbars render correctly in Firefox
- `package.json` version and the `APP_VERSION` constant in `home.tsx` are in sync
- The `normalizeMassUnit` alias indirection in `useConverterController.ts` is removed — the import is used directly
- A `dimensionsToExponents` utility is extracted from the three locations that repeat the same SI-dimension-to-exponent-key mapping block
- The redundant `.dark {}` CSS block is removed (the app has only one theme; the block duplicates `:root`)

## Out of scope
- Accessibility changes (separate plan)
- Any behaviour or feature changes
- Removing shadcn/ui component files that are unused but harmless (scaffolding, not shipped in prod bundle)

## Tasks
1. **Dependency audit** — Move `@playwright/test`, `@testing-library/*`, `jsdom`, and `vitest` to `devDependencies`. Remove confirmed-unused packages: `next-themes`, `react-day-picker`, `date-fns`, `input-otp`, `cmdk`, `embla-carousel-react`, `react-resizable-panels`, `recharts`, `vaul`, `react-hook-form`, `@hookform/resolvers`, `zod-validation-error`, `lodash`. Delete `client/src/lib/queryClient.ts` and remove its import from `main.tsx`.

2. **Named constants** — Create or extend a shared constants file with `FLASH_DURATION_MS = 300`, `PASTE_RESET_TIMEOUT_MS = 3000`, and `DEFAULT_PRECISION = 4`. Replace all literal occurrences in `UnitConverterApp.tsx`, `ConverterContext.tsx`, `useConverterController.ts`, and any other files that use these bare numbers.

3. **Firefox scrollbar CSS** — Add `scrollbar-color` and `scrollbar-width: thin` declarations to `index.css` alongside the existing WebKit scrollbar rules.

4. **Version sync** — Align `APP_VERSION` in `home.tsx` with the `version` field in `package.json`. Decide on a canonical value (whichever is considered correct) and update the other.

5. **DRY extractions** — Extract the repeated SI-dimension-to-exponent-key mapping block (currently copy-pasted in three places) into `lib/units/dimensionsToExponents.ts` and replace all three call sites. Remove the `normalizeMassUnitHelper` alias layer in `useConverterController.ts` so the import is used under its real name directly.

6. **Remove redundant `.dark` CSS block** — Delete the `.dark {}` block from `index.css` since the application only has one theme and the block is a duplicate of `:root`. Verify no visual regressions.

## Relevant files
- `package.json`
- `client/src/lib/queryClient.ts`
- `client/src/main.tsx`
- `client/src/index.css`
- `client/index.html`
- `client/src/pages/home.tsx`
- `client/src/components/unit-converter/context/ConverterContext.tsx`
- `client/src/features/unit-converter/app/UnitConverterApp.tsx`
- `client/src/features/unit-converter/components/useConverterController.ts`
- `client/src/features/unit-converter/components/DirectPane.tsx`
- `client/src/lib/units/`
