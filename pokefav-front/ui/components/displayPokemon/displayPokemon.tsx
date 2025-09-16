import { Pokemon } from "@/types/pokemon";
import Image from "next/image";
import { Typography } from "@/ui/design-system/typography/typography";

interface DisplayPokemonProps {
  pokemon: Pokemon;
}

export default function DisplayPokemon({ pokemon }: DisplayPokemonProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 m-2 w-80 flex-shrink-0">
      {/* Image du Pokémon */}
      <div className="mb-6 h-80 flex items-center justify-center">
        <Image
          src={pokemon.artworkUrl}
          alt={pokemon.name}
          width={200}
          height={200}
          className="mx-auto rounded-lg object-contain h-full w-auto"
        />
      </div>

      <div className="flex flex-wrap justify-center items-center gap-4">
        <div className="flex flex-wrap justify-center items-center gap-2 mb-2">
          {/* Nom et numéro */}
          <Typography variant="lead" className="leading-none">
            {pokemon.name}
          </Typography>
          <Typography variant="body-lg" className="text-gray-600 leading-none">
            #{pokemon.pokedexId.toString().padStart(3, "0")}
          </Typography>
        </div>

        {/* Types */}
        <div className="hidden md:flex justify-center gap-2 mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-sm">
            {pokemon.type1}
          </span>
          {pokemon.type2 && (
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-sm">
              {pokemon.type2}
            </span>
          )}
        </div>
      </div>

      {/* Informations de base */}
      <div className="hidden md:flex justify-center gap-6 mb-4 text-sm">
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
    </div>
  );
}
