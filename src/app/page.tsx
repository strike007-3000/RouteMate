import React from 'react';
import Link from 'next/link';
import { Sparkles, Compass, Shield, Database, ArrowRight } from 'lucide-react';

export default function RootPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-between p-6 relative overflow-hidden font-sans text-white">
      {/* Top Center Ambient Radial Glow */}
      <div className="absolute top-[-20%] left-[10%] right-[10%] mx-auto w-[80%] h-[50%] bg-primary/15 blur-[120px] rounded-full pointer-events-none z-0" />
      
      {/* Main Content Area */}
      <div className="w-full max-w-[500px] flex-1 flex flex-col justify-center py-12 relative z-10 space-y-12">
        
        {/* Brand Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Next-Generation Travel</span>
          </div>
          <h1 className="text-5xl font-normal tracking-tighter flex items-center justify-center">
            routemate
            <span className="ml-2.5 text-2xl font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-[8px] tracking-normal normal-case">
              .top
            </span>
          </h1>
          <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
            Pocket Intelligence for the Modern Nomad.
          </p>
        </div>

        {/* Feature Highlights Section */}
        <div className="space-y-4">
          <div className="p-5 rounded-[24px] bg-zinc-900/30 border border-white/5 flex items-start gap-4 hover:bg-zinc-900/50 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300 mb-1">AI Smart Paste</h3>
              <p className="text-xs text-zinc-500 font-bold leading-relaxed">
                Copy-paste flight confirmations, lodging receipts, or text itineraries. routemate.top parses them instantly.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-[24px] bg-zinc-900/30 border border-white/5 flex items-start gap-4 hover:bg-zinc-900/50 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300 mb-1">Contextual Routing</h3>
              <p className="text-xs text-zinc-500 font-bold leading-relaxed">
                Automatic Haversine transit suggestions, airport terminal mapping, and weather/flight telemetry.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-[24px] bg-zinc-900/30 border border-white/5 flex items-start gap-4 hover:bg-zinc-900/50 transition-colors">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-zinc-300 mb-1">Offline IndexedDB Vault</h3>
              <p className="text-xs text-zinc-500 font-bold leading-relaxed">
                All itinerary stops and preferences are secured locally. Accessible offline, even in flight.
              </p>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="space-y-4 pt-4">
          <Link 
            href="/trips" 
            className="w-full h-14 rounded-[24px] border-2 border-primary text-primary font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-primary hover:text-black transition-all"
            id="cta-launch-app"
          >
            Launch App <ArrowRight className="w-4 h-4" />
          </Link>
          
          <div className="grid grid-cols-2 gap-4">
            <Link 
              href="/login" 
              className="h-14 rounded-[24px] bg-zinc-900/50 border border-white/5 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-zinc-800 transition-all"
              id="cta-sign-in"
            >
              Sign In
            </Link>
            <Link 
              href="/signup" 
              className="h-14 rounded-[24px] bg-zinc-900/50 border border-white/5 text-white font-black uppercase tracking-widest text-xs flex items-center justify-center hover:bg-zinc-800 transition-all"
              id="cta-sign-up"
            >
              Register
            </Link>
          </div>
        </div>

      </div>

      {/* Brand Compliance Footer */}
      <div className="w-full max-w-[500px] text-center border-t border-white/5 pt-6 pb-4 relative z-10">
        <div className="flex items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4">
          <Link href="/privacy" className="hover:text-white transition-colors" id="footer-privacy-link">Privacy Policy</Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-white transition-colors" id="footer-terms-link">Terms of Service</Link>
        </div>
        <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed px-4">
          routemate.top's use and transfer of information received from Google APIs to any other app will adhere to{' '}
          <a 
            href="https://developers.google.com/terms/api-services-user-data-policy" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-500 hover:text-primary transition-colors underline"
            id="google-limited-use-link"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements.
        </p>
      </div>
    </main>
  );
}
