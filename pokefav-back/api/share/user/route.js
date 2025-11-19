const express = require("express");
const router = express.Router();

const { prisma } = require("../../../prisma");
const logger = require("../../../utils/logger");

/**
 * @swagger
 * /api/share/user/{publicId}:
 *   get:
 *     summary: Get a user's public ranking by publicId
 *     description: Returns a user's current Pokémon ranking in read-only form using their permanent publicId.
 *     tags: [Share]
 *     parameters:
 *       - in: path
 *         name: publicId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user's permanent public identifier
 *     responses:
 *       200:
 *         description: Ranking fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 displayName:
 *                   type: string
 *                   description: Optional display name of the user
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       score:
 *                         type: integer
 *                       pokemon:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           pokedexId:
 *                             type: integer
 *                           name:
 *                             type: string
 *                           artworkUrl:
 *                             type: string
 *                           type1:
 *                             type: string
 *                           type2:
 *                             type: string
 *                             nullable: true
 *                           generation:
 *                             type: string
 *                           height:
 *                             type: number
 *                           weight:
 *                             type: number
 *                           stats:
 *                             type: object
 *                             properties:
 *                               hp: { type: integer }
 *                               attack: { type: integer }
 *                               defense: { type: integer }
 *                               specialAttack: { type: integer }
 *                               specialDefense: { type: integer }
 *                               speed: { type: integer }
 *       400:
 *         description: Invalid publicId
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */

/**
 * Public: Get a user's current ranking by their publicId
 * Route: GET /api/share/user/:publicId
 * Response: {
 *   displayName?: string,
 *   items: Array<{ score: number, pokemon: Pokemon }>
 * }
 */
router.get("/:publicId", async (req, res) => {
  try {
    const { publicId } = req.params;
    if (!publicId || typeof publicId !== "string") {
      return res.status(400).json({ error: "Invalid publicId" });
    }

    const user = await prisma.user.findUnique({ where: { publicId } });
    if (!user) {
      return res.status(404).json({ error: "Not found" });
    }

    const ranks = await prisma.pokemonRank.findMany({
      where: { userId: user.id },
      orderBy: { score: "desc" },
      include: {
        pokemon: {
          select: {
            id: true,
            pokedexId: true,
            name: true,
            artworkUrl: true,
            type1: true,
            type2: true,
            generation: true,
            height: true,
            weight: true,
            stats: {
              select: {
                hp: true,
                attack: true,
                defense: true,
                specialAttack: true,
                specialDefense: true,
                speed: true,
              },
            },
          },
        },
      },
    });

    const items = ranks.map((r) => ({ score: r.score, pokemon: r.pokemon }));
    const payload = {};
    if (user.displayName) payload.displayName = user.displayName;
    payload.items = items;

    return res.json(payload);
  } catch (err) {
    logger.error("GET /api/share/user/:publicId error", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
