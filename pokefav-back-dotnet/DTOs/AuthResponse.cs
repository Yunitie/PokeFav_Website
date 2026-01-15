namespace PokeFav.Api.DTOs;

/// <summary>
/// DTO pour la réponse d'authentification (login/register)
/// </summary>
public class AuthResponse
{
    public string AccessToken { get; set; } = string.Empty;
    public string RefreshToken { get; set; } = string.Empty; // Pour le cookie
    public UserDto User { get; set; } = null!;
}

/// <summary>
/// DTO pour les informations utilisateur publiques
/// </summary>
public class UserDto
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string? DisplayName { get; set; }
}

