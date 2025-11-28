# OmniUnit - Universal Converter

## Overview

OmniUnit is a comprehensive unit conversion web application that enables conversions across a wide range of measurement systems including SI units, Imperial, US Customary, Archaic, and specialized industrial units. The application is built as a frontend-only TypeScript project with React, designed with a "scientific archival" aesthetic theme. Production builds create a single standalone HTML file for easy distribution.

**Current Version:** v2.5.0

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
- CSS Grid with four-column layout for perfect vertical alignment
- Clear buttons left-aligned using `justify-self: start`
- Copy button on separate row below result using flex justify-end
- CSS constants: CommonFieldWidth 380px, FIELD_HEIGHT 2.5rem/40px, OperatorBtnWidth 36px, ClearBtnWidth 100px

**Clipboard Copying**
- Respects precision settings when copying values

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

- v2.5.0: Converted to frontend-only architecture, removed Express backend and database dependencies
- Configured single-file production builds via vite-plugin-singlefile
- Calculator layout refinements with CSS Grid
- Copy button text simplified to "Copy" in converter section
