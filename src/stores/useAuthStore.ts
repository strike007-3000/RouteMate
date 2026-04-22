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
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      
      login: (provider, userData) => {
        // Mocking the successful auth response
        const mockUser: User = {
          name: userData?.name || 'Alex Nomad',
          email: userData?.email || 'alex@routemate.ai',
          image: userData?.image || '',
          status: 'Elite Traveler',
        };
        
        set({ user: mockUser, isLoggedIn: true });
      },
      
      logout: () => set({ user: null, isLoggedIn: false }),
    }),
    {
      name: 'routemate-auth',
    }
  )
);
