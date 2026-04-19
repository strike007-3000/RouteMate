'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface GeolocationState {
  coords: { latitude: number; longitude: number } | null;
  error: string | null;
  loading: boolean;
  permission: PermissionState | 'unknown';
}

const GeolocationContext = createContext<GeolocationState>({
  coords: null,
  error: null,
  loading: true,
  permission: 'unknown',
});

export const useGeolocation = () => useContext(GeolocationContext);

export const GeolocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    loading: true,
    permission: 'unknown',
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({ ...s, error: 'Geolocation not supported', loading: false }));
      return;
    }

    const checkPermission = async () => {
      try {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setState(s => ({ ...s, permission: result.state }));
        
        result.onchange = () => {
          setState(s => ({ ...s, permission: result.state }));
        };
      } catch (e) {
        console.error('Permission check failed', e);
      }
    };

    checkPermission();

    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          coords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
          error: null,
          loading: false,
          permission: 'granted',
        });
      },
      (err) => {
        setState(s => ({
          ...s,
          error: err.message,
          loading: false,
          permission: err.code === 1 ? 'denied' : s.permission,
        }));
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return (
    <GeolocationContext.Provider value={state}>
      {children}
    </GeolocationContext.Provider>
  );
};
