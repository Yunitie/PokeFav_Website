import { generateMetadata } from "@/ui/components/seo/seo";
import Layout from "@/ui/components/layout/layout";

export const metadata = generateMetadata({
  title: "My Ranking - PokeFav",
  description: "Create and manage your personal Pokemon ranking",
  keywords: "Pokemon, ranking, favorites, PokeFav",
});

export default function MyRankingPage() {
  return (
    <Layout>
      <div>
        <h1>My Ranking</h1>
      </div>
    </Layout>
  );
}
