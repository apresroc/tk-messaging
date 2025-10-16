import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "light",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user's saved theme on mount
  useEffect(() => {
    const loadUserTheme = async () => {
      try {
        const userData = sessionStorage.getItem('currentUser');
        if (userData) {
          const user = JSON.parse(userData);
          const response = await fetch(`/api/user/settings?userId=${user.id}`);
          if (response.ok) {
            const settings = await response.json();
            if (settings.theme?.mode) {
              setTheme(settings.theme.mode);
            }
          }
        }
      } catch (error) {
        console.error('Error loading user theme:', error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUserTheme();
  }, []);

  // Apply theme to document when it changes
  useEffect(() => {
    if (isLoaded) {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(theme);
    }
  }, [theme, isLoaded]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {!isLoaded ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-purple-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
            <p className="text-blue-200">Loading...</p>
          </div>
        </div>
      ) : (
        children
      )}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};