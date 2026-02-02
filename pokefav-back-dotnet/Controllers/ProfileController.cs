using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PokeFav.Api.Data;
using PokeFav.Api.Utils;

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
    public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
    {
        // Récupérer le userId depuis la requête (authentification centralisée)
        var userId = TokenHelper.GetUserIdFromRequest(Request, _configuration);
        if (userId == null)
        {
            // Vérifier si c'est un problème de configuration serveur
            var jwtRefreshSecret = _configuration["Jwt:RefreshSecret"];
            if (string.IsNullOrWhiteSpace(jwtRefreshSecret))
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server configuration error" });
            }
            return Unauthorized(new { error = "Not authenticated" });
        }

        try
        {
            // Récupérer l'utilisateur depuis la base
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId.Value, cancellationToken);
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
    public async Task<IActionResult> DeleteProfile(CancellationToken cancellationToken)
    {
        // Récupérer le userId depuis la requête (authentification centralisée)
        var userId = TokenHelper.GetUserIdFromRequest(Request, _configuration);
        if (userId == null)
        {
            // Vérifier si c'est un problème de configuration serveur
            var jwtRefreshSecret = _configuration["Jwt:RefreshSecret"];
            if (string.IsNullOrWhiteSpace(jwtRefreshSecret))
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server configuration error" });
            }
            return Unauthorized(new { error = "Not authenticated" });
        }

        try
        {
            // Supprimer l'utilisateur
            var user = await _dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId.Value, cancellationToken);
            if (user != null)
            {
                _dbContext.Users.Remove(user);
                await _dbContext.SaveChangesAsync(cancellationToken);
            }

            // Supprimer le cookie côté client
            const string cookieName = "refreshToken";
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
        catch (Exception)
        {
            // Erreur serveur générique
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server error" });
        }
    }
}

