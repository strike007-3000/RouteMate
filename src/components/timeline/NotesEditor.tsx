'use client';

import React, { useState } from 'react';
import { db } from '@/lib/db';
import { ItineraryItem } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

interface NotesEditorProps {
  item: ItineraryItem;
}

export const NotesEditor = ({ item }: NotesEditorProps) => {
  const [notes, setNotes] = useState(item.notes || '');
  const [links, setLinks] = useState(item.links?.join('\n') || '');
  const [saved, setSaved] = useState(false);

  const save = async () => {
    await db.itineraryItems.update(item.id!, {
      notes,
      links: links.split('\n').map(l => l.trim()).filter(Boolean)
    });
    setSaved(true);
    setTimeout(()=>setSaved(false), 1500);
  };

  return (
    <div className="glass-card rounded-[24px] p-4 mt-3">
      <textarea
        value={notes}
        onChange={e=>setNotes(e.target.value)}
        placeholder="Notes for this stop..."
        className="auth-input w-full h-24 resize-none mb-2"
      />
      <textarea
        value={links}
        onChange={e=>setLinks(e.target.value)}
        placeholder="Links, one per line"
        className="auth-input w-full h-20 resize-none mb-2"
      />
      <button onClick={save} className="btn-primary w-full">Save Notes</button>
      {saved && <span className="text-green-400 text-xs mt-2 block">Saved</span>}
    </div>
  );
};
