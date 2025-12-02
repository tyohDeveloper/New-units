# OmniUnit - Universal Converter

## Overview
OmniUnit is a comprehensive, frontend-only unit conversion web application built with React and TypeScript. It supports a vast array of measurement systems, including SI, Imperial, US Customary, Archaic, and specialized industrial units. The application features a "scientific archival" aesthetic and produces a single, standalone HTML file for easy distribution, aiming to provide a universal conversion tool with a strong emphasis on accuracy and usability.

## User Preferences
- Preferred communication style: Simple, everyday language
- Platform context: iPad using Replit iOS app or Chrome browser
- iOS limitation: WebKit causes unreliable WebSockets, HMR is disabled

## System Architecture
### Frontend-Only Architecture
- **Framework & Build System**: React 19 with TypeScript, Vite for building, Wouter for routing, and vite-plugin-singlefile for single-HTML production builds.
- **UI Component System**: shadcn/ui (New York variant) based on Radix UI, styled with Tailwind CSS v4. Supports theming via CSS variables.
- **State Management**: Utilizes local React state (useState, useRef) and custom hooks for reusable logic.
- **Conversion Logic**: Client-side engine featuring a comprehensive unit catalog, dimensional analysis, support for metric prefixes, and a wide range of unit categories including length, mass, time, temperature, area, volume, energy, pressure, and specialized units.

### Key Design Decisions
- **Calculator Layout**: CSS Grid-based, six-column layout with four arithmetic operators (×, /, +, −). Addition and subtraction require dimensional compatibility.
- **Calculator Input Method**: Calculator input fields are READ-ONLY. Data entry is ONLY via copy buttons in Converter or Custom tabs. Direct typing in calculator fields is not supported.
- **Dual Calculator Modes**:
  - **CALCULATOR - UNIT**: Simple mode with three input fields (1, 2, 3) + result field. Copy button fills first available empty field.
  - **CALCULATOR - RPN**: Reverse Polish Notation mode with 4-level stack (s3, s2, y, x). Stack indices: s3=stack[0] (top), s2=stack[1], y=stack[2], x=stack[3] (bottom/result). Copy button lifts stack and pushes value to x position.
- **RPN Button Layout** (7 buttons per row):
  - s3 row: x², x³, x⁴, √/∛/∜ (shift: ∜), 10ˣ/log₁₀, 2ˣ/log₂, rnd/trunc
  - s2 row: sin/asin, cos/acos, tan/atan, sinh/asinh, cosh/acosh, tanh/atanh, ⌊x⌋/⌈x⌉
  - y row: π/Undo, ℯ, √2, ×/×ᵤ, ÷/÷ᵤ, +/+ᵤ, −/−ᵤ (constants push to stack, operators with ᵤ subscript are unit-aware)
- **RPN Undo/Redo**: Shift+π becomes "Undo" button. Each RPN operation saves stack state before executing. Pressing Undo swaps current stack with previous state. Pressing Undo twice = redo (swap back).
- **RPN Button Styling**: Enabled buttons are bright (text-foreground), disabled buttons are dimmed (text-muted-foreground/50). +ᵤ and −ᵤ buttons dim when stack values have incompatible dimensions.
- **Calculator Mode Switching**: Mode labels "CALCULATOR - UNIT ↻" and "CALCULATOR - RPN ↻" are clickable to switch modes (no separate button needed)
- **Trig/Hyperbolic Function Behavior**: If input is dimensionless, rad (angle:1), or sr (solid_angle:1) → output is unitless. If input has other units → function applies to numeric value only, dimensions preserved (e.g., sin(0.5 m²) = 0.479... m²).
- **Rounding Functions**: rnd = banker's rounding (round to nearest even) at precision setting; trunc = truncate at precision setting. Both preserve dimensions.
- **Clipboard Copying**: Supports precision settings and "Normalize & Copy" for normalizing to SI units with optimal prefixing. Uses `normalizeDimensions` to convert raw dimensional formulas to derived units (J, N, W, etc.) before applying prefixes, preventing prefix stacking with kg. Prefers base unit representation s⁻¹ over derived unit Hz for frequency.
- **Math Category**: Includes 28 functions and 3 constants, all producing dimensionless outputs:
  - Trigonometric: sin, cos, tan, asin, acos, atan
  - Hyperbolic: sinh, cosh, tanh, asinh, acosh, atanh
  - Roots: sqrt (√), cbrt (∛), root4 (∜)
  - Powers: square (x²), cube (x³), pow4 (x⁴)
  - Logarithmic/Exponential: log (log₁₀), ln, log2 (log₂), exp
  - Rounding: floor (⌊x⌋), ceil (⌈x⌉), round, trunc
  - Other: abs, sign (sgn)
  - Constants: π, ℯ (Euler's number using Unicode U+212F), √2
- **Fuel Energy Category**: Converts between fuel volumes, masses, and energy units for 8 fuel types (Gasoline, Diesel, Jet Fuel, Kerosene, Ethanol, E-85, Propane, LNG) plus explosive equivalents (TNT, Dynamite). Uses Joule as base unit with Wh (with prefixes for kWh/MWh/GWh), BTU, Therm, and tce/toe.
- **Main Energy Category**: Includes Joule (SI), eV, BTU, cal, kcal, Wh, kWh, Therm, Ton of TNT, Barrel of Oil Equivalent (BOE), Ton of Coal Equivalent (TCE) for industrial/utility applications.
- **Main Power Category**: Includes Watt (SI), BTU per Hour (HVAC), Metric HP, Horsepower, Ton of Refrigeration (cooling industry).
- **Archaic & Regional Categories**: Six specialized categories for historical and regional units: Archaic Length (cubits, furlongs, Chinese chi/zhang/li, Japanese shaku/ken/ri, Korean ja/ri), Archaic Mass (grains, troy ounce, carat, tola, don, Chinese jin/tael, Japanese momme/kan, Korean geun), Archaic Volume (apothecary units, US kitchen units, bushels, Chinese sheng/dou, Japanese go/sho/koku, Korean doe/mal), Archaic Area (Japanese tatami variants, Korean pyeong, Chinese mu/qing, Israeli dunam, Egyptian feddan/qirat), Archaic Energy (Erg, Foot-pound force, Thermie, Quad), Archaic Power (Erg/s, Foot-pound/s, Boiler HP).
- **Type Safety**: End-to-end TypeScript coverage with strict mode and Zod for schema validation.
- **Modularity**: Component-based UI, client-side conversion logic, and plugin-based Vite configuration.
- **SI Prefix Handling**: 
  - Kilogram (kg) is the SI base unit (factor=1) but has NO `allowPrefixes` to prevent stacking (no "milli-kilo-gram")
  - Gram (g) has `allowPrefixes: true` enabling mg, cg, µg, etc. via prefix dropdown
  - Binary prefixes (Ki, Mi, Gi) apply ONLY to Data/Information category
  - All other categories use decimal SI prefixes only (k, M, G, m, µ, etc.)
  - **Dual kg/g unit pattern**: Complex kg-based SI units have gram-based companions with allowPrefixes=true:
    - Density: kg⋅m⁻³ (no prefix) + g⋅m⁻³ (with prefixes, factor=0.001)
    - Momentum: kg⋅m⋅s⁻¹ (no prefix) + g⋅m⋅s⁻¹ (with prefixes, factor=0.001)
    - Specific Heat: J⋅kg⁻¹⋅K⁻¹ (no prefix) + J⋅g⁻¹⋅K⁻¹ (with prefixes, factor=1000 - inverted denominator)
    - When g-based unit + kilo prefix is selected → auto-switches to kg-based unit with no prefix
- **Unit Change Behavior**: When changing From or To unit, prefix resets to 'none' automatically
- **Scientific Notation Display**: Results automatically switch to scientific notation (e.g., 1.0000e-25) when:
  - Value < 1e-6 (very small numbers)
  - Value would round to 0 at current precision (prevents showing "0" for insignificant but non-zero values)
  - Value >= 1e8 (8+ digits in integer part, e.g., 100,000,000+)
  - Precision setting controls significant figures in scientific notation mode
  - Copy function uses same formatting as display for consistency
- **Scientific Notation Input**: Input field accepts scientific notation (e.g., 12e35, 1.5e-10, 3E8, 2.998e+8)
- **CGS Unit Prefixes**: All CGS base units support prefixes (dyne, erg, poise, stokes, gauss, maxwell, oersted, statampere, statvolt, etc.) but pre-prefixed units (centipoise, centistokes) do NOT allow additional prefixes
- **Comparison Mode**: Toggle button ("Compare All") next to the "To" label shows input value converted to up to 8 units simultaneously with optimal prefix display and click-to-copy functionality
- **Smart Paste**: When pasting text anywhere except input fields, `parseUnitText` parses "number unit" text (e.g., "15 km", "2.5e-3 mA") into value, unit, prefix, category, and dimensions. Routes to Converter tab (sets from value/unit/category) or Custom tab (sets value and dimension grid based on parsed dimensions). Handles prefix+symbol combinations and localized unit names.
- **Cross-Domain Dimensional Analysis**: Calculator result dropdown shows related quantity categories that share the same dimensions:
  - Energy ↔ Torque, Photon Energy, Fuel Energy (all have kg⋅m²⋅s⁻²)
  - Frequency ↔ Radioactivity, Radioactive Decay (all have s⁻¹)
  - Pressure ↔ Sound Pressure (all have kg⋅m⁻¹⋅s⁻²)
  - Absorbed Dose ↔ Equivalent Dose, Radiation Dose (all have m²⋅s⁻²)
  - Self-filtering: Each dropdown option excludes its own category (e.g., "J" won't show "Energy" since J already implies Energy)
  - Excluded from cross-domain: Archaic categories, specialty categories (Typography, Cooking, Beer & Wine, etc.), Data, Math
  - CATEGORY_DIMENSIONS maps 50+ categories to their dimensions for cross-domain matching
- **Calculator Module** (`client/src/lib/calculator.ts`): Extracted testable calculator logic:
  - `dimensionsEqual`: Compares dimensional formulas for equality
  - `findCrossDomainMatches`: Finds related quantity categories with matching dimensions
  - `isValidSymbolRepresentation`: Validates SI unit symbol compositions (no duplicate base units)
  - `formatDimensions`: Converts dimensional formulas to SI base unit notation
  - `multiplyDimensions`, `divideDimensions`: Dimensional arithmetic operations
  - `CATEGORY_DIMENSIONS`: Mapping of categories to dimensions and isBase flags
  - `SI_DERIVED_UNITS`: Catalog of named SI derived units with dimensions
- **SI Representation Constraints**:
  - Base unit expression always appears LAST in dropdown options
  - Derived representations cannot have more terms than the base expression
  - Hz completely removed from SI_DERIVED_UNITS - frequency ALWAYS displays as s⁻¹
  - Bq (Becquerel) remains for radioactivity but shares s⁻¹ dimensions
  - Coherent SI derived units rad (plane angle) and sr (solid angle) ARE available
  - Multi-dimension SI derived units (lm, lx, Gy, Sv, kat) are available in calculator dropdowns
- **Photon/Light Category**: Specialized category for photon physics conversions using energy-equivalent representations:
  - Energy: eV (base, with prefixes), J (Joule, 1 J = 6.241509074e18 eV)
  - Frequency: **ν** (Greek nu) - energy-equivalent via E = hν (h = 4.135667696e-15 eV·s)
  - Wavelength: **λ** (Greek lambda) - energy-equivalent via E = hc/λ (hc = 1.239841984e-6 eV·m), inverse relationship, with prefixes for nm
  - Note: Greek symbols (ν, λ) indicate these are photon-specific energy equivalents, not generic frequency/length
- **Typography Category**: 11 units for print/design measurements including point (1/72 inch), pica (12 points), pixel (96 PPI ref), em, twip, cicero, with meter as SI base
- **Cooking Measures Category**: 24 units for kitchen measurements covering US/UK/Metric/Japan variants including teaspoons, tablespoons, cups, fluid ounces, pints, quarts, gallons, with mL as base unit
- **Multilingual Support**: 12 languages with complete translations:
  - en (English UK), en-us (English US), ar (Arabic), de (German), es (Spanish), fr (French), it (Italian), ja (Japanese), ko (Korean), pt (Portuguese), ru (Russian), zh (Chinese)
  - Unit NAMES are translated, but SYMBOLS and SI prefixes remain in Latin/ISO standard
  - Asian units display proper native characters:
    - Japanese: 尺 (shaku), 間 (ken), 里 (ri), 匁 (momme), 貫 (kan), 石 (koku), 畳 (tatami), 坪 (tsubo)
    - Chinese: 寸 (cun), 尺 (chi), 丈 (zhang), 里 (li), 两 (tael), 斤 (jin), 升 (sheng), 斗 (dou), 亩 (mu)
    - Korean: 자 (ja), 리 (ri), 돈 (don), 근 (geun), 홉 (hop), 되 (doe), 말 (mal), 평 (pyeong)

### Build & Deployment
- **TypeScript Configuration**: Strict mode enabled, path alias for client code, ESNext module system.
- **Build Process**: Vite for development, `npm run build` for a single-file production HTML bundle (`dist/public/index.html`).
- **Testing**: Unit tests with Vitest (jsdom environment, React Testing Library matchers) and end-to-end tests with Playwright.

### Project Structure
- `client/src/`: Contains `components/`, `lib/` (utilities, conversion data), `pages/`, and `hooks/`.
- `index.html`: Entry point.
- `main.tsx`: React root.

## External Dependencies
### UI Libraries
- **Radix UI**: Primitives for accessible UI components (accordion, dialog, dropdown, popover, select, tooltip).
- **Lucide React**: Iconography.
- **cmdk**: Command palette functionality.
- **class-variance-authority** and **clsx**: For conditional styling.

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Error overlay.
- **@replit/vite-plugin-cartographer** and **@replit/vite-plugin-dev-banner**: Replit integration.
- **vite-plugin-singlefile**: For single HTML file production builds.

### Form Handling
- **react-hook-form**: Form state management.
- **@hookform/resolvers**: Validation integration.
- **zod**: Schema validation.

### Styling
- **@tailwindcss/vite**: Tailwind CSS v4 integration.
- **autoprefixer**: CSS vendor prefixing.
- **tailwindcss-animate**: Animation utilities.
- **Custom fonts**: Space Grotesk, IBM Plex Mono, Inter.