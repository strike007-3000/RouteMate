import { Header } from '@/components/layout/Header';
import { BentoGrid } from '@/components/dashboard/BentoGrid';
import { Timeline } from '@/components/timeline/Timeline';

export default function Home() {
  return (
    <main className="min-h-screen bg-background pb-20 max-w-md mx-auto border-x border-border/50 shadow-2xl shadow-black/50">
      <Header />
      <BentoGrid />
      <Timeline />
      
      {/* Tab Bar placeholder for mobile app feel */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass h-20 px-10 flex items-center justify-between pointer-events-none">
        <div className="flex flex-col items-center gap-1 opacity-100">
           <div className="w-6 h-6 rounded-full bg-primary" />
           <span className="text-[10px] font-black text-primary uppercase">Explore</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-30">
           <div className="w-6 h-6 rounded-full bg-foreground" />
           <span className="text-[10px] font-black uppercase">Search</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-30">
           <div className="w-6 h-6 rounded-full bg-foreground" />
           <span className="text-[10px] font-black uppercase">Saved</span>
        </div>
      </div>
    </main>
  );
}
