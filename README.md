# InkFlow AI - AI-Powered Blogging Platform

## Overview

InkFlow AI is a full-stack blogging application that combines a rich text editor with AI-powered content generation and chat assistance. Users can create, edit, and manage blog posts with help from an integrated AI assistant powered by Google's Gemini models through Replit's AI Integrations service.

The application features Replit Auth for user authentication, a PostgreSQL database for persistence, and a modern React frontend with Tailwind CSS styling.

App link: https://ai-blog-helper--spicdt4510.replit.app

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled via Vite
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and mutations
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **Rich Text Editor**: Tiptap with StarterKit and Placeholder extensions
- **Animations**: Framer Motion for page transitions

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Pattern**: RESTful endpoints under `/api/*` prefix
- **Session Management**: express-session with connect-pg-simple for PostgreSQL session storage

### Authentication
- **Provider**: Replit Auth via OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions table
- **User Management**: Automatic user upsert on authentication with profile data from Replit

### Data Storage
- **Database**: PostgreSQL (via Drizzle ORM)
- **Schema Location**: `shared/schema.ts` and `shared/models/*.ts`
- **Migrations**: Drizzle Kit with `drizzle-kit push` for schema sync

### Key Data Models
- **users**: Stores authenticated user profiles (id, email, name, profile image)
- **sessions**: Express session storage for authentication persistence
- **posts**: Blog posts with title, content, published status, and user association
- **conversations/messages**: Chat history for AI assistant interactions

### AI Integration
- **Provider**: Replit AI Integrations (Gemini-compatible API)
- **Models Used**: 
  - `gemini-2.5-flash` for fast text generation and chat
  - `gemini-2.5-flash-image` for image generation
- **Features**: Blog post generation, streaming chat responses, image generation

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: Vite builds frontend to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Path Aliases**: `@/*` maps to client/src, `@shared/*` maps to shared directory

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **Replit Auth**: OpenID Connect authentication via `ISSUER_URL` (defaults to Replit's OIDC)
- **Required Secrets**: `SESSION_SECRET`, `REPL_ID` (auto-provided by Replit)

### AI Services
- **Replit AI Integrations**: Provides Gemini API access
- **Required Secrets**: `AI_INTEGRATIONS_GEMINI_API_KEY`, `AI_INTEGRATIONS_GEMINI_BASE_URL`

### Third-Party Libraries
- **@google/genai**: SDK for Gemini API interactions
- **date-fns**: Date formatting utilities
- **zod**: Runtime type validation for API inputs
- **Radix UI**: Accessible UI primitives used by shadcn/ui components