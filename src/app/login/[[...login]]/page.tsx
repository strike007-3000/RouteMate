'use client';

import React, { useState } from 'react';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, EyeOff, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { OtpForm } from '@/components/auth/OtpForm';

export default function LoginPage() {
  const signInHook = useSignIn() as any;
  const router = useRouter();
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [mounted, setMounted] = useState(false);
  
  // Fields state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setMounted(true);
    console.log("Clerk Pub Key present:", !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  }, []);

  if (!mounted || !signInHook || !signInHook.isLoaded) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center font-sans">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </main>
    );
  }

  const { signIn, setActive } = signInHook;

  // Handle standard credential form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const result = await signIn.create({
        identifier: email,
        password,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/trips');
      } else if (result.status === 'needs_second_factor') {
        // Prepare verification code for email
        const factor = result.supportedFirstFactors.find(
          (f: any) => f.strategy === 'email_code'
        );
        if (factor) {
          await signIn.prepareFirstFactor({ strategy: 'email_code' });
          setStep('otp');
        } else {
          setError('Verification method not supported');
        }
      } else {
        setError('Verification required. Please check your account settings.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Sign in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth
  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/trips',
      });
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'OAuth initialization failed');
      setIsLoading(false);
    }
  };

  // Handle OTP Code Verification
  const handleOtpVerify = async (code: string) => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: 'email_code',
        code,
      });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/trips');
      } else {
        setError('Incorrect or expired verification code');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP Resend
  const handleOtpResend = async () => {
    try {
      await signIn.prepareFirstFactor({ strategy: 'email_code' });
    } catch (err: any) {
      setError('Failed to resend code');
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Top Center Ambient Radial Glow */}
      <div className="absolute top-[-20%] left-[10%] right-[10%] mx-auto w-[80%] h-[50%] bg-primary/15 blur-[120px] rounded-full pointer-events-none z-0" />
      
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

        <div className="w-full">
          <AnimatePresence mode="wait">
            {step === 'form' ? (
              <motion.div
                key="form-step"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="auth-google-btn"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  Continue with Google
                </button>

                <div className="auth-divider">or</div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="auth-input"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 relative">
                    <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input pr-12"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center mt-2">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-primary w-full mt-4"
                  >
                    {isLoading ? 'Verifying...' : 'Continue →'}
                  </button>
                </form>

                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest text-center mt-8">
                  New to RouteMate?{' '}
                  <Link href="/signup" className="text-primary hover:text-primary-focus transition-colors">
                    Sign up
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
              >
                <OtpForm
                  email={email}
                  onVerify={handleOtpVerify}
                  onResend={handleOtpResend}
                  onBack={() => setStep('form')}
                  isLoading={isLoading}
                  error={error}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
