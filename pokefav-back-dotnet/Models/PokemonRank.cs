namespace PokeFav.Api.Models;

public class PokemonRank
{
    public int Id { get; set; }
    public int Score { get; set; } = 0;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Clés étrangères pour la relation many-to-many User ↔ Pokemon
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int PokemonId { get; set; }
    public Pokemon Pokemon { get; set; } = null!;
}

