"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

const themeChangedEvent = "claude-bit-news-theme-changed";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(themeChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(themeChangedEvent, onStoreChange);
  };
}

function getTheme() {
  return window.localStorage.getItem("theme") !== "dark";
}

export function ThemeToggle() {
  const isLight = useSyncExternalStore(subscribe, getTheme, () => true);

  function toggleTheme() {
    const nextIsLight = !isLight;
    document.documentElement.dataset.theme = nextIsLight ? "light" : "dark";
    window.localStorage.setItem("theme", nextIsLight ? "light" : "dark");
    window.dispatchEvent(new Event(themeChangedEvent));
  }

  return <button onClick={toggleTheme} className="grid size-10 place-items-center rounded-full border border-[var(--line)] text-[var(--foreground)] hover:bg-[var(--surface-muted)]" aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}>{isLight ? <Moon size={17} /> : <Sun size={17} />}</button>;
}