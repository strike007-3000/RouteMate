'use client';

import React from 'react';
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs';
import { Loader2 } from 'lucide-react';

export default function SsoCallbackPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Top Center Ambient Radial Glow */}
      <div className="absolute top-[-20%] left-[10%] right-[10%] mx-auto w-[80%] h-[50%] bg-primary/15 blur-[120px] rounded-full pointer-events-none z-0" />
      
      <div className="w-full max-w-sm relative z-10 flex flex-col items-center text-center space-y-6">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <h1 className="text-2xl font-black text-white tracking-tighter">Redirecting...</h1>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
          Verifying your credentials and opening your passport.
        </p>
      </div>

      <AuthenticateWithRedirectCallback 
        signInForceRedirectUrl="/trips"
        signUpForceRedirectUrl="/trips"
      />
    </main>
  );
}
