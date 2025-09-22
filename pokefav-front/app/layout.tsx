import type { Metadata } from "next";
import "../styles/globals.css";
import { AuthUserProvider } from "../context/AuthUserContext";
import { HttpClientProvider } from "@/context/HttpClientContext";

export const metadata: Metadata = {
  title: "PokeFav - Your favorite Pokemon",
  description: "Create and share your favorite Pokemon ranking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthUserProvider>
          <HttpClientProvider>{children}</HttpClientProvider>
        </AuthUserProvider>
      </body>
    </html>
  );
}
