"use client";

import { useMemo, useState } from "react";

export function usePokemonChoice() {
  const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);

  // Options de générations disponibles (1 à 9)
  const generationOptions = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => (i + 1).toString());
  }, []);

  // Ajoute ou retire une génération de la sélection
  function toggleGeneration(generation: string) {
    setSelectedGenerations((prev) =>
      prev.includes(generation)
        ? prev.filter((gen) => gen !== generation)
        : [...prev, generation]
    );
  }

  // Réinitialise les filtres
  function resetFilters() {
    setSelectedGenerations([]);
  }

  return {
    selectedGenerations,
    generationOptions,
    toggleGeneration,
    resetFilters,
  };
}
