using Microsoft.AspNetCore.Mvc;
using PokeFav.Api.DTOs;
using PokeFav.Api.Services;

namespace PokeFav.Api.Controllers;

/// <summary>
/// Controller pour l'authentification (register/login)
/// </summary>
[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IConfiguration _configuration;

    public AuthController(IAuthService authService, IConfiguration configuration)
    {
        _authService = authService;
        _configuration = configuration;
    }

    /// <summary>
    /// Inscription d'un nouvel utilisateur
    /// POST /api/auth/register
    /// </summary>
    [HttpPost("register")]
    [ProducesResponseType(typeof(RegisterResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        // La validation des Data Annotations se fait automatiquement
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var response = await _authService.RegisterAsync(request);
            return Ok(response);
        }
        catch (ArgumentException ex)
        {
            // Erreur de validation (email/password invalide)
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Email déjà utilisé
            return Conflict(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Connexion d'un utilisateur
    /// POST /api/auth/login
    /// </summary>
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        // La validation des Data Annotations se fait automatiquement
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var response = await _authService.LoginAsync(request);

            // Définir le refresh token dans un cookie (comme en Node.js)
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Secure = _configuration.GetValue<bool>("Jwt:RequireHttps", false) || !HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment(),
                SameSite = SameSiteMode.Strict,
                Path = "/",
                MaxAge = TimeSpan.FromDays(1) // 1 jour
            };

            Response.Cookies.Append("refreshToken", response.RefreshToken, cookieOptions);

            // Ne pas retourner le refreshToken dans le JSON (il est dans le cookie)
            var responseWithoutRefreshToken = new
            {
                accessToken = response.AccessToken,
                user = response.User
            };

            return Ok(responseWithoutRefreshToken);
        }
        catch (ArgumentException ex)
        {
            // Erreur de validation
            return BadRequest(new { error = ex.Message });
        }
        catch (UnauthorizedAccessException ex)
        {
            // Identifiants incorrects
            return Unauthorized(new { error = ex.Message });
        }
    }
}

