/**
 * Script d'initialisation du thème pour éviter le flash de contenu non stylé (FOUC).
 * Ce script doit être exécuté avant l'hydratation React, donc il est utilisé
 * avec `strategy="beforeInteractive"` dans le layout root.
 */
export const themeInitScript = `(function(){try{var saved=localStorage.getItem('theme')||'system';var prefersDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var isDark=saved==='dark'||(saved==='system'&&prefersDark);var root=document.documentElement;if(isDark)root.classList.add('dark');else root.classList.remove('dark');}catch(_){}})();`;

