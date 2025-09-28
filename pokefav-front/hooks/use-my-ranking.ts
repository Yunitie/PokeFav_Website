"use client";

/**
 * Hook pour gérer le tri et le filtrage des données de ranking
 * @param ranked - Les données de ranking
 * @returns Les données triées et filtrées
 */

import { useMemo, useState } from "react";
import { Pokemon } from "@/types/pokemon";

export type RankedPokemon = { score: number; pokemon: Pokemon };

export function useMyRanking(ranked: RankedPokemon[]) {
	const [selectedGenerations, setSelectedGenerations] = useState<string[]>([]);
	const [selectedType, setSelectedType] = useState<string>("");
	const [searchText, setSearchText] = useState<string>("");

    // Options de filtres (dérivées des données)
	const generationOptions = useMemo(() => {
		return Array.from(
			new Set(
				ranked
					.map(({ pokemon }) => pokemon.generation)
					.filter((gen): gen is string => Boolean(gen))
			)
		).sort();
	}, [ranked]);

    // Options de filtres (dérivées des données)
	const typeOptions = useMemo(() => {
		return Array.from(
			new Set(
				ranked
					.flatMap(({ pokemon }) => [pokemon.type1, pokemon.type2])
					.filter((type): type is string => Boolean(type))
			)
		).sort();
	}, [ranked]);

    // Filtre les données en fonction des filtres sélectionnés (sans le texte)
	const filteredRanked = useMemo(() => {
		return ranked.filter(({ pokemon }) => {
			const matchesGen = selectedGenerations.length
				? selectedGenerations.includes(pokemon.generation)
				: true;
			const matchesType = selectedType
				? pokemon.type1 === selectedType || pokemon.type2 === selectedType
				: true;
			return matchesGen && matchesType;
		});
	}, [ranked, selectedGenerations, selectedType]);

    // Ajoute le rang à chaque item (basé sur les filtres sans texte)
	const rows = useMemo(() => {
		let lastScore: number | null = null;
		let lastRank = 0;
		return filteredRanked.map((item, index) => {
			if (lastScore === null || item.score < lastScore) {
				lastRank = index + 1;
				lastScore = item.score;
			}
			return { rank: lastRank, ...item };
		});
	}, [filteredRanked]);

	// Applique le filtre de texte sur les données déjà rangées
	const textFilteredRows = useMemo(() => {
		return rows.filter(({ pokemon }) => {
			return searchText
				? pokemon.name.toLowerCase().includes(searchText.toLowerCase())
				: true;
		});
	}, [rows, searchText]);

    // Groupe les rangs par rang (utilise textFilteredRows)
	const groups = useMemo(() => {
		return textFilteredRows.reduce((acc: Record<number, typeof textFilteredRows>, item) => {
			(acc[item.rank] ??= []).push(item);
			return acc;
		}, {} as Record<number, typeof textFilteredRows>);
	}, [textFilteredRows]);

    // Trie les rangs par ordre croissant
	const orderedRanks = useMemo(() => {
		return Object.keys(groups)
			.map(Number)
			.sort((a, b) => a - b);
	}, [groups]);

    // Ajoute la génération sélectionnée
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
		setSelectedType("");
		setSearchText("");
	}

	return {
		// data
		groups,
		orderedRanks,
		// filters state
		selectedGenerations,
		selectedType,
		searchText,
		setSearchText,
		// options
		generationOptions,
		typeOptions,
		// handlers
		toggleGeneration,
		setSelectedType,
		resetFilters,
	};
}


