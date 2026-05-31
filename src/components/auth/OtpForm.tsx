'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OtpFormProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  isLoading: boolean;
  error: string;
}

export const OtpForm: React.FC<OtpFormProps> = ({
  email,
  onVerify,
  onResend,
  onBack,
  isLoading,
  error,
}) => {
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [resendTimer, setResendTimer] = useState<number>(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Focus first input automatically on render
    inputRefs.current[0]?.focus();

    // Start 60s countdown timer
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleChange = (value: string, index: number) => {
    const newCode = [...code];
    // Keep only the last character entered
    const char = value.slice(-1);
    newCode[index] = char;
    setCode(newCode);

    // If typing a character, advance to the next box
    if (char !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // Handle backspace when input is already empty
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      const newCode = [...code];
      newCode[index - 1] = '';
      setCode(newCode);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return; // Only allow digits

    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    setCode(newCode);

    // Focus last filled index or fallback to focus the last input
    const targetFocusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[targetFocusIndex]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length === 6) {
      await onVerify(fullCode);
    }
  };

  const handleResendClick = async () => {
    if (resendTimer > 0) return;
    await onResend();
    setResendTimer(60);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
      <div className="text-center mb-6">
        <h2 className="text-xl font-black text-white tracking-tight mb-2">Check your inbox</h2>
        <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
          We sent a 6-digit verification code to
          <span className="block text-primary mt-1 lowercase font-semibold">{email}</span>
        </p>
      </div>

      <div className="flex gap-2.5 justify-center mb-6" onPaste={handlePaste}>
        {code.map((value, index) => (
          <input
            key={index}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={value}
            ref={(el) => { inputRefs.current[index] = el; }}
            onChange={(e) => handleChange(e.target.value, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            className="auth-otp-box"
            disabled={isLoading}
          />
        ))}
      </div>

      {error && (
        <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center mb-6">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading || code.join('').length < 6}
        className="btn-primary w-full disabled:opacity-50 disabled:pointer-events-none mb-6"
      >
        {isLoading ? 'Verifying...' : 'Verify Code →'}
      </button>

      <div className="flex flex-col items-center gap-4">
        <button
          type="button"
          onClick={handleResendClick}
          disabled={resendTimer > 0}
          className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-primary transition-all disabled:opacity-50"
        >
          {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend Verification Code'}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-400 transition-all"
        >
          ← Back
        </button>
      </div>
    </form>
  );
};
