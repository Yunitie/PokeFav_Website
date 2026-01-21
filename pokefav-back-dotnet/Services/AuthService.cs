using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using PokeFav.Api.Data;
using PokeFav.Api.DTOs;
using PokeFav.Api.Models;
using PokeFav.Api.Utils;
using BCrypt.Net;

namespace PokeFav.Api.Services;

/// <summary>
/// Service d'authentification : gère la logique métier pour register/login
/// </summary>
public interface IAuthService
{
    Task<RegisterResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task ForgotPasswordAsync(string email);
    Task ResetPasswordAsync(string email, string token, string newPassword);
}

public class AuthService : IAuthService
{
    private readonly AppDbContext _dbContext;
    private readonly IConfiguration _configuration;
    private readonly IEmailService _emailService;
    private const int BcryptWorkFactor = 10; // Même coût qu'en Node.js

    public AuthService(AppDbContext dbContext, IConfiguration configuration, IEmailService emailService)
    {
        _dbContext = dbContext;
        _configuration = configuration;
        _emailService = emailService;
    }

    /// <summary>
    /// Inscription d'un nouvel utilisateur
    /// </summary>
    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
    {
        // Validation email
        var (emailValid, emailError, normalizedEmail) = EmailValidator.Validate(request.Email);
        if (!emailValid || normalizedEmail == null)
        {
            throw new ArgumentException(emailError ?? "Invalid email.");
        }

        // Validation mot de passe
        var (passwordValid, passwordError) = PasswordValidator.Validate(request.Password);
        if (!passwordValid)
        {
            throw new ArgumentException(passwordError ?? "Invalid password.");
        }

        // Vérifier si l'email existe déjà
        var existingUser = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        if (existingUser != null)
        {
            throw new InvalidOperationException("This email is already in use.");
        }

        // Hasher le mot de passe
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password, BcryptWorkFactor);

        // Créer l'utilisateur
        var user = new User
        {
            Email = normalizedEmail,
            Password = hashedPassword,
            DisplayName = request.DisplayName
        };

        _dbContext.Users.Add(user);
        await _dbContext.SaveChangesAsync();

        return new RegisterResponse
        {
            Id = user.Id,
            Email = user.Email,
            DisplayName = user.DisplayName
        };
    }

    /// <summary>
    /// Connexion d'un utilisateur
    /// </summary>
    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        // Validation email
        var (emailValid, emailError, normalizedEmail) = EmailValidator.Validate(request.Email);
        if (!emailValid || normalizedEmail == null)
        {
            throw new ArgumentException(emailError ?? "Invalid email.");
        }

        // Chercher l'utilisateur
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        // Sécurité : toujours faire le hash même si l'utilisateur n'existe pas
        // pour éviter les timing attacks
        var passwordMatch = user != null && BCrypt.Net.BCrypt.Verify(request.Password, user.Password);

        if (user == null || !passwordMatch)
        {
            throw new UnauthorizedAccessException("Incorrect email or password.");
        }

        // Générer les tokens JWT
        var accessToken = GenerateAccessToken(user);
        var refreshToken = GenerateRefreshToken(user);

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken, // Pour le cookie
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                DisplayName = user.DisplayName
            }
        };
    }

    /// <summary>
    /// Demande de réinitialisation de mot de passe.
    /// </summary>
    public async Task ForgotPasswordAsync(string email)
    {
        // Validation email
        var (emailValid, emailError, normalizedEmail) = EmailValidator.Validate(email);
        if (!emailValid || normalizedEmail == null)
        {
            throw new ArgumentException(emailError ?? "Invalid email.");
        }

        // Chercher l'utilisateur
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        // Sécurité : ne jamais révéler si l'utilisateur existe ou non
        if (user == null)
        {
            // On s'arrête là, la réponse du contrôleur sera la même
            return;
        }

        // Générer un token sécurisé (32 octets aléatoires, encodés en base64)
        var tokenBytes = RandomNumberGenerator.GetBytes(32);
        var token = Convert.ToBase64String(tokenBytes);

        // Date d'expiration (ex : 1 heure)
        var expiresAt = DateTime.UtcNow.AddHours(1);

        user.ResetPasswordToken = token;
        user.ResetPasswordTokenExpiry = expiresAt;

        await _dbContext.SaveChangesAsync();

        // Construire le lien de reset vers le front
        var frontendUrl = _configuration["Frontend:Url"] ?? "http://localhost:3000";
        var encodedEmail = Uri.EscapeDataString(normalizedEmail);
        var encodedToken = Uri.EscapeDataString(token);

        var resetLink = $"{frontendUrl}/reset-password?email={encodedEmail}&token={encodedToken}";

        // Envoyer l'email via le service dédié
        await _emailService.SendPasswordResetEmailAsync(normalizedEmail, resetLink);
    }

    /// <summary>
    /// Réinitialisation de mot de passe à partir d'un token valide.
    /// </summary>
    public async Task ResetPasswordAsync(string email, string token, string newPassword)
    {
        // Important : le token peut arriver encodé en URL (depuis le lien de l'email)
        // On le décode systématiquement pour le comparer à la valeur stockée en base.
        var decodedToken = Uri.UnescapeDataString(token);

        // Validation email
        var (emailValid, emailError, normalizedEmail) = EmailValidator.Validate(email);
        if (!emailValid || normalizedEmail == null)
        {
            throw new ArgumentException(emailError ?? "Invalid email.");
        }

        // Validation mot de passe
        var (passwordValid, passwordError) = PasswordValidator.Validate(newPassword);
        if (!passwordValid)
        {
            throw new ArgumentException(passwordError ?? "Invalid password.");
        }

        // Chercher l'utilisateur
        var user = await _dbContext.Users
            .FirstOrDefaultAsync(u => u.Email == normalizedEmail);

        // Vérifier la validité du token
        var now = DateTime.UtcNow;
        var hasValidToken =
            user != null &&
            !string.IsNullOrWhiteSpace(user.ResetPasswordToken) &&
            string.Equals(user.ResetPasswordToken, decodedToken, StringComparison.Ordinal) &&
            user.ResetPasswordTokenExpiry.HasValue &&
            user.ResetPasswordTokenExpiry.Value >= now;

        if (!hasValidToken)
        {
            // Message générique pour éviter de donner des indices
            throw new InvalidOperationException("Invalid or expired password reset link.");
        }

        // À partir d'ici, user ne peut plus être null grâce au test précédent

        // Mettre à jour le mot de passe (hashé)
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(newPassword, BcryptWorkFactor);
        user!.Password = hashedPassword;

        // Invalider le token (one-time)
        user.ResetPasswordToken = null;
        user.ResetPasswordTokenExpiry = null;

        await _dbContext.SaveChangesAsync();
    }

    /// <summary>
    /// Génère un access token JWT (15 minutes)
    /// </summary>
    private string GenerateAccessToken(User user)
    {
        var jwtSecret = _configuration["Jwt:Secret"];
        if (string.IsNullOrWhiteSpace(jwtSecret))
        {
            throw new InvalidOperationException("JWT Secret is not configured.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: null,
            audience: null,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(15), // 15 minutes comme en Node.js
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    /// <summary>
    /// Génère un refresh token JWT (1 jour)
    /// </summary>
    private string GenerateRefreshToken(User user)
    {
        var jwtRefreshSecret = _configuration["Jwt:RefreshSecret"];
        if (string.IsNullOrWhiteSpace(jwtRefreshSecret))
        {
            throw new InvalidOperationException("JWT Refresh Secret is not configured.");
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtRefreshSecret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: null,
            audience: null,
            claims: claims,
            expires: DateTime.UtcNow.AddDays(1), // 1 jour comme en Node.js
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

