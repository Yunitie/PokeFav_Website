using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PokeFav.Api.DTOs;

/// <summary>
/// Requête pour la demande de réinitialisation de mot de passe.
/// </summary>
public class ForgotPasswordRequest
{
    [Required(ErrorMessage = "Email is required.")]
    [EmailAddress(ErrorMessage = "Email address is not valid.")]
    [DefaultValue("example@example.com")] // Valeur factice pour Swagger UI uniquement
    public string Email { get; set; } = string.Empty;
}

