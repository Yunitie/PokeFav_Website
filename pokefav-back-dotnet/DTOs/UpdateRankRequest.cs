using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace PokeFav.Api.DTOs;

/// <summary>
/// DTO pour la requête POST /api/pokemon/rank (mise à jour du classement)
/// </summary>
public class UpdateRankRequest
{
    [Required(ErrorMessage = "clickedPokemonId is required")]
    [Range(1, int.MaxValue, ErrorMessage = "clickedPokemonId must be a positive integer")]
    [DefaultValue(1)]
    public int ClickedPokemonId { get; set; }

    [Required(ErrorMessage = "visiblePokemonIds is required")]
    [MinLength(1, ErrorMessage = "visiblePokemonIds must contain at least one element")]
    [DefaultValue(new int[] { 1, 2, 3 })]
    public List<int> VisiblePokemonIds { get; set; } = new();
}
