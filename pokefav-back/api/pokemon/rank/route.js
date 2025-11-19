const express = require("express");
const router = express.Router();

const { prisma } = require("../../../prisma"); // ajuste le chemin selon ton export
const { requireAuth } = require("../../../requireAuth"); // doit attacher userId au req.user
const logger = require("../../../utils/logger");

/**
 * @swagger
 * /api/pokemon/rank:
 *   get:
 *     summary: Récupérer le classement complet de l'utilisateur
 *     description: Retourne la liste des Pokemons classés par préférence (score décroissant) pour l'utilisateur connecté
 *     tags: [Pokémon]
 *     responses:
 *       200:
 *         description: Liste des classements de l'utilisateur
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   score:
 *                     type: integer
 *                   pokemon:
 *                     type: object
 *       401:
 *         description: Non autorisé
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
 *     security:
 *       - bearerAuth: []
 *   post:
 *     summary: Mettre à jour le classement d'un Pokémon
 *     description: Met à jour le classement d'un Pokémon pour un utilisateur
 *     tags: [Pokémon]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               clickedPokemonId:
 *                 type: integer
 *               visiblePokemonIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Classement mis à jour
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated:
 *                   type: boolean
 *                 score:
 *                   type: integer
 *       400:
 *         description: Données invalides
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       401:
 *         description: Non autorisé
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
 *     security:
 *       - bearerAuth: []
 */

router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { clickedPokemonId, visiblePokemonIds } = req.body ?? {};

    // Validation d’entrée
    if (!userId) return res.status(401).json({ error: "Unauthorized" });
    if (
      typeof clickedPokemonId !== "number" ||
      !Array.isArray(visiblePokemonIds)
    ) {
      return res.status(400).json({ error: "Invalid payload" });
    }
    // clicked doit être dans visibles
    if (!visiblePokemonIds.includes(clickedPokemonId)) {
      return res.status(400).json({
        error: "clickedPokemonId must be included in visiblePokemonIds",
      });
    }

    // Déduplique et exclut le cliqué
    const uniqueVisible = Array.from(
      new Set(visiblePokemonIds.filter((v) => typeof v === "number"))
    );
    const otherVisibleIds = uniqueVisible.filter(
      (id) => id !== clickedPokemonId
    );

    // Calcule le max des autres visibles pour cet utilisateur
    let targetScore = 1;
    if (otherVisibleIds.length > 0) {
      const agg = await prisma.pokemonRank.aggregate({
        where: { userId, pokemonId: { in: otherVisibleIds } },
        _max: { score: true },
      });
      const maxScore = agg?._max?.score ?? 0;
      targetScore = (maxScore || 0) + 1;
    }

    // Cherche l’entrée existante
    // On utilise @@unique([userId, pokemonId]) dans Prisma:
    const existing = await prisma.pokemonRank.findUnique({
      where: { userId_pokemonId: { userId, pokemonId: clickedPokemonId } },
    });

    if (!existing) {
      const created = await prisma.pokemonRank.create({
        data: { userId, pokemonId: clickedPokemonId, score: targetScore },
      });
      return res.json({ updated: true, score: created.score });
    }

    if (targetScore > existing.score) {
      const updated = await prisma.pokemonRank.update({
        where: { userId_pokemonId: { userId, pokemonId: clickedPokemonId } },
        data: { score: targetScore },
      });
      return res.json({ updated: true, score: updated.score });
    }

    return res.json({ updated: false, score: existing.score });
  } catch (err) {
    logger.error("POST /api/pokemon/rank error", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// GET: classement complet de l'utilisateur courant
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const ranks = await prisma.pokemonRank.findMany({
      where: { userId },
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

    const payload = ranks.map((r) => ({ score: r.score, pokemon: r.pokemon }));
    return res.json(payload);
  } catch (err) {
    logger.error("GET /api/pokemon/rank error", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
