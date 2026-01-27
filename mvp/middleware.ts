import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/intake/(.*)",              // All intake pages require login
  "/analysis/(.*)",            // Analysis requires login
  "/documents/generate/(.*)",  // Document generation requires login
  "/documents/upload/(.*)",    // Document upload requires login
]);

// Routes that should be accessible to everyone (public)
const isPublicRoute = createRouteMatcher([
  "/",
  "/intake",                   // Landing page only (shows sign-in prompt)
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/(.*)",
]);

// Simple in-memory rate limiter for API routes
// In production, use Redis or a dedicated rate limiting service
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100; // 100 requests per minute

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = ip;
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - entry.count };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, RATE_LIMIT_WINDOW_MS);

// Add security headers to response
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent XSS attacks
  response.headers.set('X-Content-Type-Options', 'nosniff');
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  // Enable strict transport security
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Referrer policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  // Permissions policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Content Security Policy
  // Note: 'unsafe-inline' and 'unsafe-eval' needed for Next.js and Clerk
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.clerk.accounts.dev https://clerk.* https://challenges.cloudflare.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data:",
    "connect-src 'self' https: wss:",
    "frame-src 'self' https://*.clerk.accounts.dev https://clerk.* https://challenges.cloudflare.com",
    "form-action 'self'",
    "base-uri 'self'",
    "object-src 'none'",
  ].join('; ');
  response.headers.set('Content-Security-Policy', csp);

  return response;
}

// Middleware that adds security headers and rate limiting
function securityMiddleware(req: NextRequest): NextResponse {
  // Apply rate limiting to API routes
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || req.headers.get('x-real-ip')
      || 'unknown';

    const { allowed, remaining } = checkRateLimit(ip);

    if (!allowed) {
      const response = NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
      response.headers.set('Retry-After', '60');
      response.headers.set('X-RateLimit-Remaining', '0');
      return addSecurityHeaders(response);
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Remaining', remaining.toString());
    return addSecurityHeaders(response);
  }

  return addSecurityHeaders(NextResponse.next());
}

// Export the appropriate middleware
export default isClerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      // Apply security headers and rate limiting first
      const securityResponse = securityMiddleware(req);
      if (securityResponse.status === 429) {
        return securityResponse;
      }

      if (isProtectedRoute(req)) {
        await auth.protect();
      }

      return securityResponse;
    })
  : securityMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
