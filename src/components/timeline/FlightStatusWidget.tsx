'use client';

import React, { useState, useEffect } from 'react';
import { differenceInHours, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';
import { Loader2, Info } from 'lucide-react';

interface FlightStatus {
  status: string;
  gate?: string;
  terminal?: string;
  delay?: number;
  estimated?: string;
}

export const FlightStatusWidget = ({ flightNumber, startTime }: { flightNumber: string, startTime: string }) => {
  const [status, setStatus] = useState<FlightStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const hoursToFlight = differenceInHours(parseISO(startTime), new Date());
  const isWithin24Hours = hoursToFlight >= -2 && hoursToFlight <= 24; // Check 2h past and 24h future

  useEffect(() => {
    if (!isWithin24Hours || !flightNumber) return;

    const fetchStatus = async () => {
      setLoading(true);
      try {
        const devKey = localStorage.getItem('dev_aviationstack_key') || '';
        const res = await fetch(`/api/flight-status?flightNumber=${encodeURIComponent(flightNumber)}`, {
          headers: { 'x-user-aviationstack-key': devKey }
        });
        const data = await res.json();
        if (!data.error) {
          setStatus(data);
        }
      } catch (err) {
        console.error('Flight status fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, [flightNumber, startTime, isWithin24Hours]);

  if (!isWithin24Hours) return null;

  if (loading) {
    return (
      <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10 animate-pulse">
        <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Checking Live Status...</span>
      </div>
    );
  }

  if (!status) return null;

  const isDelayed = (status.delay || 0) > 0;
  const statusColor = status.status === 'active' || status.status === 'landed' ? 'bg-emerald-500' : isDelayed ? 'bg-red-500' : 'bg-blue-500';

  return (
    <div className="mt-4 space-y-3">
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", statusColor, status.status === 'active' && "animate-pulse")} />
          <span className="text-[10px] font-black uppercase tracking-widest text-white/90">
            {status.status.replace('_', ' ')}
          </span>
        </div>
        {isDelayed && (
          <span className="text-[10px] font-black text-red-400 uppercase">+{status.delay}m Delay</span>
        )}
      </div>

      {(status.gate || status.terminal) && (
        <div className="grid grid-cols-2 gap-2">
          {status.terminal && (
            <div className="bg-white/5 border border-white/5 p-2 rounded-lg text-center">
              <span className="text-[8px] font-bold text-zinc-500 uppercase block mb-1">Terminal</span>
              <span className="text-xs font-black text-white">{status.terminal}</span>
            </div>
          )}
          {status.gate && (
            <div className="bg-white/5 border border-white/5 p-2 rounded-lg text-center">
              <span className="text-[8px] font-bold text-zinc-500 uppercase block mb-1">Gate</span>
              <span className="text-xs font-black text-white">{status.gate}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
