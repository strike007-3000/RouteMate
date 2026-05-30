'use client';

import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Apple, Mail, ArrowRight, Globe, Sparkles, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

function LoginContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const errorParam = searchParams.get('error');
  const [errorMessage, setErrorMessage] = React.useState(() => {
    if (errorParam === 'expired') {
      return 'The magic link has expired. Please request a new one.';
    } else if (errorParam === 'invalid') {
      return 'The magic link is invalid or has already been used.';
    } else if (errorParam === 'server') {
      return 'A server configuration error occurred. Please try again later.';
    }
    return '';
  });
  const [toastMessage, setToastMessage] = React.useState('');

  const handleSendMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMessage('');
    
    try {
      const res = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus('sent');
      } else {
        const data = await res.json();
        setStatus('error');
        setErrorMessage(data.error || 'Failed to send magic link. Please check your setup.');
      }
    } catch (err) {
      setStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
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
          {/* Error Banner */}
          {errorMessage && (
            <div className="p-4 rounded-[20px] bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {status !== 'sent' ? (
            <>
              {/* Social Auth Buttons */}
              <button 
                onClick={() => triggerToast('Google Authentication coming soon!')}
                className="w-full h-14 bg-white text-black rounded-[24px] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all hover:bg-zinc-200"
              >
                <Globe className="w-5 h-5" />
                <span>Continue with Google</span>
              </button>

              <button 
                onClick={() => triggerToast('Apple Authentication coming soon!')}
                className="w-full h-14 bg-zinc-900 border border-white/10 text-white rounded-[24px] flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest active:scale-[0.98] transition-all hover:bg-zinc-800"
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
              <form onSubmit={handleSendMagicLink} className="space-y-3">
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    disabled={status === 'loading'}
                    className="w-full h-14 bg-zinc-900/50 border border-white/5 rounded-[24px] pl-12 pr-4 text-sm font-bold text-white focus:outline-none focus:border-primary/30 transition-all placeholder:text-zinc-600 disabled:opacity-50"
                  />
                </div>
                
                <button 
                  type="submit"
                  disabled={!email || status === 'loading'}
                  className={cn(
                    "w-full btn-primary flex items-center justify-center gap-2",
                    (!email || status === 'loading') && "opacity-30 cursor-not-allowed pointer-events-none"
                  )}
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Magic Link</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Check Email Confirmation Card */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 rounded-[32px] bg-zinc-900/30 border border-white/5 text-center space-y-6"
            >
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-black text-white tracking-tighter">Check your inbox</h3>
                <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                  We sent a secure login link to <span className="text-white font-bold">{email}</span>. Click the link to proceed.
                </p>
              </div>
              <button 
                onClick={() => setStatus('idle')}
                className="text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest transition-colors"
              >
                Back to Login
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Global Toast */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full bg-zinc-900 border border-white/10 text-white text-xs font-bold uppercase tracking-widest shadow-2xl z-50"
            >
              {toastMessage}
            </motion.div>
          )}
        </AnimatePresence>

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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    }>
      <LoginContent />
    </Suspense>
  );
}
