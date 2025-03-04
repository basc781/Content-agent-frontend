# CLAUDE.md - Development Guidelines

## Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production (runs tsc -b then vite build)
- `npm run lint` - Run ESLint on codebase
- `npm run preview` - Preview production build

## Code Style
- **Formatting**: Use TypeScript with strict typing where possible
- **Components**: Function components with named exports
- **Props**: Define interfaces for component props (e.g., `interface ComponentNameProps`)
- **Imports**: Group imports by external libs, then internal components/styles
- **State Management**: Use React hooks (useState, useEffect) for local state
- **Styling**: Component-specific CSS files imported in component
- **Authentication**: Using Clerk for auth (@clerk/clerk-react)
- **Error Handling**: Use try/catch blocks for async operations
- **File Structure**: Feature-based organization (components/, pages/)
- **Naming**: PascalCase for components, camelCase for functions/variables

## Project Setup
- React 19 with TypeScript
- Vite for build tooling
- React Router v7 for routing
- ESLint for linting with react-hooks and react-refresh plugins