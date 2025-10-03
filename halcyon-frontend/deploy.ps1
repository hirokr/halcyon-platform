# Halcyon Platform - Frontend Deployment Script
# Run this from the halcyon-frontend directory

Write-Host "🚀 Deploying Halcyon Frontend to Vercel..." -ForegroundColor Green

# Check if we're in the right directory
if (-not (Test-Path "index.html")) {
    Write-Host "❌ Error: index.html not found. Make sure you're in the halcyon-frontend directory." -ForegroundColor Red
    exit 1
}

# Check if Vercel CLI is installed
try {
    vercel --version | Out-Null
    Write-Host "✅ Vercel CLI found" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    npm install -g vercel
}

# List files to be deployed
Write-Host "📁 Files to deploy:" -ForegroundColor Blue
Get-ChildItem -Name | ForEach-Object { Write-Host "  - $_" }

# Deploy to Vercel
Write-Host "🚢 Starting deployment..." -ForegroundColor Blue
vercel --prod

Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host "📝 Remember to:" -ForegroundColor Yellow
Write-Host "   1. Check the deployed URL in your browser" -ForegroundColor Yellow
Write-Host "   2. Open browser developer tools to check for JavaScript errors" -ForegroundColor Yellow
Write-Host "   3. Visit /debug.html on your deployed site to test script loading" -ForegroundColor Yellow