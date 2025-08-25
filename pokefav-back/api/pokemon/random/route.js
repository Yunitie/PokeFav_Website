const express = require("express");
const { prisma } = require("../../../prisma");

const router = express.Router();

/**
 * @swagger
 * /api/pokemon/random:
 *   get:
 *     summary: Récupérer un Pokémon aléatoire
 *     description: Retourne un Pokémon aléatoire sélectionné dans toute la table Pokemon
 *     tags: [Pokémon]
 *     responses:
 *       200:
 *         description: Pokémon aléatoire avec ses statistiques
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
router.get("/", async (req, res) => {
  try {
    // Récupère le nombre total de Pokémon dans la base
    const totalPokemon = await prisma.pokemon.count();

    if (totalPokemon === 0) {
      return res
        .status(404)
        .json({ error: "Aucun Pokémon trouvé dans la base de données" });
    }

    // Génère un offset aléatoire
    const randomOffset = Math.floor(Math.random() * totalPokemon);

    // Récupère un Pokémon aléatoire avec ses statistiques
    const randomPokemon = await prisma.pokemon.findFirst({
      skip: randomOffset,
      include: {
        stats: true,
      },
    });

    if (!randomPokemon) {
      return res
        .status(404)
        .json({ error: "Erreur lors de la sélection du Pokémon aléatoire" });
    }

    return res.json(randomPokemon);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération du Pokémon aléatoire:",
      error
    );
    return res.status(500).json({
      error: "Erreur serveur lors de la récupération du Pokémon aléatoire",
    });
  }
});

module.exports = router;
