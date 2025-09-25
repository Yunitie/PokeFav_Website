"use client";

import { useEffect, useState } from "react";
import { useHttp } from "@/context/HttpClientContext";
import { useAuth } from "@/context/AuthUserContext";
import { useRouter } from "next/navigation";
import { Pokemon } from "@/types/pokemon";
import MyRankingView from "./my-ranking.view";

type RankedPokemonDTO = { score: number; pokemon: Pokemon };

export default function MyRankingContainer() {
  const http = useHttp();
  const { authUser, loading } = useAuth();
  const router = useRouter();
  const [ranked, setRanked] = useState<RankedPokemonDTO[]>([]);

  // Redirige vers /login si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!loading && !authUser) {
      router.replace("/login");
    }
  }, [loading, authUser, router]);

  useEffect(() => {
    let mounted = true;
    // Ne lance pas la requête tant que l'état d'auth n'est pas connu
    // et ne fetch que si l'utilisateur est authentifié
    if (!loading && authUser) {
      (async () => {
        try {
          const data = await http.get<RankedPokemonDTO[]>("/api/pokemon/rank");
          const sorted = [...data].sort((a, b) => b.score - a.score);
          if (mounted) setRanked(sorted);
        } catch {}
      })();
    }
    return () => {
      mounted = false;
    };
  }, [http, loading, authUser]);

  return <MyRankingView ranked={ranked} />;
}
