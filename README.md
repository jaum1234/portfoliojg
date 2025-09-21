# Portfoliojg

Live: https://portfoliojg.com/

This project is a personal portfolio website for a video editing professional, designed to showcase their work and manage content efficiently. It's composed of two main sub-projects: a static frontend for fast content delivery and a backend API for content management and frontend rebuilding.

## Quick Start

```bash
# Clone the repository
git clone https://github.com/jaum1234/portfoliojg.git
cd portfoliojg

# Run the automated setup script
./setup-dev.sh

# Edit environment variables
cp .env.example .env
# Edit .env with your actual configuration

# Start development servers
npm run dev
```

For detailed setup instructions, see [DEVELOPMENT.md](DEVELOPMENT.md).

## Technologies Used
Frontend:

 * Eleventy
 * HTML5, CSS3, JavaScript
   
Backend:

 * Node.js
 * Express.js
 * Firestore (for data storage)
 * Auth0 (for authentication and authorization)

## Features

* Fast-Loading Portfolio: Leveraging Static Site Generation for optimal performance.
* Intuitive Admin Panel: Easily add, edit, and categorize video content.
* Dynamic Content Updates: Rebuild the frontend with a single click to display new content.
* Categorized Portfolio: Organize videos into relevant categories for better navigation.
* Secure Authentication: User management and access control via Auth0.
* Reliable Data Storage: Data persistence using Firestore.

## Development

### Available Scripts

```bash
# Install all dependencies
npm run install:all

# Start both backend and frontend in development mode
npm run dev

# Start only backend
npm run dev:backend

# Start only frontend
npm run dev:frontend

# Build frontend for production
npm run build:frontend
```

### Environment Variables

The project requires several environment variables for different services:

- **Auth0**: For authentication and user management
- **Firebase**: For database operations
- **URLs**: For connecting frontend and backend

See `.env.example` for a complete list of required variables.

### Development URLs

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

## Docker Development

For containerized development:

```bash
# Start all services with Docker Compose
docker-compose -f docker-compose.dev.yml up

# Start with Firestore emulator
docker-compose -f docker-compose.dev.yml up firestore
```
