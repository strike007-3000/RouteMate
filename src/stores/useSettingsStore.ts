import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  nvidiaApiKey: string;
  hereApiKey: string;
  orsApiKey: string;
  unsplashAccessKey: string;
  setNvidiaApiKey: (key: string) => void;
  setHereApiKey: (key: string) => void;
  setOrsApiKey: (key: string) => void;
  setUnsplashAccessKey: (key: string) => void;
  clearNvidiaApiKey: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      nvidiaApiKey: '',
      hereApiKey: '',
      orsApiKey: '',
      unsplashAccessKey: '',
      setNvidiaApiKey: (key) => set({ nvidiaApiKey: key }),
      setHereApiKey: (key) => set({ hereApiKey: key }),
      setOrsApiKey: (key) => set({ orsApiKey: key }),
      setUnsplashAccessKey: (key) => set({ unsplashAccessKey: key }),
      clearNvidiaApiKey: () => set({ nvidiaApiKey: '', hereApiKey: '', orsApiKey: '', unsplashAccessKey: '' }),
    }),

    {
      name: 'routemate-settings',
    }
  )
);

