'use client';

import React, { useState, useEffect } from 'react';
import { differenceInHours, parseISO, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Loader2, Info, Check, Search } from 'lucide-react';
import { useTripStore } from '@/stores/useTripStore';

interface FlightStatus {
  status: string;
  gate?: string;
  terminal?: string;
  delay?: number;
  estimated?: string;
  flightNumber?: string;
  airline?: string;
  departureTime?: string;
}

interface FlightStatusWidgetProps {
  pointId: number;
  flightNumber?: string;
  startTime: string;
  departureAirport?: string;
  arrivalAirport?: string;
}

export const FlightStatusWidget = ({ 
  pointId, 
  flightNumber, 
  startTime, 
  departureAirport, 
  arrivalAirport 
}: FlightStatusWidgetProps) => {
  const [status, setStatus] = useState<FlightStatus | null>(null);
  const [availableFlights, setAvailableFlights] = useState<FlightStatus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const updatePointMetadata = useTripStore((state) => state.updatePointMetadata);

  const hoursToFlight = differenceInHours(parseISO(startTime), new Date());
  const isWithin24Hours = hoursToFlight >= -2 && hoursToFlight <= 24;

  const fetchStatus = async (targetFlight?: string) => {
    const flightToSearch = targetFlight || flightNumber;
    if (!flightToSearch) return;

    setLoading(true);
    try {
      const devKey = localStorage.getItem('dev_aviationstack_key') || '';
      const res = await fetch(`/api/flight-status?flightNumber=${encodeURIComponent(flightToSearch)}`, {
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

  const searchFlightsByRoute = async () => {
    if (!departureAirport || !arrivalAirport) return;
    
    setSearching(true);
    try {
      const depIata = departureAirport.match(/\b[A-Z]{3}\b/)?.[0];
      const arrIata = arrivalAirport.match(/\b[A-Z]{3}\b/)?.[0];
      
      if (!depIata || !arrIata) return;

      const devKey = localStorage.getItem('dev_aviationstack_key') || '';
      const res = await fetch(`/api/flight-status?dep_iata=${depIata}&arr_iata=${arrIata}&date=${startTime}`, {
        headers: { 'x-user-aviationstack-key': devKey }
      });
      const data = await res.json();
      if (data.flights) {
        setAvailableFlights(data.flights);
      }
    } catch (err) {
      console.error('Flight search error:', err);
    } finally {
      setSearching(false);
    }
  };

  useEffect(() => {
    if (!isWithin24Hours) return;
    
    let isMounted = true;
    const trigger = async () => {
      if (flightNumber) {
        await fetchStatus();
      } else if (departureAirport && arrivalAirport) {
        await searchFlightsByRoute();
      }
    };

    trigger();
    return () => { isMounted = false; };
  }, [flightNumber, startTime, isWithin24Hours, departureAirport, arrivalAirport]);

  const handleSelectFlight = async (flight: FlightStatus) => {
    if (!flight.flightNumber) return;
    await updatePointMetadata(pointId, { flightNumber: flight.flightNumber });
    setStatus(flight);
    setAvailableFlights([]);
  };

  if (!isWithin24Hours) return null;

  if (loading || searching) {
    return (
      <div className="flex items-center gap-2 mt-4 px-3 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10 animate-pulse">
        <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
          {searching ? 'Finding Flights...' : 'Checking Live Status...'}
        </span>
      </div>
    );
  }

  if (!status && availableFlights.length > 0) {
    return (
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Info className="w-3 h-3 text-zinc-500" />
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Select Your Flight</span>
        </div>
        <div className="flex flex-col gap-2">
          {availableFlights.slice(0, 3).map((f, i) => (
            <button 
              key={i}
              onClick={() => handleSelectFlight(f)}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all text-left group"
            >
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white group-hover:text-primary transition-colors">{f.flightNumber}</span>
                <span className="text-[8px] font-bold text-zinc-500 uppercase">{f.airline}</span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-zinc-400">{f.departureTime ? format(parseISO(f.departureTime), 'HH:mm') : '--:--'}</span>
              </div>
            </button>
          ))}
        </div>
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
            {status.status?.replace('_', ' ') || 'SCHEDULED'}
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
