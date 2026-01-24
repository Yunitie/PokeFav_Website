namespace PokeFav.Api.DTOs;

/// <summary>
/// DTO pour la réponse POST /api/pokemon/rank
/// </summary>
public class UpdateRankResponse
{
    public bool Updated { get; set; }
    public int Score { get; set; }
}
