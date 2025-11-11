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
        "px-2 py-1 rounded-md text-sm transition-colors",
        "bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
        "dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700",
        "ring-1 ring-transparent",
      ].join(" ")}
    >
      {label}
    </button>
  );
}
