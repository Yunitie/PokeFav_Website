import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import { useState } from "react";
import { Typography } from "@/ui/design-system/typography/typography";
import Spinner from "@/ui/design-system/spinner/spinner";

interface DisplayPokemonProps {
  pokemon: Pokemon;
  onClick?: (pokemon: Pokemon) => void;
  nameDisplayed?: boolean;
  typesDisplayed?: boolean;
  infoDisplayed?: boolean;
}

export default function DisplayPokemon({
  pokemon,
  onClick,
  nameDisplayed,
  typesDisplayed,
  infoDisplayed,
}: DisplayPokemonProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <button type="button" onClick={() => onClick?.(pokemon)}>
      <div className="bg-white rounded-lg shadow-lg p-2 w-full">
        {/* Image du Pokémon */}
        <div className="mb-2 h-full flex items-center justify-center relative">
          {!isImageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Spinner size="large" />
            </div>
          )}
          <Image
            src={pokemon.artworkUrl}
            alt={pokemon.name}
            width={200}
            height={200}
            className={`mx-auto rounded-lg object-contain max-h-full max-w-full transition-opacity duration-300 ${
              isImageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setIsImageLoaded(true)}
            onError={() => setIsImageLoaded(true)}
          />
        </div>

        {nameDisplayed && (
          <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
            {/* Nom et numéro */}
            <Typography variant="lead" className="leading-none">
              {pokemon.name}
            </Typography>
            <Typography
              variant="body-lg"
              className="text-gray-600 leading-none"
            >
              #{pokemon.pokedexId.toString().padStart(3, "0")}
            </Typography>
          </div>
        )}

        {typesDisplayed && (
          <div className="hidden md:flex justify-center gap-2 mb-6">
            {/* Types */}
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-sm">
              {pokemon.type1}
            </span>
            {pokemon.type2 && (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-sm">
                {pokemon.type2}
              </span>
            )}
          </div>
        )}

        {/* Informations de base */}
        {infoDisplayed && (
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 text-sm">
            <div className="text-center">
              <span className="font-medium text-gray-600">Génération:</span>
              <p>{pokemon.generation}</p>
            </div>
            <div className="text-center">
              <span className="font-medium text-gray-600">Taille:</span>
              <p>{pokemon.height}m</p>
            </div>
            <div className="text-center">
              <span className="font-medium text-gray-600">Poids:</span>
              <p>{pokemon.weight}kg</p>
            </div>
          </div>
        )}
      </div>
    </button>
  );
}
