"use client";

import { useEffect, useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { PokemonRandomService } from "@/lib/pokemon-random";
import PokemonChoiceView from "./pokemon-choice.view";

export default function PokemonChoiceContainer() {
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

  return (
    <PokemonChoiceView
      pokemons={pokemons}
      count={count}
      onChangeCount={setCount}
      loading={loading}
      error={error}
      onNewPokemons={handleNewPokemons}
    />
  );
}
