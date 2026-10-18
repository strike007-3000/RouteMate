import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  name: string;
  email: string;
  image: string;
  status: string;
}

export interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  logout: () => void;
  setSession: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      
      setSession: (user) => {
        set({ user, isLoggedIn: true });
      },
      
      logout: () => {
        set({ user: null, isLoggedIn: false });
      },
    }),
    {
      name: 'routemate-auth',
    }
  )
);
