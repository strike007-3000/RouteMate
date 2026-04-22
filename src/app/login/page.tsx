'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Mail, ArrowRight, Globe, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = React.useState('');

  const handleLogin = (provider: 'google' | 'apple' | 'email') => {
    if (provider === 'google') {
      login('google', { 
        name: 'Jordan Smith', 
        email: 'jordan@google.com', 
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop' 
      });
    } else if (provider === 'apple') {
      login('apple', { 
        name: 'Casey Apple', 
        email: 'casey@apple.com',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=150&auto=format&fit=crop'
      });
    } else {
      login('email', { name: email.split('@')[0], email });
    }
    router.push('/trips');
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Ambient Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="w-full max-w-sm relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
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
          className="space-y-4"
        >
          {/* Social Auth Buttons */}
          <button 
            onClick={() => handleLogin('google')}
            className="w-full h-14 bg-white text-black rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all hover:bg-zinc-200"
          >
            <Globe className="w-5 h-5" />
            <span>Continue with Google</span>
          </button>

          <button 
            onClick={() => handleLogin('apple')}
            className="w-full h-14 bg-zinc-900 border border-white/10 text-white rounded-2xl flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all hover:bg-zinc-800"
          >
            <Apple className="w-5 h-5 fill-white" />
            <span>Continue with Apple</span>
          </button>

          {/* Divider */}
          <div className="py-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/5" />
            <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Or</span>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          {/* Email Login Form */}
          <div className="space-y-3">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-14 bg-zinc-900/50 border border-white/5 rounded-2xl pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-primary/30 transition-all placeholder:text-zinc-600"
              />
            </div>
            
            <button 
              onClick={() => handleLogin('email')}
              disabled={!email}
              className={cn(
                "w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-black text-sm uppercase tracking-widest transition-all",
                email 
                  ? "bg-primary text-white shadow-lg shadow-primary/20 active:scale-[0.98] hover:bg-blue-600" 
                  : "bg-zinc-900 text-zinc-600 border border-white/5 cursor-not-allowed"
              )}
            >
              <span>Get Magic Link</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-12 text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-relaxed px-8"
        >
          By continuing, you agree to our <span className="text-zinc-400">Terms of Service</span> and <span className="text-zinc-400">Privacy Policy</span>.
        </motion.p>
      </div>
    </main>
  );
}
