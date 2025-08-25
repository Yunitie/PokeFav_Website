"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Layout from "@/ui/components/layout/layout";
import { Pokemon } from "@/types/pokemon";
import { PokemonRandomService } from "@/lib/pokemon-random";
import Spinner from "@/ui/design-system/spinner/spinner";
import { Typography } from "@/ui/design-system/typography/typography";

export default function PokemonChoicePage() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRandomPokemon = async () => {
      try {
        setLoading(true);
        setError(null);

        const randomPokemon = await PokemonRandomService.getRandomPokemon();
        setPokemon(randomPokemon);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPokemon();
  }, []);

  const handleNewPokemon = () => {
    setLoading(true);
    setError(null);
    setPokemon(null);

    const fetchRandomPokemon = async () => {
      try {
        const randomPokemon = await PokemonRandomService.getRandomPokemon();
        setPokemon(randomPokemon);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    fetchRandomPokemon();
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="large" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <Typography variant="h2" className="text-red-800 mb-4">
              Erreur
            </Typography>
            <Typography variant="body-base" className="text-red-600">
              {error}
            </Typography>
            <button
              onClick={handleNewPokemon}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <Typography variant="h1" className="mb-8">
            Pokémon Aléatoire
          </Typography>

          {pokemon && (
            <div className="bg-white rounded-lg shadow-lg p-8">
              {/* Image du Pokémon */}
              <div className="mb-6">
                <Image
                  src={pokemon.artworkUrl}
                  alt={pokemon.name}
                  width={192}
                  height={192}
                  className="mx-auto rounded-lg"
                />
              </div>

              {/* Nom et numéro */}
              <Typography variant="h2" className="mb-2">
                {pokemon.name}
              </Typography>
              <Typography variant="h4" className="text-gray-600 mb-4">
                #{pokemon.pokedexId.toString().padStart(3, "0")}
              </Typography>

              {/* Types */}
              <div className="flex justify-center gap-2 mb-6">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {pokemon.type1}
                </span>
                {pokemon.type2 && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    {pokemon.type2}
                  </span>
                )}
              </div>

              {/* Informations de base */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Génération:</span>
                  <p>{pokemon.generation}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Taille:</span>
                  <p>{pokemon.height}m</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Poids:</span>
                  <p>{pokemon.weight}kg</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">
                    Total Stats:
                  </span>
                  <p>
                    {Object.values(pokemon.stats).reduce((a, b) => a + b, 0)}
                  </p>
                </div>
              </div>

              {/* Bouton pour un nouveau Pokémon */}
              <button
                onClick={handleNewPokemon}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Nouveau Pokémon Aléatoire
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
