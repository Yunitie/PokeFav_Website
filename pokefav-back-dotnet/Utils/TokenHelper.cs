using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace PokeFav.Api.Utils;

/// <summary>
/// Utilitaire pour extraire le userId depuis un refresh token JWT
/// </summary>
public static class TokenHelper
{
    /// <summary>
    /// Valide un refresh token et retourne le userId s'il est valide
    /// </summary>
    /// <param name="refreshToken">Le token JWT à valider</param>
    /// <param name="jwtRefreshSecret">Le secret pour valider le token</param>
    /// <returns>Le userId si le token est valide, null sinon</returns>
    public static int? GetUserIdFromRefreshToken(string refreshToken, string jwtRefreshSecret)
    {
        if (string.IsNullOrWhiteSpace(refreshToken) || string.IsNullOrWhiteSpace(jwtRefreshSecret))
        {
            return null;
        }

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = System.Text.Encoding.UTF8.GetBytes(jwtRefreshSecret);

            tokenHandler.ValidateToken(refreshToken, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out var validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return null;
            }

            return userId;
        }
        catch
        {
            // Token invalide ou expiré
            return null;
        }
    }

    /// <summary>
    /// Récupère le userId depuis la requête HTTP (cookie refreshToken)
    /// Centralise la logique d'authentification répétée dans les controllers
    /// </summary>
    /// <param name="request">La requête HTTP</param>
    /// <param name="configuration">La configuration pour récupérer le JWT secret</param>
    /// <returns>Le userId si authentifié, null sinon</returns>
    public static int? GetUserIdFromRequest(HttpRequest request, IConfiguration configuration)
    {
        // Récupérer le refresh token depuis les cookies
        if (!request.Cookies.TryGetValue("refreshToken", out var refreshToken) || string.IsNullOrWhiteSpace(refreshToken))
        {
            return null; // Pas authentifié
        }

        var jwtRefreshSecret = configuration["Jwt:RefreshSecret"];
        if (string.IsNullOrWhiteSpace(jwtRefreshSecret))
        {
            return null; // Configuration invalide (sera géré par le controller avec une erreur 500)
        }

        // Extraire le userId depuis le refresh token
        return GetUserIdFromRefreshToken(refreshToken, jwtRefreshSecret);
    }
}
