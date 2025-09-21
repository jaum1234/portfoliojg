#!/bin/bash

# Development Environment Health Check Script
# This script checks if the development environment is properly configured

set -e

echo "🔍 Portfolio Development Environment Health Check"
echo "================================================="

# Check Node.js
echo -n "Node.js: "
if command -v node &> /dev/null; then
    echo "✅ $(node --version)"
else
    echo "❌ Not installed"
    exit 1
fi

# Check npm
echo -n "npm: "
if command -v npm &> /dev/null; then
    echo "✅ $(npm --version)"
else
    echo "❌ Not installed"
    exit 1
fi

# Check if dependencies are installed
echo -n "Root dependencies: "
if [ -d "node_modules" ]; then
    echo "✅ Installed"
else
    echo "❌ Not installed (run: npm install)"
fi

echo -n "Backend dependencies: "
if [ -d "backend/node_modules" ]; then
    echo "✅ Installed"
else
    echo "❌ Not installed (run: cd backend && npm install)"
fi

echo -n "Frontend dependencies: "
if [ -d "frontend/node_modules" ]; then
    echo "✅ Installed"
else
    echo "❌ Not installed (run: cd frontend && npm install)"
fi

# Check environment files
echo -n "Root .env file: "
if [ -f ".env" ]; then
    echo "✅ Exists"
    
    # Check required variables
    echo "Environment variables:"
    required_vars=("APP_PORT" "AUTH0_SECRET" "AUTH0_CLIENT_ID" "FIREBASE_SERVICE_ACCOUNT_JSON")
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" .env && ! grep -q "^${var}=$" .env && ! grep -q "^${var}=your_" .env; then
            echo "  ✅ $var"
        else
            echo "  ⚠️  $var (not set or using template value)"
        fi
    done
else
    echo "❌ Missing (copy from .env.example)"
fi

echo -n "Frontend .env file: "
if [ -f "frontend/.env" ]; then
    echo "✅ Exists"
else
    echo "❌ Missing (copy from frontend/.env.example)"
fi

# Check ports
echo -n "Port 3000 (backend): "
if lsof -i:3000 &> /dev/null; then
    echo "⚠️  In use"
else
    echo "✅ Available"
fi

echo -n "Port 8080 (frontend): "
if lsof -i:8080 &> /dev/null; then
    echo "⚠️  In use"
else
    echo "✅ Available"
fi

# Test basic functionality
echo ""
echo "🧪 Basic Functionality Tests"
echo "============================"

# Test if backend can start (dry run)
echo -n "Backend syntax check: "
cd backend
if node --check src/app.js &> /dev/null; then
    echo "✅ Passed"
else
    echo "❌ Syntax errors in backend"
fi
cd ..

# Test if frontend can parse
echo -n "Frontend config check: "
cd frontend
if [ -f ".eleventy.js" ] && [ -f "package.json" ]; then
    echo "✅ Passed"
else
    echo "❌ Configuration files missing"
fi
cd ..

echo ""
echo "📋 Summary"
echo "=========="
echo "If all checks show ✅, your development environment is ready!"
echo "If you see ❌ or ⚠️  items, please address them before starting development."
echo ""
echo "Next steps:"
echo "- Run 'npm run dev' to start both services"
echo "- Visit http://localhost:8080 for the frontend"
echo "- Visit http://localhost:3000/admin for the admin panel"
echo ""
echo "For troubleshooting help, see TROUBLESHOOTING.md"