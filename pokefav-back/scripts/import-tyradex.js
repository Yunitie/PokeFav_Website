/*
  Script d'import des Pokémon depuis l'API Tyradex vers la base via Prisma.

  Comment ça marche ?
  1) On importe par génération (1, 2, 3, 4, 5, 6, 7, 8, 9)
  2) Pour chaque génération, on fait une requête à /pokemon/generation/{id}
  3) On traite toutes les entrées de la génération (base et formes confondues)
  4) On effectue un upsert pour chaque entrée

  Exécution:
    - node scripts/import-tyradex.js

  Pré-requis:
    - Node 18+ (fetch natif)
    - DATABASE_URL configuré (fichier .env ou variable d'environnement)
*/

const { prisma } = require("../prisma");

function normalizeString(value, fallback = "") {
  // Convertit prudemment en chaîne et fournit une valeur par défaut si null/undefined
  if (value === null || value === undefined) return fallback;
  return String(value);
}

function normalizeInteger(value, fallback = 0) {
  // Convertit prudemment en entier (arrondi) avec valeur par défaut si invalide
  const num = Number(value);
  if (!Number.isFinite(num)) return fallback;
  return Math.round(num);
}

function normalizeFloat(value, fallback = 0.0) {
  const numberedValue = value.split(" ")[0].replace(",", ".");
  // Convertit prudemment en nombre décimal avec valeur par défaut si invalide
  const num = Number(numberedValue);
  if (!Number.isFinite(num)) return fallback;
  return num; // Garde la précision décimale
}

function extractTypeNames(typesArray) {
  // Extrait les deux premiers types (si présents) depuis le tableau Tyradex.
  // Forme attendue côté Tyradex: [{ name, image }, ...]
  if (!Array.isArray(typesArray)) return { type1: "", type2: null };
  const first = typesArray[0];
  const second = typesArray[1];
  const nameOf = (type) => {
    if (!type) return "";
    // Les objets de Tyradex ont généralement { name, image }
    // On prend le champ name tel quel.
    return normalizeString(type.name, "");
  };
  const type1 = nameOf(first);
  const type2 = second ? nameOf(second) : null;
  return { type1, type2 };
}

function mapStats(tyraStats) {
  // Tyradex expose souvent: { hp, atk, def, spe_atk, spe_def, vit }
  // Notre table PokemonStats attend: { hp, attack, defense, specialAttack, specialDefense, speed }
  if (!tyraStats || typeof tyraStats !== "object") {
    return {
      hp: 0,
      attack: 0,
      defense: 0,
      specialAttack: 0,
      specialDefense: 0,
      speed: 0,
    };
  }
  return {
    hp: normalizeInteger(tyraStats.hp, 0),
    attack: normalizeInteger(tyraStats.atk, 0),
    defense: normalizeInteger(tyraStats.def, 0),
    specialAttack: normalizeInteger(tyraStats.spe_atk, 0),
    specialDefense: normalizeInteger(tyraStats.spe_def, 0),
    speed: normalizeInteger(tyraStats.vit, 0),
  };
}

function mapTyradexToPokemon(tyra) {
  // Champs majeurs attendus
  const pokedexId = normalizeInteger(tyra.pokedex_id, -1); // -1 si non trouvé afin d'éviter une collision avec un ID de Pokémon existant
  // Nom: on privilégie la clé anglaise si présente, sinon fr, sinon le champ name direct
  // L'objet Tyradex contient généralement name sous forme d'objet { fr, en, ... }
  const nameObj = tyra.name || {};
  const englishName = nameObj.en || nameObj.gb || nameObj.us; // variantes éventuelles
  const frenchName = nameObj.fr;
  const name = normalizeString(englishName || frenchName || tyra.name, "");

  // Artwork
  // Les sprites Tyradex contiennent différentes clés possibles; on choisit la plus pertinente disponible.
  const sprites = tyra.sprites || {};
  const artworkUrl = normalizeString(
    sprites.regular || sprites.default || sprites.front_default || "",
    ""
  );

  // Types
  const { type1, type2 } = extractTypeNames(tyra.types);

  // Génération
  // Certaines versions exposent generation (string) ou generation_id (numérique)
  const generation = normalizeString(
    tyra.generation ?? tyra.generation_id ?? ""
  );

  // Taille / Poids
  // Selon la source: height/weight ou size/mass
  const height = normalizeFloat(tyra.height ?? 0.0, 0.0);
  const weight = normalizeFloat(tyra.weight ?? 0.0, 0.0);

  // Stats
  const stats = mapStats(tyra.stats);

  return {
    pokedexId,
    name,
    artworkUrl,
    type1,
    type2,
    generation,
    height,
    weight,
    stats,
  };
}

async function upsertOnePokemon(mapped) {
  // Recherche par pokedexId (non unique en DB, donc findFirst)
  // Si vous souhaitez forcer l'unicité, ajoutez @unique à Pokemon.pokedexId
  // dans prisma/schema.prisma puis exécutez une migration.
  const existing = await prisma.pokemon.findFirst({
    where: { pokedexId: mapped.pokedexId, name: mapped.name },
    include: { stats: true },
  });

  if (existing) {
    // Mise à jour transactionnelle pour garder cohérence entre Pokemon et PokemonStats
    await prisma.$transaction(async (tx) => {
      if (existing.statsId) {
        await tx.pokemonStats.update({
          where: { id: existing.statsId },
          data: mapped.stats,
        });
      } else {
        const createdStats = await tx.pokemonStats.create({
          data: mapped.stats,
        });
        await tx.pokemon.update({
          where: { id: existing.id },
          data: { statsId: createdStats.id },
        });
      }
      await tx.pokemon.update({
        where: { id: existing.id },
        data: {
          pokedexId: mapped.pokedexId,
          name: mapped.name,
          artworkUrl: mapped.artworkUrl,
          type1: mapped.type1,
          type2: mapped.type2,
          generation: mapped.generation,
          height: mapped.height,
          weight: mapped.weight,
        },
      });
    });
    return { action: "updated", id: existing.id };
  }

  // Création
  // On crée d'abord les stats, puis le Pokémon qui y fait référence via statsId
  const result = await prisma.$transaction(async (tx) => {
    const createdStats = await tx.pokemonStats.create({ data: mapped.stats });
    const createdPokemon = await tx.pokemon.create({
      data: {
        pokedexId: mapped.pokedexId,
        name: mapped.name,
        artworkUrl: mapped.artworkUrl,
        type1: mapped.type1,
        type2: mapped.type2,
        generation: mapped.generation,
        height: mapped.height,
        weight: mapped.weight,
        statsId: createdStats.id,
      },
    });
    return createdPokemon;
  });
  return { action: "created", id: result.id };
}

async function fetchPokemonByGeneration(generationId) {
  // Récupère tous les Pokémon d'une génération spécifique depuis Tyradex
  const baseUrl = "https://tyradex.vercel.app/api/v1/";
  const url = `${baseUrl}/gen/${generationId}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "PokeFav-Backend/1.0 (+import)",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        console.log(`[import] Génération ${generationId} non trouvée`);
        return [];
      }
      const text = await response.text().catch(() => "");
      throw new Error(`Tyradex API error ${response.status}: ${text}`);
    }

    const pokemon = await response.json();
    return Array.isArray(pokemon) ? pokemon : [];
  } catch (error) {
    console.error(
      `[import] Erreur lors de la récupération de la génération ${generationId}:`,
      error.message
    );
    return [];
  }
}

async function main() {
  console.log("[import] Début de l'import des Pokémon par génération...");

  // Générations disponibles (1 à 9)
  const generations = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let totalCreated = 0;
  let totalUpdated = 0;
  let totalSkipped = 0;

  for (const generationId of generations) {
    try {
      console.log(`\n[import] === GÉNÉRATION ${generationId} ===`);

      // Récupérer tous les Pokémon de cette génération
      const generationPokemon = await fetchPokemonByGeneration(generationId);
      if (generationPokemon.length === 0) {
        console.log(
          `[import] Aucun Pokémon trouvé pour la génération ${generationId}`
        );
        continue;
      }

      console.log(
        `[import] ${generationPokemon.length} Pokémon trouvés pour la génération ${generationId}`
      );

      let generationCreated = 0;
      let generationUpdated = 0;
      let generationSkipped = 0;

      // Traiter chaque entrée telle quelle (base et formes confondues)
      for (const rawPokemon of generationPokemon) {
        try {
          const mapped = mapTyradexToPokemon(rawPokemon);
          if (mapped.pokedexId >= 0 && mapped.name) {
            const result = await upsertOnePokemon(mapped);
            if (result.action === "created") generationCreated += 1;
            else generationUpdated += 1;
          } else {
            generationSkipped += 1;
          }
        } catch (error) {
          console.error(
            `[import] Erreur sur le pokédex ${
              rawPokemon?.pokedex_id ?? "inconnu"
            }:`,
            error.message
          );
          generationSkipped += 1;
        }
      }

      // Résumé de la génération
      console.log(`[import] Génération ${generationId} terminée:`);
      console.log(`  - Créés: ${generationCreated}`);
      console.log(`  - Mis à jour: ${generationUpdated}`);
      console.log(`  - Ignorés: ${generationSkipped}`);

      // Ajouter aux totaux
      totalCreated += generationCreated;
      totalUpdated += generationUpdated;
      totalSkipped += generationSkipped;

      // Petite pause entre les générations pour ne pas surcharger l'API
      if (generationId < 9) {
        console.log(
          `[import] Pause de 2 secondes avant la prochaine génération...`
        );
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(
        `[import] Erreur sur la génération ${generationId}:`,
        error.message
      );
    }
  }

  // Résumé final
  console.log(`\n[import] === RÉSUMÉ FINAL ===`);
  console.log(`[import] Terminé. Total:`);
  console.log(`  - Créés: ${totalCreated}`);
  console.log(`  - Mis à jour: ${totalUpdated}`);
  console.log(`  - Ignorés: ${totalSkipped}`);
}

main()
  .catch((err) => {
    console.error("[import] Echec:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
