# Docker Setup Troubleshooting Guide

## Problem: File .env tidak terbawa ke container

### ✅ **SUDAH DIPERBAIKI** 

**Issue yang terjadi:**
- File `.env` di-exclude di `.dockerignore`
- Environment variables tidak ter-embed saat build
- Aplikasi mendapat response HTML instead of JSON dari API

**Solusi yang diterapkan:**

1. **Update `.dockerignore`:**
   ```bash
   # Commented out .env to allow it to be copied
   # .env  # Sekarang .env file akan ikut ter-copy
   ```

2. **Update `Dockerfile`:**
   - File `.env` sekarang ter-copy saat `COPY . .`
   - Vite akan membaca `.env` saat build process
   - Environment variables ter-embed dalam JavaScript bundle

3. **Update `docker-compose.yml`:**
   ```yaml
   environment:
     - NODE_ENV=production
     - VITE_API_ROUTES=https://soundbox.ctsolution.id/api
   ```

### Verifikasi Environment Variables Bekerja:

```bash
# Check if API URL is embedded in built files
docker exec cts-merchant-app grep -r "soundbox.ctsolution.id" /usr/share/nginx/html/

# Using management script
./docker-manage.sh env-check
```

### Commands yang Berguna:

```bash
# Rebuild container dengan env baru
./docker-manage.sh rebuild

# Check logs
./docker-manage.sh logs

# Check status
./docker-manage.sh status
```

## Cara Kerja Environment Variables di Vite + Docker:

1. **Build Time (dalam container):**
   - File `.env` di-copy ke container
   - Vite membaca `VITE_*` variables saat `npm run build`
   - Variables ter-embed dalam JavaScript bundle

2. **Runtime (production):**
   - Environment variables sudah "baked" dalam JavaScript
   - Nginx serve static files yang sudah include env vars
   - Tidak perlu environment variables di runtime

## File Structure untuk Environment:

```
project/
├── .env                    # ✅ Main env file (now copied)
├── .env.local             # ❌ Ignored (local overrides)
├── .env.production        # ❌ Ignored 
├── .dockerignore          # ✅ Updated to allow .env
└── docker-compose.yml     # ✅ Explicit env vars as backup
```

## Testing Checklist:

- [x] ✅ Container builds successfully
- [x] ✅ Container runs on port 8801
- [x] ✅ Environment variables embedded in JS bundle
- [x] ✅ API calls should work with correct base URL
- [x] ✅ No more "Unexpected token '<'" JSON errors

## Common Issues & Solutions:

### Issue: Still getting JSON parsing errors
**Check:**
1. Verify API endpoint is accessible: `curl https://soundbox.ctsolution.id/api`
2. Check browser network tab for actual response
3. Verify CORS settings on API server

### Issue: Environment variables not working
**Check:**
1. Ensure variable name starts with `VITE_`
2. Rebuild container: `./docker-manage.sh rebuild`
3. Verify embedding: `./docker-manage.sh env-check`

## Development vs Production:

**Development (with hot reload):**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Production (optimized):**
```bash
docker-compose up --build -d
```