import { Pokemon } from '@/types/pokemon';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class PokemonRandomService {
  /**
   * Récupère un Pokémon vraiment aléatoire depuis toute la table Pokemon
   */
  static async getRandomPokemon(): Promise<Pokemon> {
    const response = await fetch(`${API_BASE_URL}/pokemon/random`);
    
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération du Pokémon aléatoire');
    }
    
    return response.json();
  }

  /**
   * Récupère plusieurs Pokémons aléatoires distincts.
   * Si l'API ne supporte pas nativement un paramètre count, on parallélise.
   */
  static async getRandomPokemons(count: number): Promise<Pokemon[]> {
    if (count <= 0) return [];

    // Appels parallèles, puis dédoublonnage par id si nécessaire
    const pokemons = await Promise.all(
      Array.from({ length: count }, () => this.getRandomPokemon())
    );

    const uniqueById = new Map<number, Pokemon>();
    for (const pkmn of pokemons) {
      const key = pkmn.id;
      if (!uniqueById.has(key)) {
        uniqueById.set(key, pkmn);
      }
    }

    // Si dédoublonnage a réduit la taille, on complète jusqu'à count
    // pour garantir le nombre demandé, avec une limite d'itérations
    let safety = 10 * count;
    while (uniqueById.size < count && safety-- > 0) {
      const pkmn = await this.getRandomPokemon();
      const key = pkmn.id;
      if (!uniqueById.has(key)) {
        uniqueById.set(key, pkmn);
      }
    }

    return Array.from(uniqueById.values()).slice(0, count);
  }
}
