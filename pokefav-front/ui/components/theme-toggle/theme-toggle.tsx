"use client";
import * as React from "react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle(): React.JSX.Element {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";
  const label = isDark ? "🌙" : "☀️";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={[
        "w-10 h-10 rounded-full text-xl transition-colors flex items-center justify-center",
        "text-neutral-800 shadow-lg/30 hover:shadow-lg/60",
        "dark:text-neutral-100 shadow-lg/30 dark:hover:shadow-lg/60",
        "ring-1 ring-transparent",
      ].join(" ")}
      suppressHydrationWarning
    >
      {label}
    </button>
  );
}
