using System.Text.Json.Serialization;

namespace PokeFav.Api.DTOs;

/// <summary>
/// Réponse pour GET /api/share/user/{publicId} - classement public d'un utilisateur.
/// </summary>
public class SharedUserResponseDto
{
    /// <summary>
    /// Nom d'affichage (optionnel, absent si null pour correspondre au backend Node).
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? DisplayName { get; set; }

    public List<RankedPokemonDto> Items { get; set; } = new();
}
