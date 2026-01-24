namespace PokeFav.Api.DTOs;

/// <summary>
/// DTO pour représenter un Pokemon avec ses statistiques (utilisé pour GET /api/pokemon/{id} et GET /api/pokemon/random)
/// </summary>
public class PokemonDto
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
    public PokemonStatsDto Stats { get; set; } = null!;
}

/// <summary>
/// DTO pour représenter les statistiques d'un Pokemon
/// </summary>
public class PokemonStatsDto
{
    public int Hp { get; set; }
    public int Attack { get; set; }
    public int Defense { get; set; }
    public int SpecialAttack { get; set; }
    public int SpecialDefense { get; set; }
    public int Speed { get; set; }
}
