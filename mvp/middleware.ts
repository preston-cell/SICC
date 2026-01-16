import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Allowed origins for CORS
// In production, replace with your actual domain(s)
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Add your production domain here:
  // 'https://your-app.vercel.app',
  // 'https://your-custom-domain.com',
];

// Check if origin is allowed
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return true; // Same-origin requests
  if (process.env.NODE_ENV === 'development') return true; // Allow all in dev
  return allowedOrigins.includes(origin);
}

export function middleware(request: NextRequest) {
  const origin = request.headers.get('origin');
  const pathname = request.nextUrl.pathname;

  // Only apply CORS to API routes
  if (pathname.startsWith('/api/')) {
    // Handle preflight requests (OPTIONS)
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': isOriginAllowed(origin) ? (origin || '*') : '',
          'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400', // Cache preflight for 24 hours
        },
      });
    }

    // For actual requests, add CORS and security headers
    const response = NextResponse.next();

    // CORS headers
    if (isOriginAllowed(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
    }
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Security headers
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    // Strict Transport Security (only in production with HTTPS)
    if (process.env.NODE_ENV === 'production') {
      response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }

    return response;
  }

  // For non-API routes, just add security headers
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    // Run on all API routes
    '/api/:path*',
    // Run on all pages except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
