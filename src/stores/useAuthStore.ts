import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  name: string;
  email: string;
  image: string;
  status: string;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  login: (provider: 'google' | 'apple' | 'email', userData?: Partial<User>) => void;
  logout: () => void;
  checkSession: () => Promise<void>;
  setSession: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      
      login: (provider, userData) => {
        // Mocking the successful auth response for dev fallback
        const mockUser: User = {
          name: userData?.name || 'Alex Nomad',
          email: userData?.email || 'alex@routemate.ai',
          image: userData?.image || '',
          status: 'Elite Traveler',
        };
        
        set({ user: mockUser, isLoggedIn: true });
      },

      setSession: (user) => {
        set({ user, isLoggedIn: true });
      },
      
      logout: () => {
        set({ user: null, isLoggedIn: false });
      },

      checkSession: async () => {
        try {
          const res = await fetch('/api/auth/session');
          if (res.ok) {
            const data = await res.json();
            if (data.isLoggedIn && data.user) {
              set({ user: data.user, isLoggedIn: true });
            } else {
              set({ user: null, isLoggedIn: false });
            }
          }
        } catch (err) {
          console.error('Failed to sync auth session:', err);
        }
      }
    }),
    {
      name: 'routemate-auth',
    }
  )
);
