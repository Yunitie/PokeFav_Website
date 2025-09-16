import { generateMetadata } from "@/ui/components/seo/seo";
import HomeContainer from "@/ui/modules/home/home.container";

export const metadata = generateMetadata({
  title: "Home - PokeFav",
  description:
    "Welcome to PokeFav - Create and share your favorite Pokemon ranking",
  keywords: "Pokemon, favorites, ranking, PokeFav",
});

export default function Home() {
  return <HomeContainer />;
}
