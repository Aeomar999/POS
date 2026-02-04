# Silicon Technologies POS

## Overview

Silicon Technologies POS is a full-stack Point of Sale system designed for an IT equipment and networking solutions business. The application manages product inventory (networking hardware, CCTV cameras, intercoms), services, sales transactions, and staff with role-based access control. It features a React frontend with a modern UI component library and an Express backend with PostgreSQL database storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## Documentation

- [Local Setup Instructions](./LOCAL_SETUP.md) - Guide for hosting the software on a local machine.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state and caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming (light/dark mode support)
- **Build Tool**: Vite for development and production builds

The frontend follows a page-based structure with shared components. Role-based access is implemented client-side through a RoleGuard component that checks staff user permissions before rendering protected routes.

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Replit Auth integration using OpenID Connect (OIDC) with Passport.js
- **Session Management**: PostgreSQL-backed sessions via connect-pg-simple

The backend uses a layered architecture:
- `routes.ts` - API endpoint definitions with role-based middleware
- `storage.ts` - Data access layer implementing the IStorage interface
- `db.ts` - Database connection using node-postgres pool

### Authentication & Authorization
- **Authentication**: Replit Auth provides user identity through OIDC
- **Authorization**: Three-tier role system (admin, manager, sales) with middleware-based access control
- **Session Storage**: Sessions stored in PostgreSQL `sessions` table with 7-day TTL

Staff users are separate from auth users - the `staffUsers` table links to auth users via `authUserId` and stores role/permission data.

### Data Model
Core entities defined in `shared/schema.ts`:
- **staffUsers**: Employee accounts with roles (admin/manager/sales)
- **products**: Inventory items with categories (networking/cctv/intercom/services)
- **services**: Service offerings with pricing and duration
- **sales**: Transaction records with status tracking
- **saleItems**: Line items linking products/services to sales

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: Custom build script using esbuild for server bundling and Vite for client

## External Dependencies

### Database
- **PostgreSQL**: Primary data store accessed via `DATABASE_URL` environment variable
- **Drizzle Kit**: Schema migrations via `db:push` command

### Authentication
- **Replit Auth**: OIDC provider (requires `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET` environment variables)

### UI Libraries
- **Radix UI**: Headless component primitives (accordion, dialog, dropdown, etc.)
- **Recharts**: Data visualization for dashboard and reports
- **Embla Carousel**: Carousel component
- **React Day Picker**: Calendar/date picker
- **React Hook Form + Zod**: Form handling with schema validation

### Runtime Dependencies
- **express-session**: Session middleware
- **passport**: Authentication middleware
- **openid-client**: OIDC client for Replit Auth
- **memoizee**: Caching for OIDC configuration