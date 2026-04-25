'use client';

import React, { useState, useEffect } from 'react';
import { isToday, isTomorrow, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

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

  if (!isEligible || loading || !weather || !weather.icon) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-white/10 ml-auto shadow-lg shadow-black/50 hover:bg-zinc-800 transition-colors group">
      <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-white/5 border border-white/5">
         <img 
           src={weather.icon} 
           alt={weather.desc} 
           className="w-full h-full object-cover grayscale brightness-150 contrast-125 scale-125 group-hover:scale-110 transition-transform" 
         />
      </div>
      <span className="text-[10px] font-black text-white/90 tracking-widest">{weather.temp}°C</span>
    </div>
  );
};
