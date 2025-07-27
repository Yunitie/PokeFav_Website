import { generateMetadata } from "@/ui/components/seo/seo";
import { Typography } from "@/ui/design-system/typography/typography";
import Link from "next/link";

export const metadata = generateMetadata({
  title: "Accueil - PokeFav",
  description:
    "Bienvenue sur PokeFav - Créez et partagez votre classement de Pokémon favoris",
  keywords: "Pokémon, favoris, classement, PokeFav",
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Typography
          variant="h1"
          component="h1"
          theme="primary"
          weight="medium"
          className="text-center mb-8"
        >
          PokeFav
        </Typography>
        <Typography
          variant="lead"
          component="p"
          theme="gray-600"
          className="text-center mb-8"
        >
          Bienvenue sur PokeFav - Votre application de Pokémon favoris
        </Typography>

        <div className="text-center">
          <Link
            href="/design-system"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-400 transition-colors"
          >
            Voir le Design System
          </Link>
        </div>
      </main>
    </div>
  );
}
