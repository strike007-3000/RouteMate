# Issue Log: Stuck Blank Auth Screen During Clerk Hook Initialization

## Problem Description
On both `/login` and `/signup` routes, custom pages utilize Clerk's isomorphic hooks (`useSignIn` and `useSignUp`). Under the hood, these hooks query remote endpoints and state variables asynchronously. 

When the component initially mounts, `isLoaded` evaluates to `false`. The previous implementation returned `null` during this phase:
```tsx
if (!signInHook || !signInHook.isLoaded) {
  return null;
}
```
In multiple configurations of Next.js hydration cycles and server-to-client transitions, rendering `null` completely suspends subsequent client-side updates, locking the screen as a stuck blank container even when `isLoaded` transitions to `true`.

## Solution
Instead of a blank canvas/null element, we render a themed loading spinner (`Loader2` from `lucide-react`) within the app layout container. This forces a persistent DOM node during loading and triggers normal hydration updates as hook parameters change:

```tsx
if (!signInHook || !signInHook.isLoaded) {
  return (
    <main className="min-h-screen bg-black flex items-center justify-center font-sans">
      <Loader2 className="w-8 h-8 text-primary animate-spin" />
    </main>
  );
}
```

## Verification & Tracking
- **PR Created**: [#46](https://github.com/strike007-3000/RouteMate/pull/46)
- **Branch**: `fix/auth-loading-state`
- **Build Status**: Compiles successfully (production bundle verified).
