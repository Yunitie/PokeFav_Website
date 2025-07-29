"use client";
/**
 * Mettre en gras le lien de la page active
 */

import clsx from "clsx"; // Permet de conditionner dynamiquement des classes CSS
import Link from "next/link"; // Composant Link de Next.js pour la navigation côté client
import { useRouter, usePathname } from "next/navigation"; // Hook pour accéder à l'objet router de Next.js
import { useMemo } from "react"; // Hook pour mémoriser une valeur calculée

// Définition des props attendues par le composant
interface Props {
  href: string; // Lien de destination
  children: React.ReactNode; // Contenu à afficher dans le lien (texte ou éléments)
}

// Composant principal
const ActiveLink = ({ href, children }: Props) => {
  // const router = useRouter(); // plus nécessaire ici
  const pathname = usePathname(); // Récupère le chemin courant

  // Calcule si le lien est actif (si la page courante correspond au href)
  // useMemo optimise le calcul : il ne se refait que si pathname ou href change
  const isActive = useMemo(() => {
    return pathname == href; // true si le chemin courant est égal au href du lien
  }, [pathname, href]);

  // Retourne un composant Link avec une classe CSS conditionnelle si actif
  return (
    <Link href={href} className={clsx(isActive && "text-primary font-medium")}>
      {children}
    </Link>
  );
};

export default ActiveLink; // Export du composant pour utilisation ailleurs
