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
 * Color mapping for Pokemon types (pastel colors)
 * Returns Tailwind CSS classes for background and text colors
 */
export const typeColorMap: Record<string, { bg: string; text: string }> = {
  Normal: { bg: "bg-gray-200", text: "text-gray-700" },
  Fire: { bg: "bg-orange-200", text: "text-orange-800" },
  Water: { bg: "bg-blue-200", text: "text-blue-800" },
  Electric: { bg: "bg-yellow-200", text: "text-yellow-800" },
  Grass: { bg: "bg-green-200", text: "text-green-800" },
  Ice: { bg: "bg-cyan-100", text: "text-cyan-800" },
  Fighting: { bg: "bg-rose-200", text: "text-rose-800" },
  Poison: { bg: "bg-purple-200", text: "text-purple-800" },
  Ground: { bg: "bg-amber-200", text: "text-amber-800" },
  Flying: { bg: "bg-indigo-200", text: "text-indigo-800" },
  Psychic: { bg: "bg-pink-200", text: "text-pink-800" },
  Bug: { bg: "bg-lime-200", text: "text-lime-800" },
  Rock: { bg: "bg-stone-200", text: "text-stone-800" },
  Ghost: { bg: "bg-purple-300", text: "text-purple-900" },
  Dragon: { bg: "bg-violet-200", text: "text-violet-800" },
  Dark: { bg: "bg-gray-300", text: "text-gray-800" },
  Steel: { bg: "bg-slate-200", text: "text-slate-800" },
  Fairy: { bg: "bg-pink-100", text: "text-pink-800" },
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

