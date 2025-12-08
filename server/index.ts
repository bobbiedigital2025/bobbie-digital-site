import express, { Request, Response, NextFunction } from "express";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Security configuration
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://bobbiedigital.com",
  "https://bobbiedigital.com",
  "http://www.bobbiedigital.com",
  "https://www.bobbiedigital.com",
  "http://www.bodigi.site",
  "https://www.bodigi.site",
  "http://www.w2b.base44.app",
  "https://www.w2b.base44.app",
];

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000"); // 15 minutes
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100");

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Trust proxy (for deployment behind reverse proxies like nginx, cloudflare)
  app.set("trust proxy", 1);

  // Security middleware - MUST be first
  app.use((req: Request, res: Response, next: NextFunction) => {
    // Security Headers
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
    res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
    
    // Strict Transport Security (HSTS) - only in production
    if (process.env.NODE_ENV === "production") {
      res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    }

    // Content Security Policy
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: https: blob:",
      "connect-src 'self' http://bobbiedigital.com https://bobbiedigital.com http://www.bobbiedigital.com https://www.bobbiedigital.com http://www.bodigi.site https://www.bodigi.site http://www.w2b.base44.app https://www.w2b.base44.app https://maps.googleapis.com",
      "frame-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; ");
    res.setHeader("Content-Security-Policy", csp);

    next();
  });

  // CORS middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin;
    
    // In production, only allow specific origins
    if (process.env.NODE_ENV === "production") {
      if (origin && ALLOWED_ORIGINS.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
    } else {
      // In development, allow localhost
      if (origin?.includes("localhost") || origin?.includes("127.0.0.1")) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
    }

    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "600");

    // Handle preflight
    if (req.method === "OPTIONS") {
      return res.status(204).end();
    }

    next();
  });

  // Rate limiting middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const ip = (req.ip || req.socket.remoteAddress || "unknown").toString();
    const now = Date.now();
    
    let record = rateLimitStore.get(ip);
    
    // Reset if window expired
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + RATE_LIMIT_WINDOW };
      rateLimitStore.set(ip, record);
    }

    record.count++;

    // Clean up old entries periodically
    if (Math.random() < 0.01) {
      for (const [key, value] of rateLimitStore.entries()) {
        if (now > value.resetTime) {
          rateLimitStore.delete(key);
        }
      }
    }

    if (record.count > RATE_LIMIT_MAX) {
      res.setHeader("Retry-After", Math.ceil((record.resetTime - now) / 1000));
      return res.status(429).json({
        error: "Too many requests",
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
      });
    }

    res.setHeader("X-RateLimit-Limit", RATE_LIMIT_MAX.toString());
    res.setHeader("X-RateLimit-Remaining", (RATE_LIMIT_MAX - record.count).toString());
    res.setHeader("X-RateLimit-Reset", new Date(record.resetTime).toISOString());

    next();
  });

  // Body parsing with size limits
  app.use(express.json({ limit: "10kb" }));
  app.use(express.urlencoded({ extended: true, limit: "10kb" }));

  // Health check endpoint (no rate limiting)
  app.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Contact information endpoint
  app.get("/api/contact", (_req, res) => {
    res.json({
      email: process.env.CONTACT_EMAIL || "support@bodigi-digital.com",
      phone: process.env.CONTACT_PHONE || "(937)303-1858",
      apps: {
        bodigi: {
          name: "BoDiGi",
          description: "Fully automated small business builder",
          url: process.env.BODIGI_URL || "http://www.bodigi.site",
        },
        where2begin: {
          name: "Where_2_Begin",
          description: "App for getting organized and tracking goals to stay productive in life",
          url: process.env.W2B_URL || "http://www.w2b.base44.app",
        },
      },
    });
  });

  // Serve static files from dist/public in production
  const staticPath =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(__dirname, "..", "dist", "public");

  app.use(
    express.static(staticPath, {
      maxAge: process.env.NODE_ENV === "production" ? "1y" : "0",
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        // Add cache control for static assets
        if (filePath.match(/\.(js|css|woff2?|ttf|eot|svg|png|jpg|jpeg|gif|webp|ico)$/)) {
          res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
        } else {
          res.setHeader("Cache-Control", "no-cache, must-revalidate");
        }
      },
    })
  );

  // Handle client-side routing - serve index.html for all routes
  app.get("*", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, must-revalidate");
    res.sendFile(path.join(staticPath, "index.html"));
  });

  // Error handling middleware
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Server error:", err);
    res.status(500).json({
      error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
    });
  });

  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`🔒 Secure server running on http://localhost:${port}/`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`Contact: support@bodigi-digital.com | (937)303-1858`);
    console.log(`Allowed origins: ${ALLOWED_ORIGINS.join(", ")}`);
  });

  // Graceful shutdown
  const shutdown = () => {
    console.log("\nShutting down gracefully...");
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });

    // Force close after 10 seconds
    setTimeout(() => {
      console.error("Forced shutdown");
      process.exit(1);
    }, 10000);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

startServer().catch(console.error);
