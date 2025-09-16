"use client";

import { useEffect, useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { PokemonRandomService } from "@/lib/pokemon-random";
import PokemonChoiceView from "./pokemon-choice.view";
import { useAuth } from "@/context/AuthUserContext";

export default function PokemonChoiceContainer() {
  const { accessToken } = useAuth();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [count, setCount] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Récupère N Pokémons aléatoires
  useEffect(() => {
    let cancelled = false; // Pour éviter les effets secondaires lors du démontage du composant
    const fetchRandomPokemons = async () => {
      try {
        setLoading(true);
        setError(null);
        const randomPokemons = await PokemonRandomService.getRandomPokemons(
          count
        );
        if (!cancelled) setPokemons(randomPokemons);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchRandomPokemons();
    return () => {
      cancelled = true;
    };
  }, [count]);

  // Récupère un nouveau set de Pokémons aléatoires sans refresh de page
  const handleNewPokemons = () => {
    setLoading(true);
    setError(null);
    setPokemons([]);

    const fetchRandomPokemons = async () => {
      try {
        const randomPokemons = await PokemonRandomService.getRandomPokemons(
          count
        );
        setPokemons(randomPokemons);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPokemons();
  };

  const handlePokemonClick = async (pokemon: Pokemon) => {
    try {
      let tokenToUse = accessToken;
      if (!tokenToUse) {
        // tente un refresh transparent
        try {
          const r = await fetch("http://localhost:3001/api/auth/refresh", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({}),
          });
          if (r.ok) {
            const data = await r.json();
            if (data && typeof data.accessToken === "string") {
              tokenToUse = data.accessToken;
            }
          }
        } catch {}
      }
      if (!tokenToUse) {
        setError("Vous devez être connecté pour voter");
        return;
      }
      const clickedPokemonId = pokemon.id;
      const visiblePokemonIds = pokemons.map((pkmn) => pkmn.id);
      const res = await fetch("http://localhost:3001/api/pokemon/rank", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenToUse}`,
        },
        body: JSON.stringify({ clickedPokemonId, visiblePokemonIds }),
      });
      if (!res.ok) {
        let message = "Erreur lors de l'envoi du vote";
        try {
          const data: unknown = await res.json();
          const obj =
            data && typeof data === "object"
              ? (data as Record<string, unknown>)
              : null;
          if (obj && typeof obj.error === "string") {
            message = obj.error;
          }
        } catch {}
        throw new Error(message);
      }
      // Optionnel: exploiter { updated, score }
      await res.json().catch(() => undefined);
      // Rafraîchir la liste après un vote réussi
      handleNewPokemons();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    }
  };

  return (
    <PokemonChoiceView
      pokemons={pokemons}
      count={count}
      onChangeCount={setCount}
      loading={loading}
      error={error}
      onNewPokemons={handleNewPokemons}
      onPokemonClick={handlePokemonClick}
    />
  );
}
