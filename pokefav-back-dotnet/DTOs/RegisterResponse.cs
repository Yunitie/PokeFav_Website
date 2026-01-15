namespace PokeFav.Api.DTOs;

/// <summary>
/// DTO pour la réponse d'inscription (sans token, juste les infos utilisateur)
/// </summary>
public class RegisterResponse
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
}


