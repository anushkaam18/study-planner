import { createContext, useContext, useState, useEffect } from "react";

const ThemeAccentContext = createContext();

export const ACCENTS = [
  {
    id: "violet",
    name: "Cosmic Violet",
    primaryClass: "text-primary",
    bgClass: "bg-primary",
    borderClass: "border-primary/30 focus:border-primary/50",
    gradientClass: "from-primary to-accent",
    glowHex: "#6c63ff",
    bgMuted: "bg-primary/10",
    borderActive: "border-primary",
  },
  {
    id: "blue",
    name: "Cobalt Blue",
    primaryClass: "text-blue-400",
    bgClass: "bg-blue-500",
    borderClass: "border-blue-500/30 focus:border-blue-500/50",
    gradientClass: "from-blue-500 to-cyan-600",
    glowHex: "#3b82f6",
    bgMuted: "bg-blue-500/10",
    borderActive: "border-blue-500",
  },
  {
    id: "emerald",
    name: "Jade Emerald",
    primaryClass: "text-emerald-400",
    bgClass: "bg-emerald-500",
    borderClass: "border-emerald-500/30 focus:border-emerald-500/50",
    gradientClass: "from-emerald-500 to-teal-600",
    glowHex: "#10b981",
    bgMuted: "bg-emerald-500/10",
    borderActive: "border-emerald-500",
  },
  {
    id: "rose",
    name: "Velvet Rose",
    primaryClass: "text-rose-400",
    bgClass: "bg-rose-500",
    borderClass: "border-rose-500/30 focus:border-rose-500/50",
    gradientClass: "from-rose-500 to-pink-600",
    glowHex: "#f43f5e",
    bgMuted: "bg-rose-500/10",
    borderActive: "border-rose-500",
  },
];

/**
 * Global Theme Accent Provider.
 * Allows instant, animated visual accent swaps across all dashboards
 * and interactive cursor tracking widgets.
 */
export function ThemeAccentProvider({ children }) {
  const [activeAccentId, setActiveAccentId] = useState(() => {
    return localStorage.getItem("study-planner-accent") || "violet";
  });

  const activeAccent = ACCENTS.find((a) => a.id === activeAccentId) || ACCENTS[0];

  useEffect(() => {
    localStorage.setItem("study-planner-accent", activeAccentId);
    
    // Dynamically inject root variables to sync Tailwind v4 config variables!
    const root = document.documentElement;
    root.style.setProperty("--color-primary", activeAccent.glowHex);
    // Darken custom glow for shadow effects
    root.style.setProperty("--color-primary-hover", activeAccent.id === "violet" ? "#5b54e6" : activeAccent.glowHex);
  }, [activeAccentId, activeAccent]);

  return (
    <ThemeAccentContext.Provider
      value={{
        activeAccent,
        setAccent: setActiveAccentId,
        allAccents: ACCENTS,
      }}
    >
      {children}
    </ThemeAccentContext.Provider>
  );
}

/**
 * Hook to retrieve active dynamic neon color states.
 */
export function useThemeAccent() {
  const context = useContext(ThemeAccentContext);
  if (!context) {
    throw new Error("useThemeAccent must be used inside a ThemeAccentProvider");
  }
  return context;
}
