import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "routemate.top - Your Smart Travel Planner",
  description: "Offline-capable travel itinerary with automatic logistics.",
};

import { GeolocationProvider } from "@/components/layout/GeolocationProvider";
import { AuthProvider } from "@/components/layout/AuthProvider";
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-black antialiased flex flex-col"
        suppressHydrationWarning
      >
        <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
          <GeolocationProvider>
            <AuthProvider>
              <div className="flex-1 w-full max-w-[500px] mx-auto bg-black relative flex flex-col min-h-screen">
                {children}
              </div>
            </AuthProvider>
          </GeolocationProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
