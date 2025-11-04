import PublicRankingContainer from "@/ui/modules/public-ranking/public-ranking.container";

interface PageProps {
  params: Promise<{ publicId: string }>;
}

export default async function PublicRankingPage({ params }: PageProps) {
  const { publicId } = await params;
  return <PublicRankingContainer publicId={publicId} />;
}
