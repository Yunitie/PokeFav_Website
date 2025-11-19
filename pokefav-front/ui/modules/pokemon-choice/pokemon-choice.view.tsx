import Layout from "@/ui/components/layout/layout";
import { Pokemon } from "@/types/pokemon";
import Spinner from "@/ui/design-system/spinner/spinner";
import { Typography } from "@/ui/design-system/typography/typography";
import DisplayPokemon from "@/ui/components/displayPokemon/displayPokemon";
import { useRef, useEffect, useState } from "react";

// Couleur de fond de la page (modifiable ici)
const BACKGROUND_COLOR = "bg-white dark:bg-[#1B1B1B]";

interface PokemonChoiceViewProps {
  pokemons: Pokemon[];
  count: number;
  onChangeCount: (count: number) => void;
  loading: boolean;
  error: string | null;
  onNewPokemons: () => void;
  onPokemonClick?: (pokemon: Pokemon) => void;
  selectedGenerations: string[];
  generationOptions: string[];
  onToggleGeneration: (generation: string) => void;
  onResetFilters: () => void;
  isUserLoggedIn: boolean;
  authLoading: boolean;
}

export default function PokemonChoiceView({
  pokemons,
  count,
  onChangeCount,
  loading,
  error,
  onNewPokemons,
  onPokemonClick,
  selectedGenerations,
  generationOptions,
  onToggleGeneration,
  onResetFilters,
  isUserLoggedIn,
  authLoading,
}: PokemonChoiceViewProps) {
  const firstPokemonRef = useRef<HTMLDivElement>(null);
  const [nameDisplayed, setNameDisplayed] = useState(true);
  const [typesDisplayed, setTypesDisplayed] = useState(true);
  const [infoDisplayed, setInfoDisplayed] = useState(true);

  // Scroll vers le premier pokémon quand les pokémons changent
  useEffect(() => {
    if (pokemons.length > 0 && firstPokemonRef.current) {
      firstPokemonRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [pokemons]);

  // Affiche le spinner de chargement pour l'authentification
  if (authLoading) {
    return (
      <Layout>
        <div className={`min-h-screen ${BACKGROUND_COLOR}`}>
          <div className="flex justify-center items-center min-h-screen">
            <Spinner size="large" />
          </div>
        </div>
      </Layout>
    );
  }

  // Affiche le spinner de chargement
  if (loading) {
    return (
      <Layout>
        <div className={`min-h-screen ${BACKGROUND_COLOR}`}>
          <div className="flex justify-center items-center min-h-screen">
            <Spinner size="large" />
          </div>
        </div>
      </Layout>
    );
  }

  // Affiche l'erreur
  if (error) {
    return (
      <Layout>
        <div className={`min-h-screen ${BACKGROUND_COLOR}`}>
          <div className="container mx-auto px-4 py-8">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
              <Typography
                variant="h2"
                className="text-red-800 dark:text-red-400 mb-4"
              >
                Error
              </Typography>
              <Typography
                variant="body-base"
                className="text-red-600 dark:text-red-300 mb-4"
              >
                {error}
              </Typography>
              {error.includes("Session expired") ? (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  You will be redirected automatically...
                </div>
              ) : (
                <button
                  onClick={onNewPokemons}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 dark:hover:bg-red-800"
                >
                  Try Again
                </button>
              )}
            </div>
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
      <div className={`min-h-screen ${BACKGROUND_COLOR}`}>
        <div className="container mx-auto px-4 py-8">
          {/* Message d'avertissement si pas connecté */}
          {!isUserLoggedIn && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <Typography variant="body-base" className="text-yellow-800">
                ⚠️ You must be logged in to vote and save your preferences.
                <a href="/login" className="text-primary hover:underline ml-2">
                  Log in
                </a>
              </Typography>
            </div>
          )}

          <div className="mx-auto text-center">
            <Typography
              variant="h1"
              weight="bold"
              className="mb-8 font-sans-serif dark:text-[#9C79C5]"
            >
              Choose your favorite
            </Typography>

            {/* Contrôles d'affichage */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-5 flex-wrap">
                <div className="flex items-center justify-center gap-2">
                  <Typography
                    variant="body-base"
                    className="text-gray-800 dark:text-white"
                  >
                    Number of Pokemons
                  </Typography>
                  <select
                    value={count}
                    onChange={(e) => onChangeCount(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-gray-800 dark:text-white bg-white dark:bg-[#1F1F1F]"
                  >
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <option
                        key={n}
                        value={n}
                        className="text-gray-800 dark:text-white"
                      >
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <div className="flex gap-2">
                    <Typography
                      variant="body-base"
                      className="text-gray-800 dark:text-white"
                    >
                      Name
                    </Typography>
                    <input
                      type="checkbox"
                      checked={nameDisplayed}
                      onChange={(e) => setNameDisplayed(e.target.checked)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Typography
                      variant="body-base"
                      className="text-gray-800 dark:text-white"
                    >
                      Types
                    </Typography>
                    <input
                      type="checkbox"
                      checked={typesDisplayed}
                      onChange={(e) => setTypesDisplayed(e.target.checked)}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Typography
                      variant="body-base"
                      className="text-gray-800 dark:text-white"
                    >
                      Informations
                    </Typography>
                    <input
                      type="checkbox"
                      checked={infoDisplayed}
                      onChange={(e) => setInfoDisplayed(e.target.checked)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-center gap-5">
                {/* Filtre de génération */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Typography
                    variant="body-base"
                    className="text-gray-800 dark:text-white"
                  >
                    Generations :
                  </Typography>
                  {generationOptions.map((gen) => {
                    const active = selectedGenerations.includes(gen);
                    return (
                      <button
                        key={gen}
                        type="button"
                        onClick={() => onToggleGeneration(gen)}
                        className={`px-2 py-1 rounded border ${
                          active
                            ? "bg-primary text-white border-primary"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        {gen}
                      </button>
                    );
                  })}
                  {selectedGenerations.length > 0 && (
                    <button
                      onClick={onResetFilters}
                      className="px-3 py-1 border rounded"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center items-start gap-2">
              {pokemons.map((pkmn, idx) => (
                <div
                  key={pkmn.id ?? idx}
                  ref={idx === 0 ? firstPokemonRef : null}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-[calc(20%-0.5rem)] min-w-0 flex-shrink-0"
                >
                  <DisplayPokemon
                    pokemon={pkmn}
                    onClick={onClickInternal}
                    nameDisplayed={nameDisplayed}
                    typesDisplayed={typesDisplayed}
                    infoDisplayed={infoDisplayed}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
