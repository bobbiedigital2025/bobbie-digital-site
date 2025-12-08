# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Security Features

### Production Security Hardening

This application implements multiple layers of security:

1. **HTTP Security Headers**
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - X-XSS-Protection
   - Strict-Transport-Security (HSTS)
   - Content-Security-Policy (CSP)
   - Referrer-Policy

2. **CORS Configuration**
   - Restricted to specific origins in production
   - Credentials support
   - Preflight handling

3. **Rate Limiting**
   - IP-based rate limiting
   - Configurable windows and limits
   - Automatic cleanup of old entries

4. **Input Validation & Sanitization**
   - SQL injection prevention
   - XSS prevention
   - Path traversal prevention
   - Null byte removal

5. **OAuth & A2A Authentication**
   - OAuth 2.0 support
   - Application-to-Application (A2A) authentication
   - API key validation

6. **Request Size Limits**
   - JSON body limited to 10kb
   - URL-encoded body limited to 10kb

7. **Static Asset Security**
   - Long-term caching for immutable assets
   - ETag and Last-Modified headers
   - Proper MIME types

## Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Required for production
NODE_ENV=production
ALLOWED_ORIGINS=https://bodigi.site,https://w2b.bobbiedigital.base44.app

# OAuth Configuration
OAUTH_CLIENT_ID=your-client-id
OAUTH_CLIENT_SECRET=your-client-secret
OAUTH_CALLBACK_URL=https://bodigi.site/auth/callback

# A2A Authentication
A2A_API_KEYS=key1,key2,key3

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Contact Information
CONTACT_EMAIL=bobbiegray@bodigi.site
CONTACT_PHONE=937303
```

### Deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` with your production domains
- [ ] Set up OAuth credentials
- [ ] Generate secure A2A API keys
- [ ] Configure HTTPS/TLS certificates
- [ ] Set up reverse proxy (nginx, cloudflare)
- [ ] Enable monitoring and logging
- [ ] Regular security updates
- [ ] Backup strategy

## Reporting a Vulnerability

If you discover a security vulnerability, please email: **bobbiegray@bodigi.site**
Phone: **937303**

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

**Response Time:** We aim to respond within 48 hours.

## Contact Information

- **Email:** bobbiegray@bodigi.site
- **Phone:** 937303
- **Website:** https://bodigi.site
- **W2B Platform:** https://w2b.bobbiedigital.base44.app

## Security Updates

We regularly update dependencies to patch security vulnerabilities. Run:

```bash
pnpm audit
pnpm audit fix
```

## Best Practices

1. **Never commit secrets** - Use environment variables
2. **Keep dependencies updated** - Regular `pnpm update`
3. **Use HTTPS in production** - Always
4. **Monitor logs** - Watch for suspicious activity
5. **Regular backups** - Automated and tested
6. **Principle of least privilege** - Minimal permissions
7. **Security testing** - Regular penetration testing

## Compliance

This application is designed to help meet:
- OWASP Top 10 security requirements
- General data protection best practices
- Secure development lifecycle guidelines
