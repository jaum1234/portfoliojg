# Development Environment Setup

This document provides instructions for setting up the development environment for the portfolio project.

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Firebase account (for database)
- Auth0 account (for authentication)

## Quick Start

1. **Clone the repository and install dependencies:**
```bash
git clone <repository-url>
cd portfoliojg
npm run install:all
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```
Edit the `.env` file with your actual configuration values.

3. **Start development servers:**
```bash
npm run dev
```

This will start both the backend API server and frontend development server concurrently.

## Detailed Setup

### 1. Environment Configuration

Copy the example environment file and configure your settings:

```bash
cp .env.example .env
```

#### Required Environment Variables:

**Backend (.env in root directory):**
- `APP_PORT`: Port for the backend server (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `FRONTEND_URL`: URL where frontend is served
- `AUTH0_SECRET`: Auth0 secret key
- `AUTH0_BASE_URL`: Backend URL
- `AUTH0_CLIENT_ID`: Auth0 application client ID
- `AUTH0_ISSUER_BASE_URL`: Auth0 tenant URL
- `FIREBASE_SERVICE_ACCOUNT_JSON`: Firebase service account JSON

**Frontend (.env in frontend directory):**
- `BACKEND_URL`: URL where backend API is served

### 2. Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Firestore database
3. Create a service account and download the JSON key
4. For development, you can use the Firebase emulator:
   ```bash
   npm install -g firebase-tools
   firebase init emulators
   firebase emulators:start
   ```

### 3. Auth0 Setup

1. Create an Auth0 account at https://auth0.com/
2. Create a new application (Regular Web Application)
3. Configure the following in your Auth0 application:
   - Allowed Callback URLs: `http://localhost:3000/callback`
   - Allowed Logout URLs: `http://localhost:8080`
   - Allowed Web Origins: `http://localhost:3000`

### 4. Development Commands

```bash
# Install all dependencies (backend and frontend)
npm run install:all

# Start both backend and frontend in development mode
npm run dev

# Start only the backend
npm run dev:backend

# Start only the frontend
npm run dev:frontend

# Build the frontend for production
npm run build:frontend

# Run tests (when available)
npm test
```

### 5. Project Structure

```
portfoliojg/
├── backend/           # Express.js API server
│   ├── src/
│   │   ├── app.js     # Main application file
│   │   ├── server.js  # Server configuration
│   │   └── database.js # Firebase/Firestore setup
│   └── package.json
├── frontend/          # Eleventy static site generator
│   ├── _data/         # Data files for Eleventy
│   ├── index.njk      # Main template file
│   ├── styles.css     # Styles
│   ├── main.js        # Client-side JavaScript
│   └── package.json
└── .env.example       # Environment variables template
```

### 6. Available URLs

When running in development mode:
- Frontend: http://localhost:8080
- Backend API: http://localhost:3000
- Admin Panel: http://localhost:3000/admin

### 7. Troubleshooting

**Port conflicts:**
If ports 3000 or 8080 are in use, you can change them in the environment variables.

**Firebase connection issues:**
Make sure your Firebase configuration is correct and the service account has the necessary permissions.

**Auth0 authentication issues:**
Verify that your Auth0 URLs and credentials are correctly configured and match between Auth0 dashboard and environment variables.

## Production Deployment

This setup is for development only. For production deployment, ensure you:
1. Use production Firebase project
2. Configure production Auth0 settings
3. Set `NODE_ENV=production`
4. Use secure secrets and environment variables
5. Configure proper CORS and security headers