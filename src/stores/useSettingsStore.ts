import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  nvidiaApiKey: string;
  setNvidiaApiKey: (key: string) => void;
  clearNvidiaApiKey: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      nvidiaApiKey: '',
      setNvidiaApiKey: (key) => set({ nvidiaApiKey: key }),
      clearNvidiaApiKey: () => set({ nvidiaApiKey: '' }),
    }),
    {
      name: 'routemate-settings',
    }
  )
);
