# Vercel Deployment Security Checklist

## ✅ Environment Variables

- [ ] Service account credentials stored as environment variables (not in code)
- [ ] API keys secured in Vercel dashboard
- [ ] Production/development environment separation

## ✅ CORS Configuration

- [ ] Whitelist only your frontend domains
- [ ] Remove localhost origins in production
- [ ] Configure for preview deployments

## ✅ API Security

- [ ] Rate limiting implemented
- [ ] Helmet.js security headers enabled
- [ ] Input validation on all endpoints
- [ ] Proper error handling (no sensitive data leaked)

## ✅ Google Earth Engine

- [ ] Service account has minimal required permissions
- [ ] Credentials rotation plan in place
- [ ] Usage monitoring enabled

## ✅ Monitoring

- [ ] Vercel Analytics enabled
- [ ] Error logging configured
- [ ] Performance monitoring setup

## ✅ Build & Deploy

- [ ] Automated testing before deployment
- [ ] Preview deployments for branches
- [ ] Production deployment protection
