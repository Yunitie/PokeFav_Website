using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokeFav.Api.Data;

namespace PokeFav.Api.Controllers;

/// <summary>
/// Controller pour les opérations de profil utilisateur (GET/DELETE /api/profile)
/// </summary>
[ApiController]
[Route("api/profile")]
public class ProfileController : ControllerBase
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;

    public ProfileController(AppDbContext dbContext, IConfiguration configuration)
    {
        _dbContext = dbContext;
        _configuration = configuration;
    }

    /// <summary>
    /// Récupère le profil de l'utilisateur courant en se basant sur le refresh token (comme en Node.js)
    /// GET /api/profile
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProfile()
    {
        // Récupérer le refresh token depuis les cookies (même logique que Node)
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken) || string.IsNullOrWhiteSpace(refreshToken))
        {
            return Unauthorized(new { error = "Not authenticated" });
        }

        var jwtRefreshSecret = _configuration["Jwt:RefreshSecret"];
        if (string.IsNullOrWhiteSpace(jwtRefreshSecret))
        {
            // Mauvaise configuration serveur : on renvoie une erreur générique
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server configuration error" });
        }

        try
        {
            // Vérification du refresh token
            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var key = System.Text.Encoding.UTF8.GetBytes(jwtRefreshSecret);

            tokenHandler.ValidateToken(refreshToken, new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out var validatedToken);

            var jwtToken = (System.IdentityModel.Tokens.Jwt.JwtSecurityToken)validatedToken;
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { error = "Invalid token" });
            }

            // Récupérer l'utilisateur depuis la base
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            // Réponse alignée avec le backend Node (/api/profile GET)
            return Ok(new
            {
                id = user.Id,
                email = user.Email,
                displayName = user.DisplayName,
                publicId = user.PublicId,
                avatar = user.Avatar,
                isVerified = user.IsVerified
            });
        }
        catch (Microsoft.IdentityModel.Tokens.SecurityTokenException)
        {
            // Token invalide ou expiré
            return Unauthorized(new { error = "Invalid token" });
        }
        catch (Exception)
        {
            // Par sécurité, on ne renvoie pas le détail de l'erreur
            return Unauthorized(new { error = "Invalid token" });
        }
    }

    /// <summary>
    /// Supprime définitivement le compte utilisateur courant
    /// DELETE /api/profile
    /// </summary>
    [HttpDelete]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> DeleteProfile()
    {
        const string cookieName = "refreshToken";

        if (!Request.Cookies.TryGetValue(cookieName, out var refreshToken) || string.IsNullOrWhiteSpace(refreshToken))
        {
            return Unauthorized(new { error = "Not authenticated" });
        }

        var jwtRefreshSecret = _configuration["Jwt:RefreshSecret"];
        if (string.IsNullOrWhiteSpace(jwtRefreshSecret))
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server configuration error" });
        }

        try
        {
            var tokenHandler = new System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler();
            var key = System.Text.Encoding.UTF8.GetBytes(jwtRefreshSecret);

            tokenHandler.ValidateToken(refreshToken, new Microsoft.IdentityModel.Tokens.TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out var validatedToken);

            var jwtToken = (System.IdentityModel.Tokens.Jwt.JwtSecurityToken)validatedToken;
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == System.Security.Claims.ClaimTypes.NameIdentifier);

            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var userId))
            {
                return Unauthorized(new { error = "Invalid token" });
            }

            // Supprimer l'utilisateur
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                _dbContext.Users.Remove(user);
                await _dbContext.SaveChangesAsync();
            }

            // Supprimer le cookie côté client
            var requireHttps = _configuration.GetValue<bool>("Jwt:RequireHttps", false)
                               || !HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment();

            Response.Cookies.Delete(cookieName, new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Secure = requireHttps,
                Path = "/"
            });

            return NoContent();
        }
        catch (Microsoft.IdentityModel.Tokens.SecurityTokenException)
        {
            return Unauthorized(new { error = "Invalid token" });
        }
        catch (Exception)
        {
            // Erreur serveur générique
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server error" });
        }
    }
}

