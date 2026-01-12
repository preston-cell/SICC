import "./globals.css";
import { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: "Estate Planning Assistant",
  description: "AI-powered estate planning to protect what matters most",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ConvexClientProvider>
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
