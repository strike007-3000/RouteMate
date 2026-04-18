import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  nvidiaApiKey: string;
  hereApiKey: string;
  setNvidiaApiKey: (key: string) => void;
  setHereApiKey: (key: string) => void;
  clearNvidiaApiKey: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      nvidiaApiKey: '',
      hereApiKey: '',
      setNvidiaApiKey: (key) => set({ nvidiaApiKey: key }),
      setHereApiKey: (key) => set({ hereApiKey: key }),
      clearNvidiaApiKey: () => set({ nvidiaApiKey: '', hereApiKey: '' }),
    }),
    {
      name: 'routemate-settings',
    }
  )
);

