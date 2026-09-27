import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function errorMessage(error: unknown, fallback: string): string {
  if (typeof error !== 'object' || error === null || !('errors' in error)) return fallback;
  const errors = error.errors;
  if (!Array.isArray(errors)) return fallback;
  const message = errors[0]?.message;
  return typeof message === 'string' ? message : fallback;
}
