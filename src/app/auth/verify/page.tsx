'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/login?error=invalid');
      return;
    }

    // Redirect to the API endpoint which sets the HTTP-only cookie and redirects
    window.location.href = `/api/auth/verify?token=${encodeURIComponent(token)}`;
  }, [token, router]);

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Ambient Background */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-sm text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Verifying</span>
          </div>

          <div className="flex justify-center py-4">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>

          <h1 className="text-2xl font-black text-white tracking-tighter">Preparing your passport...</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
            Logging you in securely. Please wait.
          </p>
        </motion.div>
      </div>
    </main>
  );
}
