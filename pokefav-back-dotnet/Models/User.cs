namespace PokeFav.Api.Models;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public string? DisplayName { get; set; }
    public string? Avatar { get; set; }
    public bool IsVerified { get; set; } = false;
    public string? ResetPasswordToken { get; set; }
    public DateTime? ResetPasswordTokenExpiry { get; set; }
    public string PublicId { get; set; } = Guid.NewGuid().ToString();

    // Relation : un User peut avoir plusieurs PokemonRank
    public ICollection<PokemonRank> PokemonRanks { get; set; } = new List<PokemonRank>();
}

