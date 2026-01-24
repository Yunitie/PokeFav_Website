namespace PokeFav.Api.DTOs;

/// <summary>
/// DTO pour représenter un Pokemon classé avec son score (utilisé pour GET /api/pokemon/rank)
/// </summary>
public class RankedPokemonDto
{
    public int Score { get; set; }
    public PokemonDto Pokemon { get; set; } = null!;
}
