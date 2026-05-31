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
  // Currency & Units
  currency: string;
  distanceUnit: 'KM' | 'MI';
  setCurrency: (currency: string) => void;
  setDistanceUnit: (unit: 'KM' | 'MI') => void;
  // Travel Identity
  homeCity: string;
  travelStyles: string[];
  preferredCabin: string;
  setHomeCity: (city: string) => void;
  setTravelStyles: (styles: string[]) => void;
  setPreferredCabin: (cabin: string) => void;
  // App Preferences
  defaultViewMode: 'summary' | 'logistics';
  timeFormat: '12h' | '24h';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY';
  smartPasteAutoDetect: boolean;
  setDefaultViewMode: (mode: 'summary' | 'logistics') => void;
  setTimeFormat: (format: '12h' | '24h') => void;
  setDateFormat: (format: 'DD/MM/YYYY' | 'MM/DD/YYYY') => void;
  setSmartPasteAutoDetect: (detect: boolean) => void;
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
      // Currency & Units
      currency: 'EUR',
      distanceUnit: 'KM',
      setCurrency: (currency) => set({ currency }),
      setDistanceUnit: (distanceUnit) => set({ distanceUnit }),
      // Travel Identity
      homeCity: '',
      travelStyles: [],
      preferredCabin: 'Economy',
      setHomeCity: (homeCity) => set({ homeCity }),
      setTravelStyles: (travelStyles) => set({ travelStyles }),
      setPreferredCabin: (preferredCabin) => set({ preferredCabin }),
      // App Preferences
      defaultViewMode: 'summary',
      timeFormat: '24h',
      dateFormat: 'DD/MM/YYYY',
      smartPasteAutoDetect: false,
      setDefaultViewMode: (defaultViewMode) => set({ defaultViewMode }),
      setTimeFormat: (timeFormat) => set({ timeFormat }),
      setDateFormat: (dateFormat) => set({ dateFormat }),
      setSmartPasteAutoDetect: (smartPasteAutoDetect) => set({ smartPasteAutoDetect }),
    }),

    {
      name: 'routemate-settings',
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        const state = persistedState as Record<string, unknown>;
        if (version === 0 && persistedState && typeof persistedState === 'object') {
          if (state.preferredAiProvider === 'OpenRouter') {
            state.preferredAiProvider = '';
          }
        }
        if (version < 2 && persistedState && typeof persistedState === 'object') {
          state.currency = state.currency || 'EUR';
          state.distanceUnit = state.distanceUnit || 'KM';
          state.homeCity = state.homeCity || '';
          state.travelStyles = state.travelStyles || [];
          state.preferredCabin = state.preferredCabin || 'Economy';
          state.defaultViewMode = state.defaultViewMode || 'summary';
          state.timeFormat = state.timeFormat || '24h';
          state.dateFormat = state.dateFormat || 'DD/MM/YYYY';
          state.smartPasteAutoDetect = state.smartPasteAutoDetect ?? false;
        }
        return state as unknown as SettingsState;
      },
    }
  )
);
