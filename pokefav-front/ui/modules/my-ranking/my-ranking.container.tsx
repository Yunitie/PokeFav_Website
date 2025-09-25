"use client";

import { useEffect, useState } from "react";
import { useHttp } from "@/context/HttpClientContext";
import { Pokemon } from "@/types/pokemon";
import MyRankingView from "./my-ranking.view";

type RankedPokemonDTO = { score: number; pokemon: Pokemon };

export default function MyRankingContainer() {
  const http = useHttp();
  const [ranked, setRanked] = useState<RankedPokemonDTO[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await http.get<RankedPokemonDTO[]>("/api/pokemon/rank");
        // Assure l'ordre décroissant client-side au cas où
        const sorted = [...data].sort((a, b) => b.score - a.score);
        if (mounted) setRanked(sorted);
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, [http]);

  return <MyRankingView ranked={ranked} />;
}
