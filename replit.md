# OmniUnit - Universal Converter

## Overview

OmniUnit is a comprehensive unit conversion web application that enables conversions across a wide range of measurement systems including SI units, Imperial, US Customary, Archaic, and specialized industrial units. The application is built as a frontend-only TypeScript project with React, designed with a "scientific archival" aesthetic theme. Production builds create a single standalone HTML file for easy distribution.

**Current Version:** v2.16.0

## User Preferences

- Preferred communication style: Simple, everyday language
- Platform context: iPad using Replit iOS app or Chrome browser
- iOS limitation: WebKit causes unreliable WebSockets, HMR is disabled

## System Architecture

### Frontend-Only Architecture

**Framework & Build System**
- **React 19** with TypeScript for the UI layer
- **Vite** as the build tool and development server
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **vite-plugin-singlefile** creates single HTML file for production distribution

**UI Component System**
- **shadcn/ui** component library (New York variant) built on Radix UI primitives
- **Tailwind CSS v4** for styling with custom design tokens
- Component architecture supports theming through CSS variables for colors, fonts, and spacing
- Design system uses a neutral base color with scientific/archival aesthetic

**State Management Pattern**
- Local React state (useState, useRef) for UI interactions
- Custom hooks pattern for reusable logic (e.g., `use-mobile`, `use-toast`)

**Conversion Logic**
- Client-side conversion engine with comprehensive unit catalog
- Dimensional analysis system for tracking physical dimensions across conversions
- Support for metric prefixes (kilo, mega, milli, etc.)
- Multiple unit categories: length, mass, time, temperature, area, volume, energy, pressure, and many specialized units

### Key Design Decisions

**Calculator Layout**
- CSS Grid with six-column layout for perfect vertical alignment (value field + 4 operators + clear button)
- All four arithmetic operators: × (multiplication), / (division), + (addition), − (subtraction)
- Addition and subtraction enabled only when operands share the same physical dimension or one is dimensionless
- Clear buttons left-aligned using `justify-self: start`
- Copy button on separate row below result using flex justify-end
- CSS constants: CommonFieldWidth 285px, FIELD_HEIGHT 2.5rem/40px, OperatorBtnWidth 32px, ClearBtnWidth 100px

**Clipboard Copying**
- Respects precision settings when copying values
- Normalize & Copy: normalizes to SI units, applies optimal prefix, copies result

**Math Category**
- Positioned at top of "Other" group for easy access
- Math functions: sin, cos, tan, sqrt, log, ln, exp, abs (input number → dimensionless output)
- Mathematical constants: π (pi), e (Euler's number), √2 (square root of 2) - input multiplied by constant
- All math outputs are dimensionless (empty dimensional formula {})

### Build & Deployment

**TypeScript Configuration**
- Strict mode enabled for type safety
- Path alias configured: `@/` for client code
- ESNext module system with bundler resolution
- Incremental compilation for faster rebuilds

**Build Process**
- Development: Vite serves files separately for fast iteration
- Production: `npm run build` creates single standalone HTML file (~688KB)
- Output: `dist/public/index.html` contains all CSS/JS inlined

**Scripts**
- `npm run dev` - Start development server on port 5000
- `npm run build` - Build single-file production bundle
- `npm run preview` - Preview production build locally
- `npm run check` - TypeScript type checking
- `npm run test` - Run unit tests with Vitest
- `npm run test:e2e` - Run end-to-end tests with Playwright

### Testing

**Unit Testing (Vitest)**
- Configuration in `vitest.config.ts` with jsdom environment
- Test setup file at `tests/setup.ts` for React Testing Library matchers
- Sample tests in `tests/conversion.test.ts` verify conversion data and logic
- Run with `npm run test` or `npm run test -- --watch` for watch mode

**End-to-End Testing (Playwright)**
- Configured for browser-based testing
- Run with `npm run test:e2e`

### Project Structure

```
client/
├── src/
│   ├── components/     # UI components including unit-converter.tsx
│   ├── lib/            # Utilities and conversion-data.ts
│   ├── pages/          # Page components
│   └── hooks/          # Custom React hooks
├── index.html          # Entry point
└── main.tsx            # React root
```

### Design Patterns

**Type Safety**
- End-to-end TypeScript coverage
- Schema validation with Zod where needed

**Modularity**
- Component-based UI architecture
- All conversion logic in client-side modules
- Plugin-based Vite configuration

## External Dependencies

### UI Libraries
- **Radix UI** primitives for accessible component foundations (accordion, dialog, dropdown, popover, select, tooltip, etc.)
- **Lucide React** for iconography
- **cmdk** for command palette functionality
- **class-variance-authority** and **clsx** for conditional styling

### Development Tools
- **@replit/vite-plugin-runtime-error-modal** for error overlay in development
- **@replit/vite-plugin-cartographer** and **@replit/vite-plugin-dev-banner** for Replit integration
- **vite-plugin-singlefile** for single HTML file production builds

### Form Handling
- **react-hook-form** for form state management
- **@hookform/resolvers** for validation integration
- **zod** for schema validation

### Styling
- **@tailwindcss/vite** for Tailwind CSS v4 integration
- **autoprefixer** for CSS vendor prefixing
- **tailwindcss-animate** for animation utilities
- Custom fonts: Space Grotesk, IBM Plex Mono, Inter

## Recent Changes

- v2.16.0: Added 7 new physics/engineering categories: Radioactive Decay, Cross-Section, Kinematic Viscosity, Electric Field Strength, Magnetic Field Strength (H), Sound Intensity, Acoustic Impedance
- v2.16.0: Radioactive Decay category with half-life ↔ decay constant ↔ mean lifetime conversions using inverse relationships (t½ = ln(2)/λ, τ = 1/λ)
- v2.16.0: Cross-Section category with barn (10⁻²⁸ m²), femtobarn, and square meter units for particle physics
- v2.16.0: Kinematic Viscosity with Stokes (St), centistokes (cSt), and m²/s
- v2.16.0: Electric Field Strength with V/m, kV/m, kV/cm, statV/cm
- v2.16.0: Magnetic Field Strength (H) with A/m and Oersted (1 Oe ≈ 79.58 A/m)
- v2.16.0: Sound Intensity with W/m², W/cm², reference intensity I₀ (10⁻¹² W/m²)
- v2.16.0: Acoustic Impedance with Rayl, MRayl, Pa·s/m
- v2.16.0: Removed separate nm_wave unit from Photon/Light - use nano prefix on meter wavelength instead (avoids prefix stacking)
- v2.16.0: Moved Photon/Light category from Electricity & Magnetism to Radiation & Physics group
- v2.16.0: Unit tests expanded to 185 tests (added tests for all new categories)
- v2.15.0: Auto-prefix selection: Converter automatically chooses optimal prefix when result calculated (e.g., 1000 m → 1 km)
- v2.15.0: Precision-aware prefix selection: Auto-selects smaller prefixes to avoid values displaying as 0.0000
- v2.15.0: Added Photon/Light category with wavelength (m), frequency (Hz), and energy (eV) units using inverse conversion (E = hc/λ)
- v2.15.0: Added electron volt (eV) to Energy category (1.602176634e-19 J, SI prefixes enabled)
- v2.15.0: Added electron volt mass equivalent (eV/c²) to Mass category (1.78266192e-36 kg, SI prefixes enabled)
- v2.15.0: Removed "Evaluate & Copy" button from calculator (Normalize & Copy and Copy buttons remain)
- v2.15.0: User can override auto-prefix by manually selecting a different prefix; auto-selection re-enabled on unit change
- v2.15.0: Unit tests expanded to 166 tests (added findOptimalPrefix, photon conversions, eV conversions)
- v2.14.0: Added Glass (Wine) unit to Beer & Wine category (150ml = 0.00015 m³)
- v2.14.0: Moved Lightbulb Efficiency and Fuel Economy from Human Response group to Other group
- v2.14.0: Normalize & Copy now selects optimal SI prefix to minimize digit count (e.g., 1500000 J → 1.5 MJ)
- v2.14.0: Added findOptimalPrefix helper that keeps values in [1, 1000) range for minimal digits
- v2.14.0: Production build size: 684KB standalone HTML file (205KB gzipped)
- v2.13.0: Greedy normalization algorithm decomposes complex dimensional formulas using SI derived units (e.g., kg·m³·s⁻² → m²·N)
- v2.13.0: Normalization outputs formatted as positive_base·derived·negative_base (derived units between positive and negative base units)
- v2.13.0: NORMALIZABLE_DERIVED_UNITS catalog with 17 SI derived units sorted by complexity (F, Ω, S, V, H, Wb, W, J, lx, Gy, Pa, N, T, C, kat, lm, Hz)
- v2.13.0: Removed duplicate Bq (same dimensions as Hz) and Sv (same dimensions as Gy) to avoid ambiguity
- v2.13.0: toSuperscript helper extracted to module scope for use in both formatDimensions and normalizeDimensions
- v2.12.0: Calculator action buttons split layout - Normalize & Copy aligned to calculator field width, Evaluate & Copy and Copy at far right of page
- v2.12.0: Copy handlers (executeAndCopy, normalizeAndCopy) now apply precision and update calculator field before copying
- v2.12.0: Math category "to" dropdown now only shows "Number" (other math functions only in "from" dropdown)
- v2.12.0: Removed footer section ("Designed for Precision & History")
- v2.11.0: Created separate "Beer & Wine" category with all volume units plus beer/wine-specific units (under Other group)
- v2.11.0: Removed beer/wine checkbox from Volume category (now a dedicated category)
- v2.11.0: Rack Geometry and Shipping Containers now include all standard length units plus specialized units
- v2.11.0: All 3 action buttons (Normalize & Copy, Evaluate & Copy, Copy) consolidated to single row below result
- v2.11.0: Renamed "Execute & Copy" to "Evaluate & Copy"
- v2.10.0: Calculator action buttons (Copy, Normalize & Copy, Execute & Copy) moved to dedicated row below result field
- v2.10.0: Added "Normalize & Copy" button that simplifies complex dimensions to SI derived units (e.g., kg·m·s⁻² → N)
- v2.9.0: Calculator operators reordered to × / + − (multiplication/division first, then addition/subtraction)
- v2.9.0: Math category now at top of "Other" group with math functions (sin, cos, tan, sqrt, log, ln, exp, abs) and constants (π, e, √2)
- v2.9.0: Evaluate & Copy button: evaluates calculator, copies result, clears fields, moves result to field 1
- v2.9.0: Rack Geometry and Shipping Containers show only specialized units (TEU, DEU, U, 2U, 4U, etc.); base units removed from dropdowns
- v2.9.0: Fixed executeAndCopy to handle zero-valued results and reset stale result metadata
- v2.8.0: Added addition (+) and subtraction (−) operators to calculator
- v2.8.0: Dimensional compatibility checking for additive operations (enabled only for same-dimension operands or dimensionless values)
- v2.8.0: Renamed "Unitless Number" category to "Math" for dimensionless calculations
- v2.8.0: OperatorBtnWidth reduced from 36px to 32px to fit 4 operators
- v2.7.0: Added Rack Geometry category for computing facility planning (U, 2U, 4U, physical dimensions, standard rack sizes 42U/24U/12U)
- v2.7.0: Added Shipping Containers category with TEU/DEU dimensions (length, width, height for 20ft and 40ft containers)
- v2.7.0: Added Unitless Number category for dimensionless calculations
- v2.7.0: Renamed "Computing" group to "Other"
- v2.7.0: Binary prefixes (Ki, Mi, Gi, Ti, Pi, Ei) now exclusive to Data/Information category
- v2.7.0: Reduced CommonFieldWidth from 380px to 285px (25% reduction)
- v2.6.0: Added 9 new quantity categories (Frequency, Angular Velocity, Momentum, Thermal Conductivity, Specific Heat, Entropy, Concentration, Data, Fuel Economy)
- v2.6.0: Changed default precision from 8 to 4 decimal places
- v2.6.0: Added comprehensive tests for SI base units, base factors, and arrow key navigation (132 tests total)
- v2.5.0: Converted to frontend-only architecture, removed Express backend and database dependencies
- Configured single-file production builds via vite-plugin-singlefile
- Calculator layout refinements with CSS Grid
- Copy button text simplified to "Copy" in converter section
