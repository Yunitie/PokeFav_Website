import * as React from "react";

export type ThemePreference = "light" | "dark" | "system";

function systemPrefersDark(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyThemePreference(preference: ThemePreference): void {
  if (typeof document === "undefined") return;
  const isDark = preference === "dark" || (preference === "system" && systemPrefersDark());
  document.documentElement.classList.toggle("dark", isDark);
}

export function useTheme() {
  const [theme, setTheme] = React.useState<ThemePreference>(() => {
    if (typeof window === "undefined") return "system";
    const saved = window.localStorage.getItem("theme") as ThemePreference | null;
    return saved ?? "system";
  });

  React.useEffect(() => {
    window.localStorage.setItem("theme", theme);
    applyThemePreference(theme);
  }, [theme]);

  React.useEffect(() => {
    if (theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyThemePreference("system");
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  return { theme, setTheme };
}


