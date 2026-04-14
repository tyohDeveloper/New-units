# Accessibility Fundamentals

## What & Why
The April 2026 code review rated accessibility as the only Critical finding. The app currently has almost no ARIA instrumentation on its custom interactive elements, prevents user zoom, and has a broken tab-focus order. These are baseline web-standards requirements — especially important for a precision numeric tool where users may rely on keyboard navigation or assistive technology.

## Done looks like
- Users on mobile can pinch-zoom the app (the `maximum-scale=1` restriction is gone)
- Every icon-only button has a visible accessible name readable by a screen reader (swap, copy, all calculator key buttons that currently have no label)
- The live conversion result is announced by screen readers when it changes (no manual page refresh needed)
- Tab key moves through controls in logical DOM order — no positive `tabIndex` values remain
- Clickable `<div>` / `<motion.div>` elements that act as buttons are replaced with actual `<button>` elements
- The tab navigation (Converter / Calculator / Direct) is wrapped in a `<nav>` element with a label
- The app title in the header uses a heading element at the correct level, not a `<span>`
- Skip-to-main-content link is present for keyboard users

## Out of scope
- Light/dark theme toggle or any visual redesign
- Color contrast remediation (requires design decisions; track separately if a contrast audit reveals failures)
- Full WCAG 2.1 AA certification — this plan covers the clearly identified gaps, not an exhaustive audit
- Adding an automated axe-core test suite (desirable future work)

## Tasks
1. **Remove zoom prevention** — Delete `maximum-scale=1` from the viewport meta tag in `client/index.html`. This is a one-character fix and a WCAG 1.4.4 violation.

2. **Label icon-only buttons** — Add `aria-label` (using the existing translation function `t()`) and `aria-hidden="true"` on the inner icon to every button that has no visible text label: the swap button in ConverterPane, all copy-to-clipboard buttons, and any calculator key buttons (shift, clear, enter, etc.) that are currently icon-only.

3. **Add `aria-live` to the result display** — Wrap or annotate the conversion result output element with `aria-live="polite"` so screen readers announce the updated value when the input changes without requiring a page reload.

4. **Fix tab order — remove positive `tabIndex` values** — Replace all instances of `tabIndex={1}` through `tabIndex={7}` (found in ConverterPane and related components) with either `tabIndex={0}` or no `tabIndex` at all, relying on natural DOM order. Verify the resulting focus sequence is logical.

5. **Replace clickable `<div>`s with `<button>`s** — In ConverterPane, the copy-factor buttons use `<motion.div onClick={...}>`. Convert these to `<motion.button>` (Framer Motion supports this) so they receive keyboard events, focus styles, and the implicit button role.

6. **Add `<nav>` landmark and skip link** — Wrap the Converter / Calculator / Custom Entry tab switcher in a `<nav aria-label="...">` element. Add a visually-hidden skip-to-content `<a>` link as the first child of `<body>` that jumps to the `<main>` landmark.

7. **Fix heading hierarchy** — The app title "OmniUnit & Calculator" in the header is currently a `<span>`. Change it to an appropriate heading element (or verify the existing `<h1>` usage in the category name is correct and adjust the hierarchy accordingly so it reads logically top to bottom).

## Relevant files
- `client/index.html`
- `client/src/pages/home.tsx`
- `client/src/features/unit-converter/app/UnitConverterApp.tsx`
- `client/src/features/unit-converter/components/ConverterPane.tsx`
- `client/src/features/unit-converter/components/CalculatorPane.tsx`
- `client/src/features/unit-converter/components/DirectPane.tsx`
