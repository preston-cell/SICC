"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useAuthSync } from "./hooks/useAuthSync";

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL!
);

// Component that syncs Clerk auth with Convex
function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  // This hook handles syncing Clerk user with Convex database
  useAuthSync();
  return <>{children}</>;
}

export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ConvexProvider client={convex}>
      <AuthSyncWrapper>{children}</AuthSyncWrapper>
    </ConvexProvider>
  );
}
