'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Sparkles, Navigation } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';

const destinations = [
  {
    id: 1,
    name: 'Tokyo',
    country: 'Japan',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop',
    description: 'Neon lights and ancient shrines. The ultimate urban adventure.',
    tags: ['Urban', 'Food', 'Culture']
  },
  {
    id: 2,
    name: 'Paris',
    country: 'France',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop',
    description: 'The city of light. Romantic boulevards and world-class art.',
    tags: ['Romantic', 'Art', 'History']
  },
  {
    id: 3,
    name: 'Bali',
    country: 'Indonesia',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000&auto=format&fit=crop',
    description: 'Tropical paradise. Spiritual retreats and pristine beaches.',
    tags: ['Nature', 'Spiritual', 'Relax']
  }
];

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-background pb-32 relative overflow-x-hidden w-full max-w-[500px] mx-auto flex flex-col">
      <Header />

      <section className="px-[var(--gutter,24px)] pt-6 space-y-8">
        {destinations.map((dest, i) => (
          <motion.div
            key={dest.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative h-96 rounded-[32px] overflow-hidden border border-white/5"
          >
            <img 
              src={dest.image} 
              alt={dest.name} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[3000ms]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="flex gap-1.5 mb-3">
                {dest.tags.map(tag => (
                  <span key={tag} className="text-[8px] font-black text-white/70 uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="text-3xl font-black text-white tracking-tighter mb-1">{dest.name}</h3>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-6">
                <MapPin className="w-3 h-3 text-primary" />
                {dest.country}
              </p>
              
              <button className="btn-primary w-full">
                <Globe className="w-4 h-4" />
                <span>View Details</span>
              </button>
            </div>
            
            {/* Sparkle Badge with Backdrop Blur */}
            <div className="absolute top-6 right-6">
              <div className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      <BottomNav />
    </main>
  );
}
