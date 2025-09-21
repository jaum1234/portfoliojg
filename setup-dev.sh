#!/bin/bash

# Development Environment Setup Script
# This script automates the initial setup for the portfolio project

set -e

echo "🚀 Setting up Portfolio Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend && npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install
cd ..

# Setup environment files
echo "🔧 Setting up environment files..."

if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your actual configuration values"
else
    echo "✅ .env file already exists"
fi

if [ ! -f frontend/.env ]; then
    echo "📝 Creating frontend/.env file from template..."
    cp frontend/.env.example frontend/.env
else
    echo "✅ frontend/.env file already exists"
fi

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your actual configuration values"
echo "2. Set up Firebase project and Auth0 application"
echo "3. Run 'npm run dev' to start development servers"
echo ""
echo "For detailed setup instructions, see DEVELOPMENT.md"