# OmniUnit - Universal Converter

## Overview

OmniUnit is a comprehensive unit conversion web application that enables conversions across a wide range of measurement systems including SI units, Imperial, US Customary, Archaic, and specialized industrial units. The application is built as a full-stack TypeScript project with a React frontend and Express backend, designed with a "scientific archival" aesthetic theme.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server, configured for hot module replacement and optimized production builds
- **Wouter** for client-side routing (lightweight alternative to React Router)
- **TanStack Query** for server state management and data fetching

**UI Component System**
- **shadcn/ui** component library (New York variant) built on Radix UI primitives
- **Tailwind CSS v4** for styling with custom design tokens
- Component architecture supports theming through CSS variables for colors, fonts, and spacing
- Design system uses a neutral base color with scientific/archival aesthetic

**State Management Pattern**
- React Query for asynchronous state and server communication
- Local React state (useState, useRef) for UI interactions
- Custom hooks pattern for reusable logic (e.g., `use-mobile`, `use-toast`)

**Conversion Logic**
- Client-side conversion engine with comprehensive unit catalog
- Dimensional analysis system for tracking physical dimensions across conversions
- Support for metric prefixes (kilo, mega, milli, etc.)
- Multiple unit categories: length, mass, time, temperature, area, volume, energy, pressure, and many specialized units

### Backend Architecture

**Server Framework**
- **Express.js** as the HTTP server framework
- Dual-mode server setup:
  - Development mode (`index-dev.ts`): Vite middleware integration for HMR
  - Production mode (`index-prod.ts`): Serves pre-built static assets
- Custom logging middleware for request/response tracking

**API Structure**
- RESTful API design pattern (routes prefixed with `/api`)
- Modular route registration system via `registerRoutes`
- Storage abstraction layer for data persistence

**Data Persistence**
- **Drizzle ORM** configured for PostgreSQL dialect
- Schema-first approach with TypeScript type inference
- Zod integration for runtime validation via `drizzle-zod`
- Currently implements in-memory storage (`MemStorage`) with interface for database implementation
- User schema example included (username/password fields with UUID primary key)

**Session Management**
- `connect-pg-simple` for PostgreSQL-backed session storage
- Prepared for authentication implementation

### Build & Deployment

**TypeScript Configuration**
- Strict mode enabled for type safety
- Path aliases configured: `@/` for client code, `@shared/` for shared types
- ESNext module system with bundler resolution
- Incremental compilation for faster rebuilds

**Build Process**
1. Client build: Vite compiles React app to `dist/public`
2. Server build: esbuild bundles Express server to `dist/index.js`
3. Production mode serves static files and falls back to index.html for client-side routing

**Development Workflow**
- Separate dev scripts for client (`dev:client`) and full-stack (`dev`)
- Database schema changes via `db:push` command
- Type checking via `check` script

### Design Patterns

**Separation of Concerns**
- Shared schema definitions in `/shared` for type consistency
- Client/server boundary clearly defined
- UI components separated from business logic

**Type Safety**
- End-to-end TypeScript coverage
- Schema validation with Zod
- Drizzle ORM type inference for database queries

**Modularity**
- Component-based UI architecture
- Storage interface abstraction for swappable implementations
- Plugin-based Vite configuration

## External Dependencies

### Database
- **PostgreSQL** via Neon serverless driver (`@neondatabase/serverless`)
- Connection configured through `DATABASE_URL` environment variable
- Drizzle Kit for schema migrations

### UI Libraries
- **Radix UI** primitives for accessible component foundations (accordion, dialog, dropdown, popover, select, tooltip, etc.)
- **Lucide React** for iconography
- **cmdk** for command palette functionality
- **embla-carousel-react** for carousel components
- **vaul** for drawer components
- **date-fns** for date manipulation
- **class-variance-authority** and **clsx** for conditional styling

### Development Tools
- **@replit/vite-plugin-runtime-error-modal** for error overlay in development
- **@replit/vite-plugin-cartographer** and **@replit/vite-plugin-dev-banner** for Replit integration
- **esbuild** for server bundling
- **tsx** for TypeScript execution in development

### Form Handling
- **react-hook-form** for form state management
- **@hookform/resolvers** for validation integration

### Styling
- **@tailwindcss/vite** for Tailwind CSS v4 integration
- **autoprefixer** for CSS vendor prefixing
- **tailwindcss-animate** for animation utilities
- Custom fonts: Space Grotesk, IBM Plex Mono, Inter