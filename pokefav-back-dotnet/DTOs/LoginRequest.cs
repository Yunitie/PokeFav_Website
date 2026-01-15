using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PokeFav.Api.DTOs;

/// <summary>
/// DTO pour la requête de connexion utilisateur
/// </summary>
public class LoginRequest
{
    /// <summary>
    /// Email de l'utilisateur (exemple pour Swagger uniquement)
    /// </summary>
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Email address is not valid.")]
    [DefaultValue("example@example.com")] // Valeur factice pour Swagger UI uniquement
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Mot de passe de l'utilisateur (exemple pour Swagger uniquement)
    /// </summary>
    [Required(ErrorMessage = "Password is required.")]
    [DefaultValue("Example123")] // Valeur factice pour Swagger UI uniquement
    public string Password { get; set; } = string.Empty;
}


