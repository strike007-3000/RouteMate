'use client';

import React, { useState, useEffect } from 'react';
import { isToday, isTomorrow, parseISO } from 'date-fns';

interface WeatherData {
  temp: number;
  icon: string;
  desc: string;
}

export const WeatherWidget = ({ date, location }: { date: string, location: string }) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const isEligible = isToday(parseISO(date)) || isTomorrow(parseISO(date));

  useEffect(() => {
    if (!isEligible || !location) return;

    const fetchWeather = async () => {
      setLoading(true);
      try {
        const devKey = localStorage.getItem('dev_weatherstack_key') || '';
        const res = await fetch(`/api/weather?query=${encodeURIComponent(location)}`, {
          headers: { 'x-user-weatherstack-key': devKey }
        });
        const data = await res.json();
        if (!data.error) {
          setWeather(data);
        }
      } catch (err) {
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [date, location, isEligible]);

  if (!isEligible || loading || !weather) return null;

  return (
    <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/10 ml-auto">
      <img src={weather.icon} alt={weather.desc} className="w-4 h-4 opacity-80" />
      <span className="text-[10px] font-bold text-white/70">{weather.temp}°C</span>
    </div>
  );
};
