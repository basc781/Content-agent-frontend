# Content Agent Frontend

A modern web application for content management, image uploads, and module-based content generation.

## Features

- **User Authentication**: Secure authentication using Clerk
- **Organization Management**: Multi-tenant support with organization-specific content
- **Image Management**: Upload and manage images with automatic metadata generation
- **Content Generation**: Create and manage content with AI assistance
- **Module System**: Organize content by modules with customizable settings
- **Content Calendar**: Schedule and track content creation

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Clerk account for authentication
- Access to the Content Agent API

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/content-agent-frontend.git
   cd content-agent-frontend
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   VITE_API_URL=your_api_url
   VITE_R2_PUBLIC_URL=your_r2_public_url
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

## Project Structure

- `src/components/`: Reusable UI components
- `src/pages/`: Page components for different routes
- `src/services/`: API services and data fetching logic
- `src/types/`: TypeScript type definitions
- `src/utils/`: Utility functions

## Technologies Used

- React
- TypeScript
- Clerk for authentication
- React Router for navigation
- React Dropzone for file uploads

## License

[MIT](LICENSE)
