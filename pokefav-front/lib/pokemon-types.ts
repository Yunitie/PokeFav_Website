/**
 * Translation mapping for Pokemon types from French to English
 */
const typeTranslationMap: Record<string, string> = {
  // Types en français → Types en anglais
  "Normal": "Normal",
  "Feu": "Fire",
  "Eau": "Water",
  "Électrik": "Electric",
  "Plante": "Grass",
  "Glace": "Ice",
  "Combat": "Fighting",
  "Poison": "Poison",
  "Sol": "Ground",
  "Vol": "Flying",
  "Psy": "Psychic",
  "Insecte": "Bug",
  "Roche": "Rock",
  "Spectre": "Ghost",
  "Dragon": "Dragon",
  "Ténèbres": "Dark",
  "Acier": "Steel",
  "Fée": "Fairy",
  // Variantes possibles
  "Électrique": "Electric",
  "Ténèbre": "Dark",
};

/**
 * Reverse mapping from English to French (for filtering)
 */
const reverseTypeTranslationMap: Record<string, string> = Object.fromEntries(
  Object.entries(typeTranslationMap).map(([fr, en]) => [en, fr])
);

/**
 * Color mapping for Pokemon types (official Pokemon colors)
 * Returns Tailwind CSS classes for background and text colors
 */
export const typeColorMap: Record<string, { bg: string; text: string }> = {
  Normal: { bg: "bg-gray-300", text: "text-gray-800" },
  Fire: { bg: "bg-red-600", text: "text-white" },
  Water: { bg: "bg-blue-400", text: "text-white" },
  Electric: { bg: "bg-yellow-400", text: "text-gray-900" },
  Grass: { bg: "bg-green-400", text: "text-white" },
  Ice: { bg: "bg-cyan-200", text: "text-gray-900" },
  Fighting: { bg: "bg-amber-600", text: "text-white" },
  Poison: { bg: "bg-purple-500", text: "text-white" },
  Ground: { bg: "bg-amber-900", text: "text-white" },
  Flying: { bg: "bg-indigo-300", text: "text-gray-900" },
  Psychic: { bg: "bg-pink-500", text: "text-white" },
  Bug: { bg: "bg-lime-500", text: "text-white" },
  Rock: { bg: "bg-amber-700", text: "text-white" },
  Ghost: { bg: "bg-purple-700", text: "text-white" },
  Dragon: { bg: "bg-violet-600", text: "text-white" },
  Dark: { bg: "bg-gray-800", text: "text-white" },
  Steel: { bg: "bg-gray-400", text: "text-gray-900" },
  Fairy: { bg: "bg-pink-300", text: "text-pink-900" },
};

/**
 * Translates a Pokemon type from French to English
 * @param type - The type name (can be in French or English)
 * @returns The English type name
 */
export function translateType(type: string | null | undefined): string {
  if (!type) return "";
  
  const trimmedType = type.trim();
  const translated = typeTranslationMap[trimmedType];
  
  // If translation exists, use it
  if (translated) {
    return translated;
  }
  
  // If not found in map, assume it's already in English or return as is
  return trimmedType;
}

/**
 * Translates a Pokemon type from English to French (for filtering with original values)
 * @param type - The type name in English
 * @returns The French type name (or original if not found)
 */
export function translateTypeToFrench(type: string | null | undefined): string {
  if (!type) return "";
  
  const trimmedType = type.trim();
  const translated = reverseTypeTranslationMap[trimmedType];
  
  // If translation exists, use it
  if (translated) {
    return translated;
  }
  
  // If not found, return as is (might already be in French)
  return trimmedType;
}

/**
 * Gets the color classes for a Pokemon type
 * @param type - The type name (can be in French or English)
 * @returns Object with bg and text Tailwind CSS classes, or default colors if type not found
 */
export function getTypeColors(type: string | null | undefined): { bg: string; text: string } {
  if (!type) {
    return { bg: "bg-gray-200", text: "text-gray-700" };
  }
  
  const translatedType = translateType(type);
  return typeColorMap[translatedType] || { bg: "bg-gray-200", text: "text-gray-700" };
}

