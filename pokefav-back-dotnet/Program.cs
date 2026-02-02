using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PokeFav.Api.Data;
using PokeFav.Api.Middleware;
using PokeFav.Api.Services;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

// Charge un fichier de configuration local non commité (style .env)
// appsettings.Development.local.json est optionnel et ignoré par Git
builder.Configuration.AddJsonFile(
    "appsettings.Development.local.json",
    optional: true,
    reloadOnChange: true
);

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

// CORS : autorise ton front (dev par défaut http://localhost:3000)
var frontendUrl = builder.Configuration["Frontend:Url"] ?? "http://localhost:3000";
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(frontendUrl)
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

// Swagger/OpenAPI avec Swashbuckle
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "PokeFav API",
        Version = "v1",
        Description = "API pour l'application PokeFav"
    });

    // Configuration JWT pour Swagger (permet de tester avec token)
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Controllers (pour AuthController) avec configuration JSON standard
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Configuration JSON standard
        options.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
        options.JsonSerializerOptions.PropertyNamingPolicy = System.Text.Json.JsonNamingPolicy.CamelCase;
        options.JsonSerializerOptions.WriteIndented = true;
    });

// Services : enregistrer AuthService, EmailService et PokemonService dans le conteneur d'injection de dépendances
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IPokemonService, PokemonService>();
builder.Services.AddScoped<IShareService, ShareService>();

// Configuration JWT Authentication
var jwtSecret = builder.Configuration["Jwt:Secret"];
var jwtRefreshSecret = builder.Configuration["Jwt:RefreshSecret"];

if (string.IsNullOrWhiteSpace(jwtSecret) || string.IsNullOrWhiteSpace(jwtRefreshSecret))
{
    throw new InvalidOperationException(
        "JWT secrets are not configured. Please set Jwt:Secret and Jwt:RefreshSecret in appsettings.Development.local.json"
    );
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero // Pas de marge d'erreur sur l'expiration
        };
    });

// DbContext EF Core : connexion à PostgreSQL
// La vraie chaîne de connexion vient idéalement des variables d'environnement
//   ConnectionStrings__PokeFavDb
// et celle du appsettings.Development.json sert de valeur par défaut/documentation.
var connectionString = builder.Configuration.GetConnectionString("PokeFavDb");
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

// Rate limiting : protection contre force brute et spam (comme le backend Node.js)
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;

    options.OnRejected = async (context, token) =>
    {
        var path = context.HttpContext.Request.Path.Value ?? "";
        var (error, retryAfter) = path switch
        {
            var p when p.Contains("login", StringComparison.OrdinalIgnoreCase) => ("Too many login attempts. Please wait and try again in 15 minutes.", "15 minutes"),
            var p when p.Contains("register", StringComparison.OrdinalIgnoreCase) => ("Too many registration attempts. Please wait and try again in 1 hour.", "1 hour"),
            var p when p.Contains("forgot-password", StringComparison.OrdinalIgnoreCase) => ("Too many password reset requests. Please wait and try again in 1 hour.", "1 hour"),
            var p when p.Contains("reset-password", StringComparison.OrdinalIgnoreCase) => ("Too many password reset attempts. Please wait and try again in 15 minutes.", "15 minutes"),
            _ => ("Too many requests. Please wait and try again in a few minutes.", "a few minutes")
        };

        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json; charset=utf-8";
        await context.HttpContext.Response.WriteAsync(
            JsonSerializer.Serialize(new { error, retryAfter }),
            token);
    };

    // Login : 5 tentatives / 15 min par IP
    options.AddPolicy("login", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(15)
            }));

    // Register : 3 inscriptions / 1 h par IP
    options.AddPolicy("register", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 3,
                Window = TimeSpan.FromHours(1)
            }));

    // Forgot-password : 3 demandes / 1 h par IP
    options.AddPolicy("forgot-password", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 3,
                Window = TimeSpan.FromHours(1)
            }));

    // Reset-password : 5 tentatives / 15 min par IP
    options.AddPolicy("reset-password", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(15)
            }));
});

var app = builder.Build();

// ---------------------------------------------------------------------------
// Middleware pipeline
// ---------------------------------------------------------------------------

if (app.Environment.IsDevelopment())
{
    // Swagger UI (interface interactive pour tester l'API)
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "PokeFav API v1");
        options.RoutePrefix = "swagger"; // Accès via /swagger au lieu de /swagger/index.html
    });
}

app.UseHttpsRedirection();

// Routing explicite (important pour que les controllers fonctionnent)
app.UseRouting();

// Rate limiting (doit être après UseRouting pour avoir accès au endpoint)
app.UseRateLimiter();

// Middleware global de gestion d'erreurs (doit être avant Authentication/Authorization)
app.UseMiddleware<ErrorHandlingMiddleware>();

// CORS doit être placé après UseRouting mais avant Authentication
app.UseCors("FrontendPolicy");

// Authentication et Authorization (pour protéger les endpoints futurs)
app.UseAuthentication();
app.UseAuthorization();

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

// Health-check simple
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }))
   .WithName("HealthCheck");

// Mapper les controllers (AuthController)
app.MapControllers();

app.Run();