"use client";

import { useEffect, useState } from "react";
import { Pokemon } from "@/types/pokemon";
import { PokemonRandomService } from "@/lib/pokemon-random";
import PokemonChoiceView from "./pokemon-choice.view";
import { useHttp } from "@/context/HttpClientContext";
import { usePokemonChoice } from "@/hooks/use-pokemon-choice";

export default function PokemonChoiceContainer() {
  const http = useHttp();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [count, setCount] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    selectedGenerations,
    generationOptions,
    toggleGeneration,
    resetFilters,
  } = usePokemonChoice();

  // Récupère N Pokémons aléatoires
  useEffect(() => {
    let cancelled = false; // Pour éviter les effets secondaires lors du démontage du composant
    const fetchRandomPokemons = async () => {
      try {
        setLoading(true);
        setError(null);
        const randomPokemons = await PokemonRandomService.getRandomPokemons(
          count,
          selectedGenerations.length > 0 ? selectedGenerations : undefined
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
  }, [count, selectedGenerations]);

  // Récupère un nouveau set de Pokémons aléatoires sans refresh de page
  const handleNewPokemons = () => {
    setLoading(true);
    setError(null);
    setPokemons([]);

    const fetchRandomPokemons = async () => {
      try {
        const randomPokemons = await PokemonRandomService.getRandomPokemons(
          count,
          selectedGenerations.length > 0 ? selectedGenerations : undefined
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
      const clickedPokemonId = pokemon.id;
      const visiblePokemonIds = pokemons.map((pkmn) => pkmn.id);

      // Envoi via le wrapper HTTP (gère token, refresh 401 et retry)
      await http.post("/api/pokemon/rank", {
        clickedPokemonId,
        visiblePokemonIds,
      });

      // Rafraîchir la liste après un vote réussi
      handleNewPokemons();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
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
      selectedGenerations={selectedGenerations}
      generationOptions={generationOptions}
      onToggleGeneration={toggleGeneration}
      onResetFilters={resetFilters}
    />
  );
}
