import { Request, Response, NextFunction } from "express";

// Input sanitization
export function sanitizeInput(req: Request, _res: Response, next: NextFunction) {
  // Remove any null bytes from strings
  const sanitize = (obj: any): any => {
    if (typeof obj === "string") {
      return obj.replace(/\0/g, "");
    }
    if (typeof obj === "object" && obj !== null) {
      for (const key in obj) {
        obj[key] = sanitize(obj[key]);
      }
    }
    return obj;
  };

  if (req.body) {
    req.body = sanitize(req.body);
  }
  if (req.query) {
    req.query = sanitize(req.query);
  }
  if (req.params) {
    req.params = sanitize(req.params);
  }

  next();
}

// SQL injection prevention (basic)
export function preventSQLInjection(input: string): boolean {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE)\b)/gi,
    /(;|--|\/\*|\*\/|xp_|sp_)/gi,
  ];

  return sqlPatterns.some((pattern) => pattern.test(input));
}

// XSS prevention
export function sanitizeHTML(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

// Path traversal prevention
export function preventPathTraversal(filePath: string): boolean {
  const normalizedPath = filePath.replace(/\\/g, "/");
  return normalizedPath.includes("../") || normalizedPath.includes("..\\");
}

// Request validation middleware
export function validateRequest(req: Request, res: Response, next: NextFunction) {
  // Check for suspicious patterns
  const allInputs = JSON.stringify({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (preventSQLInjection(allInputs)) {
    return res.status(400).json({ error: "Invalid input detected" });
  }

  next();
}

// File upload validation (if you add file uploads)
export const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateFile(file: { mimetype: string; size: number }): { valid: boolean; error?: string } {
  if (!ALLOWED_FILE_TYPES.includes(file.mimetype)) {
    return { valid: false, error: "File type not allowed" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: "File size exceeds limit" };
  }

  return { valid: true };
}
