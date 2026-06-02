'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { User } from 'lucide-react';

export const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();

  const isSubRoute = pathname.includes('/trip/') || pathname.includes('/explore/') || pathname.includes('/timeline/');

  // Determine Title based on current architecture
  let title = 'My Trips';
  if (pathname.includes('/timeline')) title = 'Itinerary';
  else if (pathname === '/explore') title = 'Explore';
  else if (pathname === '/radar') title = 'Radar';
  else if (pathname === '/account') title = 'Account Hub';
  else if (pathname === '/trips' || pathname === '/') title = 'My Trips';

  // Javascript fallback for browsers that do not support CSS scroll-driven animations
  const [scrollPercent, setScrollPercent] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const isScrollTimelineSupported = 
      window.CSS && 
      window.CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');

    if (isScrollTimelineSupported) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const percent = Math.min(1, scrollY / 100);
      setScrollPercent(percent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      style={{ 
        paddingTop: 'var(--safe-top)',
        '--scroll-percent': scrollPercent
      } as React.CSSProperties}
      className={cn(
        "sticky top-0 z-50 w-full px-[var(--gutter,24px)] pb-4 transition-all duration-300 shrinking-header border-b",
        isSubRoute ? "bg-black/60 backdrop-blur-xl border-white/5" : "bg-black border-white/5"
      )}
    >
      <div className="h-16 flex items-center justify-between header-inner">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1 header-brand">
              <span className="text-[10px] font-normal text-white tracking-[0.4em] flex items-center">
                routemate
                <span className="ml-1.5 font-black text-primary bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded-[6px] tracking-normal normal-case">
                  .top
                </span>
              </span>
            </div>
            <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] font-black text-white tracking-tighter leading-none truncate max-w-[250px] header-title">
              {title}
            </h1>
          </div>
        </div>

        {/* Relocated DEV Indicator & Asymmetric balance */}
        <div className="flex items-center gap-3">
          {process.env.NODE_ENV === 'development' && (
            <span className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest border border-amber-500/20 px-1.5 py-0.5 rounded-sm bg-amber-500/5">DEV</span>
          )}
          {pathname !== '/account' ? (
            <button 
              onClick={() => router.push('/account')}
              className="w-10 h-10 rounded-full border-2 border-primary/40 hover:border-primary/80 active:scale-95 transition-all flex items-center justify-center overflow-hidden cursor-pointer bg-zinc-950"
            >
              {user?.image ? (
                <img src={user.image} alt={user.name || "Profile"} className="w-full h-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-primary" />
              )}
            </button>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>
    </header>
  );
};