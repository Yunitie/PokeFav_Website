/*
  Warnings:

  - A unique constraint covering the columns `[userId,pokemonId]` on the table `PokemonRank` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `PokemonRank` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PokemonRank" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE INDEX "PokemonRank_userId_idx" ON "PokemonRank"("userId");

-- CreateIndex
CREATE INDEX "PokemonRank_userId_score_idx" ON "PokemonRank"("userId", "score");

-- CreateIndex
CREATE UNIQUE INDEX "PokemonRank_userId_pokemonId_key" ON "PokemonRank"("userId", "pokemonId");
