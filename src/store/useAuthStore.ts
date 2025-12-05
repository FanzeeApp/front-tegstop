import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  username: string;
  phone?: string;
  role?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User | null, token: string | null) => void;
  logout: () => void;
  clearAllData: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: !!token,
        });
      },

      logout: () => {
        // 1. LocalStorage dan tokenni o'chirish
        localStorage.removeItem('token');
        
        // 2. Zustand store ni tozalash
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        // 3. User data tozalash (theme ni saqlab qolish)
        const theme = localStorage.getItem('theme-storage');
        const language = localStorage.getItem('i18nextLng');
        
        localStorage.clear();
        sessionStorage.clear();
        
        if (theme) localStorage.setItem('theme-storage', theme);
        if (language) localStorage.setItem('i18nextLng', language);
      },

      clearAllData: () => {
        // To'liq tozalash (faqat zarurat bo'lganda)
        localStorage.clear();
        sessionStorage.clear();
        
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);