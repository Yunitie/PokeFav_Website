import Layout from "@/ui/components/layout/layout";
import { Pokemon } from "@/types/pokemon";
import Spinner from "@/ui/design-system/spinner/spinner";
import { Typography } from "@/ui/design-system/typography/typography";
import DisplayPokemon from "@/ui/components/displayPokemon/displayPokemon";

interface PokemonChoiceViewProps {
  pokemons: Pokemon[];
  count: number;
  onChangeCount: (count: number) => void;
  loading: boolean;
  error: string | null;
  onNewPokemons: () => void;
  onPokemonClick?: (pokemon: Pokemon) => void;
}

export default function PokemonChoiceView({
  pokemons,
  count,
  onChangeCount,
  loading,
  error,
  onNewPokemons,
  onPokemonClick,
}: PokemonChoiceViewProps) {
  // Affiche le spinner de chargement
  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="large" />
        </div>
      </Layout>
    );
  }

  // Affiche l'erreur
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
              onClick={onNewPokemons}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const onClickInternal = (pokemon: Pokemon) => {
    onPokemonClick?.(pokemon);
  };

  // Affiche le Pokémon aléatoire
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto text-center ">
          <Typography variant="h1" className="mb-8">
            Choose your favorite
          </Typography>

          <div className="flex items-center justify-center gap-3 mb-6">
            <label className="text-sm">Nombre de Pokémons:</label>
            <select
              value={count}
              onChange={(e) => onChangeCount(Number(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap justify-center items-start gap-4">
            {pokemons.map((pkmn, idx) => (
              <DisplayPokemon
                key={pkmn.id ?? idx}
                pokemon={pkmn}
                onClick={onClickInternal}
              />
            ))}
          </div>

          {/* Bouton pour un nouveau set de Pokémons */}
          <button
            onClick={onNewPokemons}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Nouveau Set Aléatoire
          </button>
        </div>
      </div>
    </Layout>
  );
}
