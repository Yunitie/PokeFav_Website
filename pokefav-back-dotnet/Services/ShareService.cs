using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PokeFav.Api.Data;
using PokeFav.Api.DTOs;
using PokeFav.Api.Models;

namespace PokeFav.Api.Services;

/// <summary>
/// Interface pour le service de partage (classement public)
/// </summary>
public interface IShareService
{
    Task<SharedUserResponseDto?> GetSharedUserRankingAsync(string publicId, CancellationToken cancellationToken = default);
}

/// <summary>
/// Service pour récupérer le classement public d'un utilisateur par publicId.
/// </summary>
public class ShareService : IShareService
{
    private readonly AppDbContext _dbContext;
    private readonly ILogger<ShareService> _logger;

    public ShareService(AppDbContext dbContext, ILogger<ShareService> logger)
    {
        _dbContext = dbContext;
        _logger = logger;
    }

    /// <summary>
    /// Récupère le classement public d'un utilisateur à partir de son publicId.
    /// </summary>
    public async Task<SharedUserResponseDto?> GetSharedUserRankingAsync(string publicId, CancellationToken cancellationToken = default)
    {
        var user = await _dbContext.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.PublicId == publicId, cancellationToken);

        if (user == null)
        {
            return null;
        }

        var ranks = await _dbContext.PokemonRanks
            .Where(r => r.UserId == user.Id)
            .OrderByDescending(r => r.Score)
            .Include(r => r.Pokemon)
                .ThenInclude(p => p.Stats)
            .ToListAsync(cancellationToken);

        var items = ranks.Select(r => new RankedPokemonDto
        {
            Score = r.Score,
            Pokemon = MapToDto(r.Pokemon)
        }).ToList();

        return new SharedUserResponseDto
        {
            DisplayName = user.DisplayName,
            Items = items
        };
    }

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
