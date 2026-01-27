import "./globals.css";
import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import AuthSyncProvider from "./AuthSyncProvider";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "./components/ui/Toast";

// Primary font - DM Sans (Cohere-style)
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

// Monospace font
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Estate Planning Assistant",
  description: "AI-powered estate planning to protect what matters most",
};

// Check if Clerk is configured
const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const content = (
    <html lang="en" className={`${dmSans.variable} ${jetbrainsMono.variable}`}>
      <body className={dmSans.className}>
        <AuthSyncProvider>
          {children}
        </AuthSyncProvider>
      </body>
    </html>
  );

  // Wrap with ClerkProvider only if configured
  if (isClerkConfigured) {
    return <ClerkProvider>{content}</ClerkProvider>;
  }

  return content;
}
