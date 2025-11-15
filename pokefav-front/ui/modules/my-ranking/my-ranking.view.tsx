"use client";

import Layout from "@/ui/components/layout/layout";
import { Typography } from "@/ui/design-system/typography/typography";
import { Pokemon } from "@/types/pokemon";
import DisplayPokemon from "@/ui/components/displayPokemon/displayPokemon";
import DisplayOptionsToggle from "@/ui/components/displayPokemon/display-options-toggle";
import { useMyRanking } from "@/hooks/use-my-ranking";
import { useState } from "react";
import { translateType } from "@/lib/pokemon-types";
import toast from "react-hot-toast";

type Ranked = { score: number; pokemon: Pokemon }[];

interface MyRankingViewProps {
  ranked: Ranked;
  publicUrl: string | null;
}

export default function MyRankingView({
  ranked,
  publicUrl,
}: MyRankingViewProps) {
  const {
    groups,
    orderedRanks,
    generationOptions,
    typeOptions,
    selectedGenerations,
    selectedType,
    searchText,
    setSearchText,
    toggleGeneration,
    setSelectedType,
    resetFilters,
  } = useMyRanking(ranked);
  const [display, setDisplay] = useState({
    name: true,
    types: true,
    info: true,
  });
  const [copied, setCopied] = useState(false);

  // Helpers pour adapter l'affichage des rangs sur une grille de 6 colonnes
  const getColSpanClass = (count: number) => {
    const n = Math.min(Math.max(count, 1), 6);
    switch (n) {
      case 1:
        return "xl:col-span-1";
      case 2:
        return "xl:col-span-2";
      case 3:
        return "xl:col-span-3";
      case 4:
        return "xl:col-span-4";
      case 5:
        return "xl:col-span-5";
      default:
        return "xl:col-span-6";
    }
  };

  const getInnerGridColsClass = (count: number) => {
    const n = Math.min(Math.max(count, 1), 6);
    const classes = ["grid-cols-1"];
    if (n >= 2) classes.push("sm:grid-cols-2");
    if (n >= 3) classes.push("md:grid-cols-3");
    if (n >= 4) classes.push("lg:grid-cols-4");
    if (n >= 5) classes.push("xl:grid-cols-5");
    if (n >= 6) classes.push("xl:grid-cols-6");
    return classes.join(" ");
  };

  // Calcul du nombre de Pokémon affichés
  const displayedCount = orderedRanks.reduce(
    (total, rank) => total + groups[rank].length,
    0
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col gap-6">
        {/* Informations */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Typography
            variant="body-lg"
            className="text-gray-700 dark:text-gray-400 font-medium"
          >
            {displayedCount}{" "}
            {displayedCount > 1 ? "Pokemon displayed" : "Pokemon displayed"}
            {ranked.length !== displayedCount && (
              <span className="text-gray-500 dark:text-gray-400 font-normal">
                {" "}
                out of {ranked.length}
              </span>
            )}
          </Typography>
          {publicUrl && (
            <div className="flex flex-col sm:flex-row items-left sm:items-center sm:gap-2">
              <Typography
                variant="body-base"
                className="text-gray-700 dark:text-gray-300"
              >
                Share your ranking
              </Typography>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={publicUrl}
                  className="border border-secondary-400/70 text-gray-700 dark:text-gray-300 rounded-l px-3 py-1 w-64 md:w-96"
                  onFocus={(e) => e.currentTarget.select()}
                />
                <button
                  type="button"
                  className={`px-3 py-1 border border-secondary-400/70 bg-secondary-400/70 rounded-r ${
                    copied ? "animate-pulse" : ""
                  }`}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(publicUrl);
                      setCopied(true);
                      toast.success("Copied", { duration: 1200 });
                      setTimeout(() => setCopied(false), 600);
                    } catch {
                      // fallback: select input for manual copy
                    }
                  }}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filtres */}
        {ranked.length === 0 ? (
          <div className="w-full py-10 text-center">
            <Typography
              variant="body-lg"
              className="text-gray-600 dark:text-gray-400"
            >
              You haven&apos;t ranked any Pokemon yet. Start voting to build
              your ranking.
            </Typography>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-6">
            <input
              type="text"
              placeholder="Search Pokemon..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="border rounded px-3 py-1 text-gray-700 dark:text-gray-300"
            />
            <div className="flex flex-wrap items-center gap-1">
              <Typography
                variant="body-base"
                className="text-gray-700 dark:text-gray-300"
              >
                Generations :
              </Typography>
              {generationOptions.map((gen) => {
                const active = selectedGenerations.includes(gen);
                return (
                  <button
                    key={gen}
                    type="button"
                    onClick={() => toggleGeneration(gen)}
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
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="border rounded px-2 py-1 text-gray-700 dark:text-gray-300"
            >
              <option
                value=""
                className="text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2B2B2B]"
              >
                All types
              </option>
              {typeOptions.map((type) => (
                <option
                  key={type}
                  value={type}
                  className="text-gray-700 dark:text-gray-300 bg-white dark:bg-[#2B2B2B]"
                >
                  {translateType(type)}
                </option>
              ))}
            </select>
            {/* Toggles d'affichage */}
            <DisplayOptionsToggle value={display} onChange={setDisplay} />
            {(selectedGenerations.length > 0 || selectedType || searchText) && (
              <button
                onClick={resetFilters}
                className="px-3 py-1 border rounded"
              >
                Reset
              </button>
            )}
          </div>
        )}
        {ranked.length > 0 && (
          <div className="grid grid-cols-1 xl:grid-cols-6 gap-3">
            {orderedRanks.map((rank) => {
              const count = groups[rank].length;
              return (
                <div
                  key={rank}
                  className={`flex flex-col ${getColSpanClass(count)}`}
                >
                  <div className="text-3xl text-center bg-secondary-300 bg-gradient-to-r to-landing-purple to-140% text-landing-dark-purple drop-shadow-lg font-bold mb-3">
                    #{rank}
                  </div>
                  <div
                    className={`grid gap-1 items-stretch ${getInnerGridColsClass(
                      count
                    )}`}
                  >
                    {groups[rank].map(({ pokemon, score }) => (
                      <div
                        key={`${pokemon.id}-${score}`}
                        className="min-w-0 h-full"
                      >
                        <DisplayPokemon
                          pokemon={pokemon}
                          nameDisplayed={display.name}
                          typesDisplayed={display.types}
                          infoDisplayed={display.info}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
