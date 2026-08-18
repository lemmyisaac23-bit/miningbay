import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "vmb-dark";

type ThemeCtx = {
  dark: boolean;
  toggleDark: () => void;
};

const ThemeContext = createContext<ThemeCtx | null>(null);

function readDark() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function applyDark(dark: boolean) {
  document.documentElement.classList.toggle("dark", dark);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(() =>
    typeof window === "undefined" ? false : readDark(),
  );

  useEffect(() => {
    applyDark(dark);
    try {
      localStorage.setItem(STORAGE_KEY, dark ? "1" : "0");
    } catch {
      /* ignore */
    }
  }, [dark]);

  const toggleDark = useCallback(() => {
    setDark((on) => !on);
  }, []);

  return (
    <ThemeContext.Provider value={{ dark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
