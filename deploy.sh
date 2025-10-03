#!/bin/bash

# Halcyon Platform Deployment Script

echo "🚀 Starting Halcyon Platform Deployment..."

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy Backend API
echo "📡 Deploying Backend API..."
vercel --prod --confirm

# Get the deployed API URL
API_URL=$(vercel ls --scope=your-team | grep halcyon | head -1 | awk '{print $2}')
echo "✅ Backend deployed to: $API_URL"

# Deploy Frontend
echo "🌐 Deploying Frontend..."
cd halcyon-frontend

# Update API URL in config
sed -i "s|https://halcyon-api.vercel.app|$API_URL|g" config.js

vercel --prod --confirm
cd ..

echo "🎉 Deployment Complete!"
echo "Backend: $API_URL"
echo "Frontend: Check Vercel dashboard for URL"