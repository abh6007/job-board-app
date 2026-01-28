# The Job News Application

## Overview

A full-stack job board application built with React frontend and Express backend. The platform allows users to browse job listings, view contact information, and provides an admin dashboard for managing content. Features include job management, social links, automation links, and about me sections with analytics tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints under `/api/*`
- **Authentication**: Replit Auth integration with Passport.js and OpenID Connect
- **Session Management**: express-session with PostgreSQL store (connect-pg-simple)

### Data Storage
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for schema validation
- **Schema Location**: `shared/schema.ts` for shared types between client and server
- **Migrations**: Drizzle Kit (`drizzle-kit push`)

### Key Design Patterns
- **Shared Types**: Schema definitions in `shared/` directory used by both frontend and backend
- **Type-Safe API**: Route definitions with Zod schemas in `shared/routes.ts`
- **Storage Interface**: `IStorage` interface pattern for database operations
- **Admin Authorization**: Middleware-based admin role checking
- **First User Admin**: Automatic admin privileges for first registered user

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/   # UI components
│       ├── hooks/        # Custom React hooks
│       ├── lib/          # Utilities
│       └── pages/        # Route pages
├── server/           # Express backend
│   ├── replit_integrations/  # Auth modules
│   └── *.ts          # Server files
├── shared/           # Shared types and schemas
└── migrations/       # Database migrations
```

## External Dependencies

### Database
- PostgreSQL (provisioned via Replit)
- Connection via `DATABASE_URL` environment variable

### Authentication
- Replit Auth (OpenID Connect)
- Session secret via `SESSION_SECRET` environment variable
- Issuer URL via `ISSUER_URL` environment variable

### UI Component Library
- shadcn/ui with Radix UI primitives
- Configured in `components.json`

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit`: Database ORM and migrations
- `@tanstack/react-query`: Server state management
- `passport` / `openid-client`: Authentication
- `recharts`: Admin dashboard charts
- `framer-motion`: Animations
- `zod`: Runtime validation

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OpenID Connect issuer (defaults to Replit)