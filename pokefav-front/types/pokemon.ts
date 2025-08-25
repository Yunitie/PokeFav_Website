export interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}

export interface Pokemon {
  id: number;
  pokedexId: number;
  name: string;
  artworkUrl: string;
  type1: string;
  type2?: string;
  generation: string;
  height: number;
  weight: number;
  stats: PokemonStats;
}
