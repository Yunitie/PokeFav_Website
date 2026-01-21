using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
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

    /// <summary>
    /// Rafraîchir le token d'accès à partir du refresh token stocké en cookie
    /// POST /api/auth/refresh
    /// </summary>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    public IActionResult RefreshAccessToken()
    {
        // Récupérer le refresh token depuis les cookies (même logique que Node.js)
        if (!Request.Cookies.TryGetValue("refreshToken", out var refreshToken) || string.IsNullOrWhiteSpace(refreshToken))
        {
            return BadRequest(new { error = "Refresh token missing." });
        }

        var jwtSecret = _configuration["Jwt:Secret"];
        var jwtRefreshSecret = _configuration["Jwt:RefreshSecret"];

        if (string.IsNullOrWhiteSpace(jwtSecret) || string.IsNullOrWhiteSpace(jwtRefreshSecret))
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = "Server configuration error" });
        }

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var refreshKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtRefreshSecret));

            tokenHandler.ValidateToken(refreshToken, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = refreshKey,
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out var validatedToken);

            var jwtToken = (JwtSecurityToken)validatedToken;
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
            var emailClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email);

            if (userIdClaim == null || emailClaim == null)
            {
                return Unauthorized(new { error = "Invalid or expired refresh token." });
            }

            // Générer un nouveau access token (15 minutes) avec les mêmes infos que LoginAsync
            var accessKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var credentials = new SigningCredentials(accessKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userIdClaim.Value),
                new Claim(ClaimTypes.Email, emailClaim.Value),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var accessToken = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(15),
                signingCredentials: credentials
            );

            var accessTokenString = new JwtSecurityTokenHandler().WriteToken(accessToken);

            return Ok(new { accessToken = accessTokenString });
        }
        catch (SecurityTokenException)
        {
            return Unauthorized(new { error = "Invalid or expired refresh token." });
        }
        catch (Exception)
        {
            // Par sécurité, on ne renvoie pas le détail de l'erreur
            return Unauthorized(new { error = "Invalid or expired refresh token." });
        }
    }

    /// <summary>
    /// Déconnexion utilisateur : supprime le cookie refreshToken
    /// POST /api/auth/logout
    /// </summary>
    [HttpPost("logout")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public IActionResult Logout()
    {
        var requireHttps = _configuration.GetValue<bool>("Jwt:RequireHttps", false)
                           || !HttpContext.RequestServices.GetRequiredService<IWebHostEnvironment>().IsDevelopment();

        Response.Cookies.Delete("refreshToken", new CookieOptions
        {
            HttpOnly = true,
            Secure = requireHttps,
            SameSite = SameSiteMode.Strict,
            Path = "/"
        });

        return Ok(new { message = "Déconnexion réussie." });
    }

    /// <summary>
    /// Demande de réinitialisation de mot de passe.
    /// POST /api/auth/forgot-password
    /// </summary>
    [HttpPost("forgot-password")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        // Validation des Data Annotations
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _authService.ForgotPasswordAsync(request.Email);

            // Réponse générique, même si l'utilisateur n'existe pas
            return Ok(new { message = "If an account with this email exists, a reset link has been sent." });
        }
        catch (ArgumentException ex)
        {
            // Erreur de validation (email invalide)
            return BadRequest(new { error = ex.Message });
        }
    }

    /// <summary>
    /// Réinitialisation de mot de passe.
    /// POST /api/auth/reset-password
    /// </summary>
    [HttpPost("reset-password")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        // Validation des Data Annotations
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            await _authService.ResetPasswordAsync(request.Email, request.Token, request.NewPassword);

            return Ok(new { message = "Password has been reset successfully." });
        }
        catch (ArgumentException ex)
        {
            // Erreurs de validation (email/password)
            return BadRequest(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            // Token invalide/expiré
            return BadRequest(new { error = ex.Message });
        }
    }
}

