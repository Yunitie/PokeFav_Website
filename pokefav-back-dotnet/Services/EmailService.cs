using System.Net.Http;
using System.Text;
using System.Text.Json;
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
/// Implémentation de IEmailService utilisant l'API Brevo (Sendinblue).
/// En développement, si la configuration Brevo est absente, on se contente de logger.
/// </summary>
public class EmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<EmailService> _logger;
    private readonly IConfiguration _configuration;

    public EmailService(HttpClient httpClient, ILogger<EmailService> logger, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _logger = logger;
        _configuration = configuration;
    }

    public async Task SendPasswordResetEmailAsync(string to, string resetLink)
    {
        var apiKey = _configuration["Brevo:ApiKey"];
        var senderEmail = _configuration["Brevo:SenderEmail"];
        var senderName = _configuration["Brevo:SenderName"] ?? "PokeFav";

        // Si la config Brevo n'est pas définie, on reste en mode "log only" (utile en dev)
        if (string.IsNullOrWhiteSpace(apiKey) || string.IsNullOrWhiteSpace(senderEmail))
        {
            _logger.LogInformation(
                "Password reset email (Brevo NOT configured) would be sent to {Email}. Reset link: {ResetLink}",
                to,
                resetLink
            );
            return;
        }

        var payload = new
        {
            sender = new
            {
                email = senderEmail,
                name = senderName
            },
            to = new[]
            {
                new { email = to }
            },
            subject = "Réinitialisation de votre mot de passe PokeFav",
            htmlContent = $"<p>Pour réinitialiser votre mot de passe, cliquez sur ce lien :</p><p><a href=\"{resetLink}\">{resetLink}</a></p>",
            textContent = $"Pour réinitialiser votre mot de passe, ouvrez ce lien : {resetLink}"
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "https://api.brevo.com/v3/smtp/email");
        request.Headers.Add("api-key", apiKey);
        request.Content = new StringContent(
            JsonSerializer.Serialize(payload),
            Encoding.UTF8,
            "application/json"
        );

        try
        {
            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                var body = await response.Content.ReadAsStringAsync();
                _logger.LogError(
                    "Brevo email send failed with status {StatusCode}. Response: {Response}",
                    (int)response.StatusCode,
                    body
                );
            }
            else
            {
                _logger.LogInformation("Password reset email sent via Brevo to {Email}", to);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error while sending password reset email via Brevo to {Email}", to);
        }
    }
}

