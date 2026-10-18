'use client';

import React, { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { exportTrip, importTrip } from '@/lib/exportTrip';

interface TripPortabilityProps {
  tripId?: number;
}

export const TripPortability = ({ tripId }: TripPortabilityProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    if (!tripId) return;
    setError('');
    try {
      await exportTrip(tripId);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : 'Unable to export trip');
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError('');
    setIsImporting(true);
    try {
      const importedTripId = await importTrip(file);
      router.push(`/trip/${importedTripId}/timeline`);
    } catch (importError) {
      setError(importError instanceof Error ? importError.message : 'Unable to import trip');
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <div className="glass-card rounded-[24px] p-6">
      <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm mb-4">Portable Trips</h3>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        className="hidden"
        onChange={handleImport}
      />
      <div className={tripId ? 'grid grid-cols-2 gap-3' : ''}>
        {tripId && (
          <button type="button" onClick={handleExport} className="btn-primary w-full">
            <Download className="w-4 h-4" />
            Export
          </button>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="btn-primary w-full disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {isImporting ? 'Importing' : 'Import'}
        </button>
      </div>
      {error && <p role="alert" className="text-red-400 text-xs mt-3">{error}</p>}
    </div>
  );
};
