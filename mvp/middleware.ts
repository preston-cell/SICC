import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/documents/generate/(.*)",  // Document generation requires login
]);

// Routes that should be accessible to everyone (public)
const isPublicRoute = createRouteMatcher([
  "/",
  "/intake(.*)",
  "/analysis/(.*)",
  "/documents/upload/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/(.*)",
]);

// Middleware that skips Clerk if not configured
function simpleMiddleware(req: NextRequest) {
  return NextResponse.next();
}

// Export the appropriate middleware
export default isClerkConfigured
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : simpleMiddleware;

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
