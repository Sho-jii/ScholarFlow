"use client";

import { useEffect, useState, useCallback } from "react";

export function useTheme() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDark();

    const observer = new MutationObserver(() => {
      checkDark();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("storage", checkDark);

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", checkDark);
    };
  }, []);

  const toggleTheme = useCallback(() => {
    const nextDark = !document.documentElement.classList.contains("dark");
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("axiomproof_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("axiomproof_theme", "light");
    }
    setIsDark(nextDark);
  }, []);

  return { isDark, toggleTheme };
}

