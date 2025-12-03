# OmniUnit - Universal Converter

## Overview
OmniUnit is a comprehensive, frontend-only unit conversion web application built with React and TypeScript. Its primary purpose is to provide a universal conversion tool with a "scientific archival" aesthetic, supporting a vast array of measurement systems including SI, Imperial, US Customary, Archaic, and specialized industrial units. The application produces a single, standalone HTML file for easy distribution, emphasizing accuracy and usability.

## User Preferences
- Preferred communication style: Simple, everyday language
- Platform context: iPad using Replit iOS app or Chrome browser
- iOS limitation: WebKit causes unreliable WebSockets, HMR is disabled

## System Architecture
### Frontend-Only Architecture
- **Framework & Build System**: React 19 with TypeScript, Vite for building, Wouter for routing, and vite-plugin-singlefile for single-HTML production builds.
- **UI Component System**: shadcn/ui (New York variant) based on Radix UI, styled with Tailwind CSS v4. Theming is supported via CSS variables.
- **State Management**: Local React state (useState, useRef) and custom hooks are used.
- **Conversion Logic**: Client-side engine featuring a comprehensive unit catalog, dimensional analysis, metric prefix support, and a wide range of unit categories (length, mass, time, temperature, area, volume, energy, pressure, specialized units).

### Key Design Decisions
- **Calculator Layout**: CSS Grid-based, six-column layout with four arithmetic operators. Addition and subtraction require dimensional compatibility.
- **Calculator Input**: Fields are read-only; data entry is only via copy buttons from Converter or Custom tabs.
- **Dual Calculator Modes**: "UNIT" mode (three input fields + result) and "RPN" (Reverse Polish Notation) mode with a 4-level stack. Both modes support unit-aware operations.
- **RPN Features**: Includes trigonometric, hyperbolic, power, root, and rounding functions. An undo/redo mechanism is implemented.
- **Trigonometric/Hyperbolic Functions**: Preserve dimensions if input has units other than dimensionless, rad, or sr; otherwise, output is unitless.
- **Rounding Functions**: `rnd` (banker's rounding) and `trunc` (truncate) preserve dimensions.
- **Clipboard Copying**: Supports precision settings and "Normalize & Copy" for converting to SI units with optimal prefixing and dimensional analysis to derived units (J, N, W, etc.).
- **Unit Categories**: Includes dedicated categories for Math (dimensionless output), Fuel Energy, Main Energy, Main Power, Archaic & Regional units (Length, Mass, Volume, Area, Energy, Power), Photon/Light, Typography, and Cooking Measures.
- **Type Safety**: End-to-end TypeScript coverage with strict mode and Zod for schema validation.
- **Modularity**: Component-based UI, client-side conversion logic, and plugin-based Vite configuration.
- **SI Prefix Handling**: Kilogram (kg) does not allow prefixes to prevent stacking. Gram (g) allows prefixes. Binary prefixes (Ki, Mi, Gi) are exclusive to the Data/Information category. Complex kg-based SI units have g-based companions that allow prefixes and auto-switch to kg when a kilo prefix is selected. Prefixes reset to 'none' when changing units.
- **Scientific Notation**: Automatically displays for very small (<1e-6), very large (>=1e8), or values that would round to zero. Precision setting controls significant figures. Input also accepts scientific notation.
- **CGS Unit Prefixes**: Most CGS base units support prefixes, but pre-prefixed units (e.g., centipoise) do not allow additional prefixes.
- **Comparison Mode**: Allows simultaneous conversion of input to up to 8 units with optimal prefix display.
- **Smart Paste**: Parses "number unit" text into value, unit, prefix, category, and dimensions, directing to appropriate tabs.
- **Symbol Conflict Prevention**: Unit symbols are unique to prevent overwrites, with specific naming conventions for half-life, poise, and minim.
- **Cross-Domain Dimensional Analysis**: Calculator result dropdown shows related quantity categories with matching dimensions (e.g., Energy ↔ Torque). Certain categories (Archaic, specialty, Data, Math) are excluded.
- **Calculator Module**: Extracted logic for dimensional analysis, formatting, and arithmetic operations.
- **SI Representation Constraints**: Base unit expressions appear last in dropdowns. Derived representations cannot have more terms than the base. Frequency displays as s⁻¹, with Bq (Becquerel) for radioactivity sharing s⁻¹ dimensions. Coherent SI derived units (rad, sr, lm, lx, Gy, Sv, kat) are available.
- **Multilingual Support**: Supports 12 languages with translated unit names, while symbols and SI prefixes remain standard. Asian units display native characters.

### Build & Deployment
- **TypeScript Configuration**: Strict mode, path aliases, ESNext modules.
- **Build Process**: Vite for development; `npm run build` generates a single `dist/public/index.html` file.
- **Testing**: Extensive unit (Vitest, React Testing Library) and end-to-end (Playwright) tests covering conversion, localization, calculator logic, formatting, smart paste, RPN, edge cases, math functions, and precision comparison.

## External Dependencies
### UI Libraries
- **Radix UI**: Primitives for accessible UI components.
- **Lucide React**: Iconography.
- **cmdk**: Command palette functionality.
- **class-variance-authority** and **clsx**: Conditional styling.

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Error overlay.
- **@replit/vite-plugin-cartographer** and **@replit/vite-plugin-dev-banner**: Replit integration.
- **vite-plugin-singlefile**: Single HTML file production builds.

### Form Handling
- **react-hook-form**: Form state management.
- **@hookform/resolvers**: Validation integration.
- **zod**: Schema validation.

### Styling
- **@tailwindcss/vite**: Tailwind CSS v4 integration.
- **autoprefixer**: CSS vendor prefixing.
- **tailwindcss-animate**: Animation utilities.
- **Custom fonts**: Space Grotesk, IBM Plex Mono, Inter.
