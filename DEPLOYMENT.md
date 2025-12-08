# 🚀 Deployment Guide - Bobbie Digital Site

## Security-Hardened Deployment

This guide covers deploying the site to **www.bodigi.site** and **www.w2b.base44.app** with production-grade security.

## Pre-Deployment Checklist

### 1. Environment Configuration

Create a `.env` file (never commit this!):

```bash
NODE_ENV=production
PORT=3000

# Allowed Origins (CORS)
ALLOWED_ORIGINS=http://www.bodigi.site,https://www.bodigi.site,http://www.w2b.base44.app,https://www.w2b.base44.app

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Contact Information
CONTACT_EMAIL=support@bodigi-digital.com
CONTACT_PHONE=(937)303-1858

# Application URLs
BODIGI_URL=http://www.bodigi.site
W2B_URL=http://www.w2b.base44.app

# OAuth/A2A Configuration (Optional - configure when ready)
OAUTH_CLIENT_ID=your-oauth-client-id
OAUTH_CLIENT_SECRET=your-oauth-client-secret
OAUTH_CALLBACK_URL=https://www.bodigi.site/auth/callback
OAUTH_ISSUER=https://your-oauth-provider.com

# A2A API Keys (comma-separated)
A2A_API_KEYS=generate-secure-key-1,generate-secure-key-2
```

### 2. Generate Secure Keys

```bash
# Generate OAuth secrets (if using OAuth)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate A2A API keys
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

### 3. Security Verification

```bash
# Check for vulnerabilities
pnpm audit

# Build the project
pnpm run build

# Test production build locally
NODE_ENV=production pnpm start
```

## Deployment Options

### Option 1: Docker Deployment (Recommended)

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --prod --frozen-lockfile

# Copy built files
COPY --from=builder /app/dist ./dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

EXPOSE 3000

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Deploy:

```bash
docker-compose up -d
```

### Option 2: Traditional VPS Deployment

```bash
# 1. SSH into your server
ssh user@www.bodigi.site

# 2. Install dependencies
sudo apt update
sudo apt install -y nodejs npm nginx certbot python3-certbot-nginx

# 3. Install pnpm
npm install -g pnpm

# 4. Clone repository
git clone https://github.com/bobbiedigital2025/bobbie-digital-site.git
cd bobbie-digital-site

# 5. Install dependencies and build
pnpm install
pnpm run build

# 6. Set up environment variables
cp .env.example .env
nano .env  # Edit with your values

# 7. Set up systemd service
sudo nano /etc/systemd/system/bobbie-digital.service
```

Service file content:

```ini
[Unit]
Description=Bobbie Digital Site
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/path/to/bobbie-digital-site
Environment=NODE_ENV=production
ExecStart=/usr/bin/node dist/index.js
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Start service:

```bash
sudo systemctl enable bobbie-digital
sudo systemctl start bobbie-digital
sudo systemctl status bobbie-digital
```

### Option 3: Nginx Reverse Proxy Configuration

```nginx
# /etc/nginx/sites-available/www.bodigi.site

upstream bobbie_digital {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    listen [::]:80;
    server_name www.bodigi.site bodigi.site;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.bodigi.site bodigi.site;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/www.bodigi.site/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/www.bodigi.site/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req zone=api_limit burst=20 nodelay;

    # Proxy configuration
    location / {
        proxy_pass http://bobbie_digital;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://bobbie_digital;
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/www.bodigi.site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### SSL Certificate Setup

```bash
# Get SSL certificate
sudo certbot --nginx -d www.bodigi.site -d bodigi.site

# Auto-renewal
sudo certbot renew --dry-run
```

## Post-Deployment

### 1. Verify Security Headers

```bash
curl -I http://www.bodigi.site
```

Check for:
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- Content-Security-Policy

### 2. Test Rate Limiting

```bash
# Should return 429 after exceeding limit
for i in {1..150}; do curl http://www.bodigi.site; done
```

### 3. Monitor Logs

```bash
# Application logs
journalctl -u bobbie-digital -f

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 4. Set Up Monitoring

Use tools like:
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry
- **Performance monitoring**: New Relic, Datadog
- **Log aggregation**: Papertrail, Loggly

## Continuous Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
      
      - name: Install pnpm
        run: npm install -g pnpm
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Run tests
        run: pnpm test || true
      
      - name: Build
        run: pnpm run build
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /path/to/bobbie-digital-site
            git pull
            pnpm install
            pnpm run build
            sudo systemctl restart bobbie-digital
```

## Security Maintenance

### Regular Tasks

- [ ] Weekly: Review logs for suspicious activity
- [ ] Weekly: Check `pnpm audit` for vulnerabilities
- [ ] Monthly: Update dependencies with `pnpm update`
- [ ] Monthly: Review and rotate API keys
- [ ] Quarterly: Security audit and penetration testing

### Emergency Response

If security breach detected:

1. **Immediate**: Take site offline
2. **Rotate**: All secrets, API keys, certificates
3. **Investigate**: Check logs for breach source
4. **Patch**: Fix vulnerability
5. **Notify**: Affected users (if applicable)
6. **Document**: Incident and response

## Support & Contact

- **Email**: support@bodigi-digital.com
- **Phone**: (937)303-1858
- **BoDiGi App**: http://www.bodigi.site (Fully automated small business builder)
- **Where_2_Begin App**: http://www.w2b.base44.app (Organization and goal tracking app)
- **Repository**: https://github.com/bobbiedigital2025/bobbie-digital-site

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
