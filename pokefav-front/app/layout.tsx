import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthUserProvider } from "../context/AuthUserContext";
import { HttpClientProvider } from "@/context/HttpClientContext";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "PokeFav - Your favorite Pokemon",
  description: "Create and share your favorite Pokemon ranking",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon" },
      { url: "/images/logo/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/images/logo/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo/icon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/images/logo/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/images/logo/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/images/logo/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: [
      { url: "/images/logo/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/images/logo/icon-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/images/logo/icon-180.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-white">
        <AuthUserProvider>
          <HttpClientProvider>
            {children}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  backgroundColor: "#4f378a",
                  color: "#f4f4f5",
                  borderRadius: "0.5rem",
                  padding: "0.5rem",
                  fontWeight: "500",
                },
              }}
            />
          </HttpClientProvider>
        </AuthUserProvider>
      </body>
    </html>
  );
}
