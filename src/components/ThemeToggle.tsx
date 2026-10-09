"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      type="button"
      aria-label="Ganti tema terang/gelap"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex size-11 items-center justify-center rounded-pill text-fg-muted transition-colors hover:text-fg"
    >
      <Sun className="size-5 dark:hidden" strokeWidth={1.75} />
      <Moon className="hidden size-5 dark:block" strokeWidth={1.75} />
    </button>
  );
}
