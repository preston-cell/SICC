import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

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

export default clerkMiddleware(async (auth, req) => {
  // If it's a protected route, require authentication
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
