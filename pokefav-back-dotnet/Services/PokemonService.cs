using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PokeFav.Api.Data;
using PokeFav.Api.DTOs;
using PokeFav.Api.Models;

namespace PokeFav.Api.Services;

/// <summary>
/// Interface pour le service Pokemon (logique métier)
/// </summary>
public interface IPokemonService
{
    Task<PokemonDto?> GetByIdAsync(int pokemonId, CancellationToken cancellationToken = default);
    Task<PokemonDto?> GetRandomAsync(List<string>? generations = null, CancellationToken cancellationToken = default);
    Task<List<RankedPokemonDto>> GetRankingAsync(int userId, CancellationToken cancellationToken = default);
    Task<UpdateRankResponse> UpdateRankAsync(int userId, int clickedPokemonId, List<int> visiblePokemonIds, CancellationToken cancellationToken = default);
}

/// <summary>
/// Service pour gérer les opérations liées aux Pokemon (logique métier)
/// </summary>
public class PokemonService : IPokemonService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<PokemonService> _logger;

    public PokemonService(AppDbContext dbContext, ILogger<PokemonService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Récupère un Pokemon par son ID avec ses statistiques
    /// </summary>
    public async Task<PokemonDto?> GetByIdAsync(int pokemonId, CancellationToken cancellationToken = default)
    {
        var pokemon = await _dbContext.Pokemons
            .Include(p => p.Stats)
            .FirstOrDefaultAsync(p => p.Id == pokemonId, cancellationToken);

        if (pokemon == null)
        {
            return null;
        }

        return MapToDto(pokemon);
    }

    /// <summary>
    /// Récupère un Pokemon aléatoire (avec filtre optionnel par générations)
    /// </summary>
    public async Task<PokemonDto?> GetRandomAsync(List<string>? generations = null, CancellationToken cancellationToken = default)
    {
        // Construire le filtre de génération si fourni
        var query = _dbContext.Pokemons.AsQueryable();
        if (generations != null && generations.Count > 0)
        {
            query = query.Where(p => generations.Contains(p.Generation));
        }

        // Compter le total de Pokemon correspondants
        var totalPokemon = await query.CountAsync(cancellationToken);
        if (totalPokemon == 0)
        {
            return null;
        }

        // Générer un offset aléatoire (thread-safe)
        var randomOffset = Random.Shared.Next(0, totalPokemon);

        // Récupérer un Pokemon aléatoire avec ses statistiques
        var randomPokemon = await query
            .Include(p => p.Stats)
            .Skip(randomOffset)
            .FirstOrDefaultAsync(cancellationToken);

        if (randomPokemon == null)
        {
            return null;
        }

        return MapToDto(randomPokemon);
    }

    /// <summary>
    /// Récupère le classement complet d'un utilisateur (trié par score décroissant)
    /// </summary>
    public async Task<List<RankedPokemonDto>> GetRankingAsync(int userId, CancellationToken cancellationToken = default)
    {
        var ranks = await _dbContext.PokemonRanks
            .Where(r => r.UserId == userId)
            .OrderByDescending(r => r.Score)
            .Include(r => r.Pokemon)
                .ThenInclude(p => p.Stats)
            .ToListAsync(cancellationToken);

        return ranks.Select(r => new RankedPokemonDto
        {
            Score = r.Score,
            Pokemon = MapToDto(r.Pokemon)
        }).ToList();
    }

    /// <summary>
    /// Met à jour le classement d'un Pokemon pour un utilisateur
    /// Logique : le Pokemon cliqué obtient un score = max(autres visibles) + 1
    /// </summary>
    public async Task<UpdateRankResponse> UpdateRankAsync(int userId, int clickedPokemonId, List<int> visiblePokemonIds, CancellationToken cancellationToken = default)
    {
        try
        {
            // Validation : clickedPokemonId doit être dans visiblePokemonIds
            if (!visiblePokemonIds.Contains(clickedPokemonId))
            {
                throw new ArgumentException("clickedPokemonId must be included in visiblePokemonIds");
            }

            // Dédupliquer et exclure le Pokemon cliqué
            var uniqueVisible = visiblePokemonIds.Distinct().ToList();
            var otherVisibleIds = uniqueVisible.Where(id => id != clickedPokemonId).ToList();

            // Calculer le score cible : max des autres visibles + 1
            int targetScore = 1;
            if (otherVisibleIds.Count > 0)
            {
                var maxScore = await _dbContext.PokemonRanks
                    .Where(r => r.UserId == userId && otherVisibleIds.Contains(r.PokemonId))
                    .Select(r => (int?)r.Score)
                    .MaxAsync(cancellationToken);

                targetScore = (maxScore ?? 0) + 1;
            }

            // Chercher l'entrée existante (contrainte unique sur userId + pokemonId)
            var existing = await _dbContext.PokemonRanks
                .FirstOrDefaultAsync(r => r.UserId == userId && r.PokemonId == clickedPokemonId, cancellationToken);

            if (existing == null)
            {
                // Créer une nouvelle entrée
                // Utiliser DateTime.UtcNow pour CreatedAt et UpdatedAt
                var created = new PokemonRank
                {
                    UserId = userId,
                    PokemonId = clickedPokemonId,
                    Score = targetScore,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };

                _dbContext.PokemonRanks.Add(created);
                await _dbContext.SaveChangesAsync(cancellationToken);

                return new UpdateRankResponse
                {
                    Updated = true,
                    Score = created.Score
                };
            }

            // Mettre à jour seulement si le nouveau score est supérieur
            if (targetScore > existing.Score)
            {
                existing.Score = targetScore;
                existing.UpdatedAt = DateTime.UtcNow; // Mettre à jour UpdatedAt manuellement
                await _dbContext.SaveChangesAsync(cancellationToken);

                return new UpdateRankResponse
                {
                    Updated = true,
                    Score = existing.Score
                };
            }

            // Pas de mise à jour nécessaire
            return new UpdateRankResponse
            {
                Updated = false,
                Score = existing.Score
            };
        }
        catch (Exception ex)
        {
            // Log l'erreur pour le débogage
            _logger.LogError(ex, "Error updating Pokemon rank for userId {UserId}, clickedPokemonId {ClickedPokemonId}", userId, clickedPokemonId);
            throw; // Re-lancer l'exception pour que le controller puisse la gérer
        }
    }

    /// <summary>
    /// Mappe un Pokemon (entité) vers un PokemonDto
    /// </summary>
    private static PokemonDto MapToDto(Pokemon pokemon)
    {
        return new PokemonDto
        {
            Id = pokemon.Id,
            PokedexId = pokemon.PokedexId,
            Name = pokemon.Name,
            ArtworkUrl = pokemon.ArtworkUrl,
            Type1 = pokemon.Type1,
            Type2 = pokemon.Type2,
            Generation = pokemon.Generation,
            Height = pokemon.Height,
            Weight = pokemon.Weight,
            Stats = new PokemonStatsDto
            {
                Hp = pokemon.Stats.Hp,
                Attack = pokemon.Stats.Attack,
                Defense = pokemon.Stats.Defense,
                SpecialAttack = pokemon.Stats.SpecialAttack,
                SpecialDefense = pokemon.Stats.SpecialDefense,
                Speed = pokemon.Stats.Speed
            }
        };
    }
}
