"use client";

import { useEffect, useState } from "react";
import { useHttp } from "@/context/HttpClientContext";
import { Pokemon } from "@/types/pokemon";
import PublicRankingView from "./public-ranking.view";
import toast from "react-hot-toast";

type RankedPokemonDTO = { score: number; pokemon: Pokemon };

interface PublicRankingContainerProps {
  publicId: string;
}

export default function PublicRankingContainer({
  publicId,
}: PublicRankingContainerProps) {
  const http = useHttp();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [ranked, setRanked] = useState<RankedPokemonDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await http.get<{
          displayName?: string;
          items: RankedPokemonDTO[];
        }>(`/api/share/user/${publicId}`);
        if (!mounted) return;
        setDisplayName(data.displayName ?? null);
        const sorted = [...data.items].sort((a, b) => b.score - a.score);
        setRanked(sorted);
      } catch (e) {
        const message =
          e instanceof Error ? e.message : "Failed to load public ranking";
        if (mounted) {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [http, publicId]);

  return (
    <PublicRankingView
      displayName={displayName}
      ranked={ranked}
      loading={loading}
      error={error}
    />
  );
}
