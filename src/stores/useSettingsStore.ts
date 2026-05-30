import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  openRouterApiKey: string;
  groqApiKey: string;
  hereApiKey: string;
  orsApiKey: string;
  unsplashAccessKey: string;
  preferredAiProvider: 'OpenRouter' | 'Groq' | '';
  setOpenRouterApiKey: (key: string) => void;
  setGroqApiKey: (key: string) => void;
  setHereApiKey: (key: string) => void;
  setOrsApiKey: (key: string) => void;
  setUnsplashAccessKey: (key: string) => void;
  setPreferredAiProvider: (provider: 'OpenRouter' | 'Groq' | '') => void;
  clearAllKeys: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      openRouterApiKey: '',
      groqApiKey: '',
      hereApiKey: '',
      orsApiKey: '',
      unsplashAccessKey: '',
      preferredAiProvider: '',
      setOpenRouterApiKey: (key) => set({ openRouterApiKey: key }),
      setGroqApiKey: (key) => set({ groqApiKey: key }),
      setHereApiKey: (key) => set({ hereApiKey: key }),
      setOrsApiKey: (key) => set({ orsApiKey: key }),
      setUnsplashAccessKey: (key) => set({ unsplashAccessKey: key }),
      setPreferredAiProvider: (provider) => set({ preferredAiProvider: provider }),
      clearAllKeys: () => set({ 
        openRouterApiKey: '', 
        groqApiKey: '',
        hereApiKey: '', 
        orsApiKey: '', 
        unsplashAccessKey: '',
        preferredAiProvider: ''
      }),
    }),

    {
      name: 'routemate-settings',
    }
  )
);
