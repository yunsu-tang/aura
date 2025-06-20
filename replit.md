# AI Dating Coach CRM Dashboard

## Overview

This is a React-based web application that functions as a CRM-style dashboard for an AI Dating Coach tool. The application helps users manage their dating prospects through different relationship stages with AI-powered coaching insights and emotional check-ins.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Drag & Drop**: react-beautiful-dnd for lead stage management
- **UI Components**: Radix UI primitives with custom styling

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints
- **Middleware**: Express middleware for logging and error handling
- **Build System**: Vite for frontend bundling, esbuild for backend compilation

### Data Storage
- **Database**: PostgreSQL (configured via Drizzle ORM)
- **ORM**: Drizzle ORM with Zod validation
- **Schema**: Shared TypeScript schema definitions between client and server
- **Fallback**: In-memory storage implementation for development

## Key Components

### Database Schema
- **leads**: Main entity storing dating prospects with stages (lust, labor, loyal, dead)
- **emotionalCheckins**: Daily emotional wellness tracking
- **users**: User authentication system (compatibility layer)

### API Endpoints
- `GET /api/leads` - Retrieve all leads
- `POST /api/leads` - Create new lead
- `PATCH /api/leads/:id/stage` - Update lead stage and position
- `PUT /api/leads/:id` - Update lead information
- `DELETE /api/leads/:id` - Remove lead
- `POST /api/checkins` - Create emotional check-in
- `GET /api/checkins/today` - Get today's check-in

### Frontend Components
- **Dashboard**: Main CRM interface with drag-and-drop stages
- **LeadCard**: Individual prospect cards with ROI and AI suggestions
- **Navigation**: Top bar with emotional check-in and coach call buttons
- **Modals**: Emotional check-in, coach call simulation, and AI detail views

## Data Flow

1. **Lead Management**: Users create leads that are stored in PostgreSQL and displayed in stage columns
2. **Drag & Drop**: Lead stage changes trigger API calls to update database position and stage
3. **Real-time Updates**: React Query automatically refetches data after mutations
4. **AI Suggestions**: Pre-populated coaching advice displayed based on lead stage and data
5. **Emotional Tracking**: Daily check-ins stored separately and tracked over time

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **react-beautiful-dnd**: Drag and drop functionality
- **@radix-ui/***: Accessible UI component primitives
- **date-fns**: Date manipulation and formatting
- **wouter**: Lightweight routing solution

### Development Tools
- **Vite**: Frontend build tool and dev server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first CSS framework
- **PostCSS**: CSS processing and optimization

## Deployment Strategy

### Development Environment
- Uses Vite dev server for hot module replacement
- Express server runs on port 5000
- PostgreSQL database provisioned via Replit
- Environment variables managed through `.env` files

### Production Build
- Frontend: Vite builds static assets to `dist/public`
- Backend: esbuild bundles server code to `dist/index.js`
- Single production server serves both API and static files
- Database migrations applied via `drizzle-kit push`

### Replit Configuration
- **Runtime**: Node.js 20 with PostgreSQL 16
- **Auto-scaling**: Configured for production deployment
- **Port Mapping**: Internal port 5000 mapped to external port 80
- **Build Process**: Automated via deployment configuration

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 20, 2025. Initial setup