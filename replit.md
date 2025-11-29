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
- **Clipboard Copying**: Supports precision settings and "Normalize & Copy" for normalizing to SI units with optimal prefixing.
- **Math Category**: Includes functions (sin, cos, tan, sqrt, log, ln, exp, abs) and constants (π, e, √2), all producing dimensionless outputs.
- **Fuel Energy Category**: Converts between fuel volumes, masses, and energy units for 8 fuel types (Gasoline, Diesel, Jet Fuel, Kerosene, Ethanol, E-85, Propane, LNG) plus explosive equivalents (TNT, Dynamite). Uses Joule as base unit with Wh (with prefixes for kWh/MWh/GWh), BTU, Therm, and tce/toe.
- **Archaic & Regional Categories**: Four specialized categories for historical and regional units: Archaic Length (cubits, furlongs, Chinese chi/zhang/li, Japanese shaku/ken/ri, Korean ja/ri), Archaic Mass (grains, troy ounce, carat, tola, don, Chinese jin/tael, Japanese momme/kan, Korean geun), Archaic Volume (apothecary units, US kitchen units, bushels, Chinese sheng/dou, Japanese go/sho/koku, Korean doe/mal), Archaic Area (Japanese tatami variants, Korean pyeong, Chinese mu/qing, Israeli dunam, Egyptian feddan/qirat).
- **Type Safety**: End-to-end TypeScript coverage with strict mode and Zod for schema validation.
- **Modularity**: Component-based UI, client-side conversion logic, and plugin-based Vite configuration.

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