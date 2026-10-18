'use client';

import React, { useState } from 'react';
import { db } from '@/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import type { TripList, ListItem } from '@/lib/db';
import { Check } from 'lucide-react';

interface ChecklistProps {
  tripId: number;
}

const PACKING_TEMPLATES: Record<string, string[]> = {
  packing: ['Passport', 'Phone charger', 'Toothbrush', 'Clothes', 'Shoes']
};

export const Checklist = ({ tripId }: ChecklistProps) => {
  const lists = useLiveQuery(
    () => db.tripLists.where('tripId').equals(tripId).toArray(),
    [tripId]
  ) as TripList[] | undefined;

  const [type, setType] = useState<'packing'|'todo'|'shopping'>('packing');
  const [title, setTitle] = useState('');
  const [newItem, setNewItem] = useState('');

  const createList = async () => {
    if (!title) return;
    const customItem = newItem.trim();
    const itemNames = type === 'packing'
      ? [...PACKING_TEMPLATES.packing, ...(customItem ? [customItem] : [])]
      : customItem ? [customItem] : [];
    const items: ListItem[] = itemNames.map(text => ({
      id: crypto.randomUUID(),
      text,
      checked: false
    }));
    await db.tripLists.add({
      tripId,
      type,
      title,
      items,
      createdAt: new Date().toISOString()
    });
    setTitle('');
    setNewItem('');
  };

  const toggleItem = async (listId: number, itemId: string) => {
    const list = await db.tripLists.get(listId);
    if (!list) return;
    const items = list.items.map(it => it.id === itemId ? { ...it, checked: !it.checked } : it);
    await db.tripLists.update(listId, { items });
  };

  return (
    <div className="glass-card rounded-[24px] p-6">
      <h3 className="text-white font-bold uppercase tracking-[0.2em] text-sm mb-4">Checklists</h3>
      <div className="flex gap-2 mb-3">
        {(['packing','todo','shopping'] as const).map(t => (
          <button key={t} onClick={()=>setType(t)} className={`px-3 py-1 rounded-[24px] text-xs border ${type===t?'border-primary text-primary':'border-white/10 text-white/60'}`}>{t}</button>
        ))}
      </div>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="List title" className="auth-input w-full mb-2" />
      <div className="flex gap-2 mb-4">
        <input value={newItem} onChange={e=>setNewItem(e.target.value)} placeholder="New item" className="auth-input flex-1" />
        <button onClick={createList} className="btn-primary">Create</button>
      </div>
      <div className="space-y-4">
        {lists?.map(list => (
          <div key={list.id} className="border border-white/10 rounded-[24px] p-4">
            <h4 className="text-white/90 text-sm mb-2">{list.title} <span className="text-zinc-500">({list.type})</span></h4>
            <ul className="space-y-1">
              {list.items.map(it => (
                <li key={it.id} className="flex items-center gap-2 text-zinc-300 text-sm">
                  <button onClick={()=>list.id && toggleItem(list.id, it.id)} className={`w-5 h-5 rounded-full border flex items-center justify-center ${it.checked?'bg-primary border-primary':'border-white/20'}`}>
                    {it.checked && <Check size={12} className="text-black"/>}
                  </button>
                  <span className={it.checked?'line-through text-zinc-600':''}>{it.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};
