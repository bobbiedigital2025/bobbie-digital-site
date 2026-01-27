import { Request, Response, NextFunction } from "express";

// OAuth/A2A Configuration
export interface OAuthConfig {
  clientId: string;
  clientSecret: string;
  callbackUrl: string;
  issuer: string;
}

export const oauthConfig: OAuthConfig = {
  clientId: process.env.OAUTH_CLIENT_ID || "",
  clientSecret: process.env.OAUTH_CLIENT_SECRET || "",
  callbackUrl: process.env.OAUTH_CALLBACK_URL || "https://bodigi.site/auth/callback",
  issuer: process.env.OAUTH_ISSUER || "",
};

// JWT validation middleware (add your JWT library)
export function validateToken(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  // TODO: Implement JWT validation with your preferred library
  // For now, this is a placeholder
  next();
}

// OAuth callback handler
export async function handleOAuthCallback(req: Request, res: Response) {
  const { code, state } = req.query;

  if (!code) {
    return res.status(400).json({ error: "No authorization code provided" });
  }

  try {
    // TODO: Exchange code for token with OAuth provider
    // This is a placeholder for the OAuth flow
    
    // Example token exchange:
    // const tokenResponse = await fetch(`${oauthConfig.issuer}/token`, {
    //   method: "POST",
    //   headers: { "Content-Type": "application/x-www-form-urlencoded" },
    //   body: new URLSearchParams({
    //     grant_type: "authorization_code",
    //     code: code as string,
    //     redirect_uri: oauthConfig.callbackUrl,
    //     client_id: oauthConfig.clientId,
    //     client_secret: oauthConfig.clientSecret,
    //   }),
    // });

    res.json({ success: true, message: "OAuth callback received" });
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).json({ error: "OAuth authentication failed" });
  }
}

// A2A (Application-to-Application) authentication middleware
export function validateA2AToken(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"];
  
  if (!apiKey) {
    return res.status(401).json({ error: "API key required for A2A authentication" });
  }

  // TODO: Validate API key against your stored keys
  // This should be stored securely in environment variables or a database
  const validApiKeys = process.env.A2A_API_KEYS?.split(",") || [];
  
  if (!validApiKeys.includes(apiKey as string)) {
    return res.status(403).json({ error: "Invalid API key" });
  }

  next();
}
