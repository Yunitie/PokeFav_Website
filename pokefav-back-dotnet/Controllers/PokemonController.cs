using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using PokeFav.Api.DTOs;
using PokeFav.Api.Services;
using PokeFav.Api.Utils;

namespace PokeFav.Api.Controllers;

/// <summary>
/// Controller pour les opérations liées aux Pokemon
/// </summary>
[ApiController]
[Route("api/pokemon")]
public class PokemonController : ControllerBase
{
    private readonly IPokemonService _pokemonService;
    private readonly IConfiguration _configuration;
    private readonly ILogger<PokemonController> _logger;

    public PokemonController(IPokemonService pokemonService, IConfiguration configuration, ILogger<PokemonController> logger)
    {
        _pokemonService = pokemonService;
        _configuration = configuration;
        _logger = logger;
    }

    /// <summary>
    /// Récupère un Pokemon par son ID
    /// GET /api/pokemon/{id}
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PokemonDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetById(int id)
    {
        if (id <= 0)
        {
            return BadRequest(new { error = "L'ID du Pokémon doit être un nombre valide" });
        }

        try
        {
            var pokemon = await _pokemonService.GetByIdAsync(id);
            if (pokemon == null)
            {
                return NotFound(new { error = "Pokémon non trouvé" });
            }

            return Ok(pokemon);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Erreur serveur lors de la récupération du Pokémon" });
        }
    }

    /// <summary>
    /// Récupère un Pokemon aléatoire (avec filtre optionnel par générations)
    /// GET /api/pokemon/random?generations=1,2,3
    /// </summary>
    [HttpGet("random")]
    [ProducesResponseType(typeof(PokemonDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetRandom([FromQuery] string? generations = null)
    {
        try
        {
            // Parser les générations depuis la query string (format: "1,2,3")
            List<string>? generationList = null;
            if (!string.IsNullOrWhiteSpace(generations))
            {
                generationList = generations
                    .Split(',', StringSplitOptions.RemoveEmptyEntries)
                    .Select(g => g.Trim())
                    .Where(g => !string.IsNullOrWhiteSpace(g))
                    .ToList();
            }

            var pokemon = await _pokemonService.GetRandomAsync(generationList);
            if (pokemon == null)
            {
                var errorMessage = generationList != null && generationList.Count > 0
                    ? "Aucun Pokémon trouvé dans la base de données pour les générations sélectionnées"
                    : "Erreur lors de la sélection du Pokémon aléatoire";

                return NotFound(new { error = errorMessage });
            }

            return Ok(pokemon);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Erreur serveur lors de la récupération du Pokémon aléatoire" });
        }
    }

    /// <summary>
    /// Récupère le classement complet de l'utilisateur connecté
    /// GET /api/pokemon/rank
    /// </summary>
    [HttpGet("rank")]
    [ProducesResponseType(typeof(List<RankedPokemonDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetRanking()
    {
        // Récupérer le refresh token depuis les cookies
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken) || string.IsNullOrWhiteSpace(refreshToken))
        {
            return Unauthorized(new { error = "Unauthorized" });
        }

        var jwtRefreshSecret = _configuration["Jwt:RefreshSecret"];
        if (string.IsNullOrWhiteSpace(jwtRefreshSecret))
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server configuration error" });
        }

        // Extraire le userId depuis le refresh token
        var userId = TokenHelper.GetUserIdFromRefreshToken(refreshToken, jwtRefreshSecret);
        if (userId == null)
        {
            return Unauthorized(new { error = "Unauthorized" });
        }

        try
        {
            var ranking = await _pokemonService.GetRankingAsync(userId.Value);
            return Ok(ranking);
        }
        catch (Exception)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Internal Server Error" });
        }
    }

    /// <summary>
    /// Met à jour le classement d'un Pokemon pour l'utilisateur connecté
    /// POST /api/pokemon/rank
    /// </summary>
    [HttpPost("rank")]
    [ProducesResponseType(typeof(UpdateRankResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(object), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> UpdateRank([FromBody] UpdateRankRequest request)
    {
        // Récupérer le refresh token depuis les cookies
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken) || string.IsNullOrWhiteSpace(refreshToken))
        {
            return Unauthorized(new { error = "Unauthorized" });
        }

        var jwtRefreshSecret = _configuration["Jwt:RefreshSecret"];
        if (string.IsNullOrWhiteSpace(jwtRefreshSecret))
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server configuration error" });
        }

        // Extraire le userId depuis le refresh token
        var userId = TokenHelper.GetUserIdFromRefreshToken(refreshToken, jwtRefreshSecret);
        if (userId == null)
        {
            return Unauthorized(new { error = "Unauthorized" });
        }

        // Validation du modèle (les attributs [Required] sont vérifiés automatiquement)
        if (!ModelState.IsValid)
        {
            return BadRequest(new { error = "Invalid payload" });
        }

        try
        {
            var response = await _pokemonService.UpdateRankAsync(
                userId.Value,
                request.ClickedPokemonId,
                request.VisiblePokemonIds
            );

            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            // Log l'erreur pour le débogage
            _logger.LogError(ex, "Error updating Pokemon rank");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Internal Server Error" });
        }
    }
}
