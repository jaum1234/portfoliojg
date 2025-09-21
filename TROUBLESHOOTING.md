# Development Troubleshooting Guide

This guide helps resolve common issues when setting up and running the development environment.

## Common Issues and Solutions

### 1. Frontend Build Fails with "request to http://localhost:3000/api/videos failed"

**Problem**: The frontend build process fails because it can't connect to the backend API.

**Solution**: 
- Make sure the backend is running first: `npm run dev:backend`
- Or start both services together: `npm run dev`
- Check that the backend is accessible at http://localhost:3000

### 2. Backend Fails to Start with Auth0 or Firebase Errors

**Problem**: Backend crashes with authentication or database connection errors.

**Solutions**:
- Verify your `.env` file has all required variables
- For development, you can use mock values:
  ```bash
  AUTH0_SECRET=development_secret_key_change_in_production
  AUTH0_CLIENT_ID=mock_client_id
  FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"demo-project"}
  ```
- Set up Firebase emulator for local development (see Firebase Setup below)

### 3. Port Already in Use Errors

**Problem**: "EADDRINUSE: address already in use" errors.

**Solutions**:
- Kill processes using the ports:
  ```bash
  # Kill process on port 3000 (backend)
  lsof -ti:3000 | xargs kill -9
  
  # Kill process on port 8080 (frontend)
  lsof -ti:8080 | xargs kill -9
  ```
- Or change the ports in your environment variables

### 4. Node.js Version Issues

**Problem**: Compatibility issues with Node.js version.

**Solution**: 
- Use Node.js version 16 or higher
- Check your version: `node --version`
- Use nvm to manage Node.js versions:
  ```bash
  nvm install 18
  nvm use 18
  ```

### 5. VS Code Debugging Issues

**Problem**: VS Code debugger doesn't work or doesn't stop at breakpoints.

**Solutions**:
- Make sure you have the Node.js extension installed
- Use the "Launch Full Stack" configuration for debugging both services
- Check that source maps are enabled
- Restart VS Code if debugger becomes unresponsive

## Firebase Setup for Development

### Using Firebase Emulator (Recommended)

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Initialize Firebase in your project:
   ```bash
   firebase init emulators
   ```

3. Select Firestore emulator and configure:
   - Firestore port: 8080
   - Enable Firestore UI: Yes

4. Start the emulator:
   ```bash
   firebase emulators:start
   ```

5. Update your environment to use the emulator:
   ```bash
   # In .env file
   FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"demo-project"}
   ```

### Using a Development Firebase Project

1. Create a new Firebase project at https://console.firebase.google.com/
2. Enable Firestore database
3. Create a service account:
   - Go to Project Settings > Service Accounts
   - Generate a new private key
   - Copy the JSON content to your `.env` file

## Auth0 Setup for Development

1. Create an Auth0 account at https://auth0.com/
2. Create a new application (Regular Web Application)
3. Configure these settings:
   - **Allowed Callback URLs**: `http://localhost:3000/callback`
   - **Allowed Logout URLs**: `http://localhost:8080`
   - **Allowed Web Origins**: `http://localhost:3000`
   - **Allowed Origins (CORS)**: `http://localhost:3000`

4. Copy the configuration to your `.env` file:
   ```bash
   AUTH0_SECRET=your_secret_here
   AUTH0_BASE_URL=http://localhost:3000
   AUTH0_CLIENT_ID=your_client_id_here
   AUTH0_ISSUER_BASE_URL=https://your-tenant.auth0.com
   ```

## Environment Variables Checklist

### Backend (.env in root directory)
- [ ] `APP_PORT=3000`
- [ ] `NODE_ENV=development`
- [ ] `FRONTEND_URL=http://localhost:8080`
- [ ] `AUTH0_SECRET` (32+ character random string)
- [ ] `AUTH0_BASE_URL=http://localhost:3000`
- [ ] `AUTH0_CLIENT_ID` (from Auth0 dashboard)
- [ ] `AUTH0_ISSUER_BASE_URL` (from Auth0 dashboard)
- [ ] `FIREBASE_SERVICE_ACCOUNT_JSON` (JSON string or emulator config)

### Frontend (.env in frontend directory)
- [ ] `BACKEND_URL=http://localhost:3000`

## Useful Development Commands

```bash
# Clean and reinstall all dependencies
rm -rf node_modules backend/node_modules frontend/node_modules
npm run install:all

# Check what's running on ports
lsof -i :3000  # Backend port
lsof -i :8080  # Frontend port

# View backend logs
cd backend && npm run dev 2>&1 | tee backend.log

# Build frontend without starting server
cd frontend && npm run build

# Test API endpoints
curl http://localhost:3000/api/videos
curl http://localhost:3000/api/categorias

# Check environment variables
cd backend && node -e "console.log(process.env)" | grep -E "(AUTH0|FIREBASE|FRONTEND)"
```

## Performance Tips

1. **Use `--watch` mode**: The backend uses Node.js watch mode for faster restarts
2. **Eleventy serve mode**: Frontend uses Eleventy's built-in dev server with live reload
3. **Concurrent development**: Use `npm run dev` to run both services simultaneously

## Getting Help

If you encounter issues not covered here:

1. Check the console output for specific error messages
2. Verify all environment variables are set correctly
3. Test backend and frontend independently
4. Check Firebase and Auth0 service status
5. Review the detailed setup instructions in DEVELOPMENT.md