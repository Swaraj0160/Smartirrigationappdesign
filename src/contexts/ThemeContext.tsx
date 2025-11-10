import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'light';
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    
    const checkTheme = () => {
      if (theme === 'auto') {
        const hour = new Date().getHours();
        // Dark mode from 6 PM (18) to 6 AM (6)
        setIsDark(hour >= 18 || hour < 6);
      } else {
        setIsDark(theme === 'dark');
      }
    };

    checkTheme();
    const interval = setInterval(checkTheme, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [theme]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
