using System.Text.RegularExpressions;

namespace PokeFav.Api.Utils;

/// <summary>
/// Utilitaire de validation de mot de passe côté serveur
/// Règles:
/// - Au moins 8 caractères
/// - Au moins une lettre minuscule
/// - Au moins une lettre majuscule
/// - Au moins un chiffre
/// </summary>
public static class PasswordValidator
{
    private static readonly Regex LowercaseRegex = new(@"[a-z]", RegexOptions.Compiled);
    private static readonly Regex UppercaseRegex = new(@"[A-Z]", RegexOptions.Compiled);
    private static readonly Regex DigitRegex = new(@"[0-9]", RegexOptions.Compiled);

    /// <summary>
    /// Valide la force d'un mot de passe selon les règles de sécurité
    /// </summary>
    public static (bool Valid, string? Error) Validate(string? password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            return (false, "Password is required.");
        }

        if (password.Length < 8)
        {
            return (false, "Password must contain at least 8 characters.");
        }

        var hasLowercase = LowercaseRegex.IsMatch(password);
        var hasUppercase = UppercaseRegex.IsMatch(password);
        var hasDigit = DigitRegex.IsMatch(password);

        if (!hasLowercase || !hasUppercase || !hasDigit)
        {
            return (false, "Password must contain at least one lowercase letter, one uppercase letter, and one number.");
        }

        return (true, null);
    }
}


