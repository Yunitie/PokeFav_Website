import Layout from "@/ui/components/layout/layout";
import { Typography } from "@/ui/design-system/typography/typography";
import KonamiCode from "@/ui/components/konami-code/konami-code";

export default function HomeView() {
  return (
    <Layout>
      <KonamiCode />
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
            Welcome to PokeFav - Your favorite Pokemon application
          </Typography>
        </main>
      </div>
    </Layout>
  );
}
