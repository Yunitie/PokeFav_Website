import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "PokeFav - Vos Pokémon favoris",
  description: "Créez et partagez votre classement de Pokémon favoris",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
