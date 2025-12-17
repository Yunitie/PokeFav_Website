namespace PokeFav.Api.Models;

public class Pokemon
{
    public int Id { get; set; }
    public int PokedexId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ArtworkUrl { get; set; } = string.Empty;
    public string Type1 { get; set; } = string.Empty;
    public string? Type2 { get; set; }
    public string Generation { get; set; } = string.Empty;
    public float Height { get; set; }
    public float Weight { get; set; }

    // Clé étrangère vers PokemonStats (relation 1:1)
    public int StatsId { get; set; }
    public PokemonStats Stats { get; set; } = null!;

    // Relation : un Pokemon peut avoir plusieurs PokemonRank
    public ICollection<PokemonRank> PokemonRanks { get; set; } = new List<PokemonRank>();
}

