# Overview

This is a modern digital library application built with React and Express, providing a comprehensive platform for browsing and reading books and audiobooks. The application features a full-stack architecture with a React frontend, Express backend, and includes user authentication, book management, and administrative capabilities. The interface is built with shadcn/ui components and supports multiple book categories including fiction, science, educational content, and audiobooks.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: wouter for lightweight client-side routing
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming support
- **State Management**: TanStack React Query for server state management
- **Forms**: React Hook Form with Zod validation resolvers

## Backend Architecture  
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful API with `/api` prefix routing
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling
- **Session Management**: Prepared for PostgreSQL session storage with connect-pg-simple

## Data Storage Architecture
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Management**: Shared schema definitions using Zod for validation
- **Development Storage**: In-memory storage implementation for development
- **Production Database**: PostgreSQL with Neon serverless configuration
- **Data Models**: User management with role-based access (admin/client) and comprehensive book metadata including audiobook support

## Authentication and Authorization
- **Authentication**: Local storage-based authentication system with login/logout functionality
- **Authorization**: Role-based access control with admin and client user types
- **Session Persistence**: Browser localStorage for user session management
- **Default Admin**: Automatic creation of default admin user (admin/admin123)

## Component Architecture
- **Design System**: Comprehensive UI component library with consistent theming
- **Layout Components**: Responsive navigation, footer, and page layouts
- **Feature Components**: Specialized components for book display, audio playback, and administrative functions
- **Mobile Support**: Responsive design with mobile-first approach using custom hooks for device detection

# External Dependencies

## UI and Styling
- **Radix UI**: Complete set of accessible UI primitives for complex components
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Lucide React**: Comprehensive icon library for consistent iconography
- **Class Variance Authority**: Type-safe component variant management

## Development and Build Tools
- **Vite**: Fast frontend build tool with React plugin support
- **TypeScript**: Type safety across the entire application
- **Replit Plugins**: Development-specific tooling for Replit environment integration

## Backend Infrastructure
- **Neon Database**: Serverless PostgreSQL database provider
- **Drizzle Kit**: Database migration and schema management tooling
- **Express Middleware**: Standard Express.js middleware stack for request handling

## Validation and Type Safety
- **Zod**: Runtime type validation and schema definition
- **Drizzle Zod**: Integration between Drizzle ORM and Zod validation
- **Shared Types**: Common type definitions between frontend and backend using shared schema

## Utility Libraries
- **date-fns**: Date manipulation and formatting utilities
- **clsx**: Conditional CSS class composition
- **nanoid**: Unique identifier generation for development features