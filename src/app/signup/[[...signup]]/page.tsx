'use client';

import React from 'react';
import { SignUp } from '@clerk/nextjs';
import { dark } from '@clerk/ui/themes';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-sm relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Ready for Takeoff</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-3">RouteMate</h1>
          <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
            Pocket Intelligence for the Modern Nomad.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full flex justify-center"
        >
          <SignUp 
            path="/signup"
            appearance={{
              theme: dark,
              elements: {
                rootBox: "w-full",
                card: "bg-zinc-950 border border-white/10 rounded-[24px] shadow-2xl text-white",
                headerTitle: "text-white font-black text-2xl tracking-tighter",
                headerSubtitle: "text-zinc-500 text-xs font-bold uppercase tracking-widest",
                socialButtonsBlockButton: "bg-zinc-900 border border-white/5 text-white hover:bg-zinc-800 transition-all rounded-xl h-12",
                socialButtonsBlockButtonText: "text-white font-bold text-xs uppercase tracking-wider",
                dividerLine: "bg-white/5",
                dividerText: "text-[10px] font-black text-zinc-600 uppercase tracking-widest",
                formFieldLabel: "text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1",
                formFieldInput: "bg-black border border-white/5 rounded-xl h-12 text-xs font-bold text-white focus:outline-none focus:border-primary/30 transition-all",
                formButtonPrimary: "btn-primary w-full bg-transparent hover:bg-primary/10 border-2 border-primary text-primary transition-all rounded-[24px] h-12 font-black uppercase tracking-widest text-xs",
                footerActionText: "text-zinc-500 text-[10px] font-black uppercase tracking-widest",
                footerActionLink: "text-primary hover:text-primary-focus transition-colors",
              }
            }}
          />
        </motion.div>
      </div>
    </main>
  );
}
