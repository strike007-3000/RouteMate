# Issue Log: Stuck Loading Spinner on Auth Screens due to Missing Middleware

## Problem Description
After redesigning the authentication flow to use custom step-based OTP hooks (`useSignIn` and `useSignUp`), the login and signup pages became permanently stuck on the loading spinner in production (Vercel).

### Root Causes
1. **Disabled Clerk Middleware**: Next.js automatically looks for a file named `middleware.ts` in either the `/src` or root directory to execute middleware hooks. In a previous commit, `src/middleware.ts` was renamed to `src/proxy.ts`. Because of this rename, Next.js completely skipped compiling and running the Clerk middleware. Consequently, the required Clerk cookies were never synchronized or written by the server, which left the client-side hooks (`useSignIn` and `useSignUp`) unable to establish their handshake, keeping `isLoaded` set to `false` indefinitely.
2. **Missing Client Hydration Guards**: Invoking `useSignIn` and `useSignUp` directly during server pre-rendering / initial hydration without a mount flag can occasionally result in hydration loops or stale loading state references.

## Solution
1. **Restore Middleware Entrypoint**: Created a new `src/middleware.ts` that acts as the standard Next.js entrypoint and exports the configurations directly from `src/proxy.ts`. This satisfies the framework's file-lookup requirements without modifying the existing middleware logic inside `proxy.ts`:
   ```typescript
   export { default, config } from './proxy';
   ```
2. **Client Hydration Mount Guard**: Added a local `mounted` state inside both `login/page.tsx` and `signup/page.tsx` using `useState` and `useEffect` to ensure the hook and loaded state transitions are checked and evaluated strictly after client-side mounting.

## Verification & Tracking
- **Branch**: `fix/auth-is-loaded-loop`
- **Verification**: Run `npm run build` to verify middleware and route compilation, then push the fix branch to Vercel for remote verification.
