using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PokeFav.Api.DTOs;

/// <summary>
/// Requête pour la réinitialisation de mot de passe.
/// </summary>
public class ResetPasswordRequest
{
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Email address is not valid.")]
    [DefaultValue("example@example.com")] // Valeur factice pour Swagger UI uniquement
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Token is required.")]
    [DefaultValue("reset-token-from-email")] // Valeur factice pour Swagger UI uniquement
    public string Token { get; set; } = string.Empty;

    [Required(ErrorMessage = "New password is required.")]
    [MinLength(8, ErrorMessage = "Password must contain at least 8 characters.")]
    [DefaultValue("Example123")] // Valeur factice pour Swagger UI uniquement
    public string NewPassword { get; set; } = string.Empty;
}

