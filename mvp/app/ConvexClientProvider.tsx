"use client";

import { useAuthSyncPrisma } from "./hooks/useAuthSyncPrisma";

/**
 * Auth Provider - Syncs Clerk authentication with PostgreSQL/Prisma
 *
 * This provider handles:
 * - Syncing Clerk user data to the PostgreSQL database
 * - Linking anonymous session data to authenticated users
 *
 * Note: This was previously ConvexClientProvider but has been migrated
 * to use PostgreSQL/Prisma exclusively. The name is kept for backward
 * compatibility with existing imports.
 */
function AuthSyncWrapper({ children }: { children: React.ReactNode }) {
  useAuthSyncPrisma();
  return <>{children}</>;
}

export default function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthSyncWrapper>{children}</AuthSyncWrapper>;
}
