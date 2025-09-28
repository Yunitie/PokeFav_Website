"use client";

import Layout from "@/ui/components/layout/layout";
import { Typography } from "@/ui/design-system/typography/typography";
import { Pokemon } from "@/types/pokemon";
import DisplayPokemon from "@/ui/components/displayPokemon/displayPokemon";
import DisplayOptionsToggle from "@/ui/components/displayPokemon/display-options-toggle";
import { useMyRanking } from "@/hooks/use-my-ranking";
import { useState } from "react";

type Ranked = { score: number; pokemon: Pokemon }[];

interface MyRankingViewProps {
  ranked: Ranked;
}

export default function MyRankingView({ ranked }: MyRankingViewProps) {
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 flex flex-col gap-6">
        {/* Filtres */}
        <div className="flex flex-wrap items-center gap-6">
          <input
            type="text"
            placeholder="Search Pokemon..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border rounded px-3 py-1"
          />
          <div className="flex flex-wrap items-center gap-1">
            <Typography variant="body-base">Generations :</Typography>
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
            className="border rounded px-2 py-1"
          >
            <option value="">All types</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
          {/* Toggles d'affichage */}
          <DisplayOptionsToggle value={display} onChange={setDisplay} />
          {(selectedGenerations.length > 0 || selectedType || searchText) && (
            <button onClick={resetFilters} className="px-3 py-1 border rounded">
              Reset
            </button>
          )}
        </div>
        {orderedRanks.map((rank) => (
          <div key={rank} className="flex flex-col">
            <div className="text-xl font-semibold mb-3">#{rank}</div>
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 items-stretch">
              {groups[rank].map(({ pokemon, score }) => (
                <div key={`${pokemon.id}-${score}`} className="min-w-0 h-full">
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
        ))}
      </div>
    </Layout>
  );
}
