"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface KonamiCodeProps {
  onKonamiCode?: () => void;
  sequence?: string[];
  enabled?: boolean;
  redirectToDesignSystem?: boolean;
}

export default function KonamiCode({
  onKonamiCode,
  sequence = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b", // Utilise event.key au lieu de event.code
    "a", // Fonctionne sur tous les claviers
  ],
  enabled = true,
  redirectToDesignSystem = true,
}: KonamiCodeProps) {
  const router = useRouter();
  const konamiCodeRef = useRef<string[]>([]);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Utiliser event.key pour la compatibilité multi-claviers
      const key = event.key.toLowerCase();

      // Ajouter la nouvelle touche
      konamiCodeRef.current.push(key);

      // Garder seulement les dernières touches selon la longueur de la séquence
      if (konamiCodeRef.current.length > sequence.length) {
        konamiCodeRef.current.shift();
      }

      // Vérifier si le code Konami est entré
      if (konamiCodeRef.current.length === sequence.length) {
        const isKonamiCode = konamiCodeRef.current.every(
          (key, index) => key === sequence[index].toLowerCase()
        );

        if (isKonamiCode) {
          // Exécuter le callback personnalisé s'il existe
          if (onKonamiCode) {
            onKonamiCode();
          }

          // Rediriger vers le design system par défaut
          if (redirectToDesignSystem) {
            router.push("/design-system");
          }

          // Reset le code
          konamiCodeRef.current = [];
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, sequence, onKonamiCode, redirectToDesignSystem, router]);

  // Ce composant ne rend rien visuellement
  return null;
}
