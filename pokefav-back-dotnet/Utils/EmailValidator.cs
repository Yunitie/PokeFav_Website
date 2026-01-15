using System.Text.RegularExpressions;

namespace PokeFav.Api.Utils;

/// <summary>
/// Utilitaire de validation d'email côté serveur
/// </summary>
public static class EmailValidator
{
    private static readonly Regex EmailRegex = new(@"^[^\s@]+@[^\s@]+\.[^\s@]+$", RegexOptions.Compiled);

    /// <summary>
    /// Valide le format d'un email et retourne la version normalisée (lowercase, trimmed)
    /// </summary>
    public static (bool Valid, string? Error, string? Value) Validate(string? email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            return (false, "Email is required.", null);
        }

        var trimmed = email.Trim();

        if (!EmailRegex.IsMatch(trimmed))
        {
            return (false, "Email address is not valid.", null);
        }

        return (true, null, trimmed.ToLowerInvariant());
    }
}


