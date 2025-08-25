const express = require("express");
const { prisma } = require("../../../prisma");

const router = express.Router();

/**
 * @swagger
 * /api/pokemon/{id}:
 *   get:
 *     summary: Récupérer un Pokémon par son ID
 *     description: Retourne les informations détaillées d'un Pokémon spécifique avec ses statistiques
 *     tags: [Pokémon]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID du Pokémon
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Informations du Pokémon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 pokedexId:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 artworkUrl:
 *                   type: string
 *                 type1:
 *                   type: string
 *                 type2:
 *                   type: string
 *                 generation:
 *                   type: string
 *                 height:
 *                   type: number
 *                 weight:
 *                   type: number
 *                 stats:
 *                   type: object
 *                   properties:
 *                     hp:
 *                       type: integer
 *                     attack:
 *                       type: integer
 *                     defense:
 *                       type: integer
 *                     specialAttack:
 *                       type: integer
 *                     specialDefense:
 *                       type: integer
 *                     speed:
 *                       type: integer
 *       404:
 *         description: Pokémon non trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erreur serveur
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/:id", async (req, res) => {
  try {
    const pokemonId = parseInt(req.params.id);

    if (isNaN(pokemonId)) {
      return res
        .status(400)
        .json({ error: "L'ID du Pokémon doit être un nombre valide" });
    }

    const pokemon = await prisma.pokemon.findUnique({
      where: { id: pokemonId },
      include: {
        stats: true,
      },
    });

    if (!pokemon) {
      return res.status(404).json({ error: "Pokémon non trouvé" });
    }

    return res.json(pokemon);
  } catch (error) {
    console.error("Erreur lors de la récupération du Pokémon:", error);
    return res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération du Pokémon" });
  }
});

module.exports = router;
