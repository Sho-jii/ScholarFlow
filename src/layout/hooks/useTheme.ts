"use client";

import { useEffect, useState, useCallback } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);
  }, []);

  const toggleTheme = useCallback(() => {
    const nextDark = !document.documentElement.classList.contains("dark");
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("scholarflow_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("scholarflow_theme", "light");
    }
    setIsDark(nextDark);
  }, []);

  return { isDark, toggleTheme };
}
