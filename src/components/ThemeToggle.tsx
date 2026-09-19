"use client";

import { useEffect, useState } from "react";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const themeAttr = document.documentElement.getAttribute("data-theme");
    if (themeAttr === "light") {
      setIsDark(false);
    } else if (themeAttr === "dark") {
      setIsDark(true);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDark(prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const themeName = nextDark ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", themeName);
    try {
      localStorage.setItem("theme", themeName);
    } catch {}
  };

  if (!mounted) {
    return (
      <button
        className={`bg-card-bg/70 border border-border-color p-2 rounded-full text-wine text-2xl flex items-center justify-center w-11 h-11 backdrop-blur-sm opacity-0 ${className}`}
        aria-hidden="true"
      >
        🌙
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`bg-card-bg/70 hover:bg-card-bg border border-border-color p-2 rounded-full text-wine text-2xl cursor-pointer hover:scale-110 active:scale-95 transition-all shadow-sm flex items-center justify-center w-11 h-11 backdrop-blur-sm ${className}`}
      aria-label={isDark ? "التبديل إلى الوضع الصباحي" : "التبديل إلى الوضع الليلي"}
      title={isDark ? "التبديل إلى الوضع الصباحي (Light Mode) ☀️" : "التبديل إلى الوضع الليلي (Dark Mode) 🌙"}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
