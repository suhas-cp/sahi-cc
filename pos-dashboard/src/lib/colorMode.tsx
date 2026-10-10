import { createContext, useContext, useState, type ReactNode } from "react";

interface ColorMode {
  dark: boolean;
  setDark: (dark: boolean) => void;
}

const ColorModeContext = createContext<ColorMode | null>(null);

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [dark, setDarkState] = useState(() => document.documentElement.dataset.mode === "dark");

  function setDark(next: boolean) {
    const mode = next ? "dark" : "light";
    setDarkState(next);
    document.documentElement.dataset.mode = mode;
    try {
      localStorage.setItem("color-mode", mode);
    } catch {
      // Storage can be unavailable (private mode); the toggle still works for this visit.
    }
  }

  return <ColorModeContext.Provider value={{ dark, setDark }}>{children}</ColorModeContext.Provider>;
}

export function useColorMode(): ColorMode {
  const ctx = useContext(ColorModeContext);
  if (!ctx) throw new Error("useColorMode must be used inside ColorModeProvider");
  return ctx;
}
