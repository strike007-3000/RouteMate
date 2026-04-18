import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  nvidiaApiKey: string;
  hereApiKey: string;
  orsApiKey: string;
  setNvidiaApiKey: (key: string) => void;
  setHereApiKey: (key: string) => void;
  setOrsApiKey: (key: string) => void;
  clearNvidiaApiKey: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      nvidiaApiKey: '',
      hereApiKey: '',
      orsApiKey: '',
      setNvidiaApiKey: (key) => set({ nvidiaApiKey: key }),
      setHereApiKey: (key) => set({ hereApiKey: key }),
      setOrsApiKey: (key) => set({ orsApiKey: key }),
      clearNvidiaApiKey: () => set({ nvidiaApiKey: '', hereApiKey: '', orsApiKey: '' }),
    }),

    {
      name: 'routemate-settings',
    }
  )
);

