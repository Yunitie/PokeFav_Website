using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace PokeFav.Api.Services;

/// <summary>
/// Interface pour l'envoi d'emails.
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Envoie un email de réinitialisation de mot de passe.
    /// </summary>
    /// <param name="to">Adresse email du destinataire.</param>
    /// <param name="resetLink">Lien complet de réinitialisation vers le front.</param>
    Task SendPasswordResetEmailAsync(string to, string resetLink);
}

/// <summary>
/// Implémentation simple de IEmailService.
/// Pour le moment, cette implémentation se contente de logger l'email.
/// Tu pourras plus tard la remplacer par une implémentation SMTP réelle
/// (par exemple via MailKit, SendGrid, etc.).
/// </summary>
public class EmailService : IEmailService
{
    private readonly ILogger<EmailService> _logger;
    private readonly IConfiguration _configuration;

    public EmailService(ILogger<EmailService> logger, IConfiguration configuration)
    {
        _logger = logger;
        _configuration = configuration;
    }

    public Task SendPasswordResetEmailAsync(string to, string resetLink)
    {
        // TODO: Implémenter un vrai envoi d'email (SMTP, provider externe, etc.).
        // Pour l'instant, on logge seulement le contenu pour le développement.

        _logger.LogInformation(
            "Password reset email would be sent to {Email}. Reset link: {ResetLink}",
            to,
            resetLink
        );

        return Task.CompletedTask;
    }
}

