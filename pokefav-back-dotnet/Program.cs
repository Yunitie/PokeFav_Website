using Microsoft.EntityFrameworkCore;
using PokeFav.Api.Data;

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

// OpenAPI (intégré dans .NET 10, pas besoin de Swashbuckle)
builder.Services.AddOpenApi();

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
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// CORS doit être placé avant le mapping des endpoints
app.UseCors("FrontendPolicy");

// ---------------------------------------------------------------------------
// Endpoints
// ---------------------------------------------------------------------------

// Health-check simple
app.MapGet("/api/health", () => Results.Ok(new { status = "ok" }))
   .WithName("HealthCheck");

// 🔍 Endpoint de test EF / DB
app.MapGet("/api/debug/users-count", async (AppDbContext db) =>
{
    var count = await db.Users.CountAsync();
    return Results.Ok(new { usersCount = count });
});

app.Run();
