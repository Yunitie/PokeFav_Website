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
}
