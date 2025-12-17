namespace PokeFav.Api.Models;

public class PokemonStats
{
    public int Id { get; set; }
    public int Hp { get; set; }
    public int Attack { get; set; }
    public int Defense { get; set; }
    public int SpecialAttack { get; set; }
    public int SpecialDefense { get; set; }
    public int Speed { get; set; }

    // Relation : PokemonStats a un Pokemon (relation 1:1)
    public Pokemon? Pokemon { get; set; }
}

