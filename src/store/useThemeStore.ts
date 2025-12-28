import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

// Sahifa yuklanganda localStorage dan theme ni o'qib, darhol qo'llash
const getInitialTheme = (): Theme => {
  try {
    const stored = localStorage.getItem('theme-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      const theme = parsed?.state?.theme;
      if (theme === 'dark' || theme === 'light') {
        // Darhol DOM ga qo'llash
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return theme;
      }
    }
  } catch (e) {
    // localStorage mavjud emas yoki xato
  }
  return 'light';
};

// Ilova yuklanishidan oldin theme ni qo'llash
const initialTheme = getInitialTheme();

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: initialTheme,
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'light' ? 'dark' : 'light';
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: newTheme };
        }),
      setTheme: (theme) => {
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Rehydrate bo'lganda ham theme ni qo'llash
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);
