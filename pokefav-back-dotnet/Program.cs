using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using PokeFav.Api.Data;
using PokeFav.Api.Services;
using System.Text;

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

// Services : enregistrer AuthService et EmailService dans le conteneur d'injection de dépendances
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IEmailService, EmailService>();

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