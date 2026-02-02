using Microsoft.AspNetCore.Mvc;
using PokeFav.Api.Services;

namespace PokeFav.Api.Controllers;

/// <summary>
/// Endpoints publics pour le partage de classements (sans authentification).
/// </summary>
[ApiController]
[Route("api/share")]
public class ShareController : ControllerBase
{
    private readonly IShareService _shareService;
    private readonly ILogger<ShareController> _logger;

    public ShareController(IShareService shareService, ILogger<ShareController> logger)
    {
        _shareService = shareService;
        _logger = logger;
    }

    /// <summary>
    /// Récupère le classement public d'un utilisateur à partir de son publicId.
    /// </summary>
    /// <param name="publicId">Identifiant public permanent de l'utilisateur</param>
    /// <param name="cancellationToken">Token d'annulation</param>
    /// <returns>displayName (optionnel) et items (score + pokemon)</returns>
    [HttpGet("user/{publicId}")]
    public async Task<IActionResult> GetSharedUser(
        string publicId,
        CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(publicId))
        {
            return BadRequest(new { error = "Invalid publicId" });
        }

        try
        {
            var result = await _shareService.GetSharedUserRankingAsync(publicId, cancellationToken);

            if (result == null)
            {
                return NotFound(new { error = "Not found" });
            }

            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GET /api/share/user/{PublicId} error", publicId);
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Internal Server Error" });
        }
    }
}
