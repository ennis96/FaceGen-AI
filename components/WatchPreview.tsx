import React, { useState, useEffect } from 'react';
import { Platform } from '../types';

interface WatchPreviewProps {
  imageUrl: string | null;
  platform: Platform;
  isLoading?: boolean;
}

const WatchPreview: React.FC<WatchPreviewProps> = ({ imageUrl, platform, isLoading }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.toLocaleTimeString([], { hour: '2-digit', hour12: false });
  const minutes = time.toLocaleTimeString([], { minute: '2-digit' });
  const dateStr = time.toLocaleDateString([], { weekday: 'short', day: 'numeric' });

  // Styles for the physical watch casing
  const caseClasses = platform === Platform.APPLE_WATCH
    ? "rounded-[2.5rem] aspect-[4/5]" // Rectangular with rounded corners
    : "rounded-full aspect-square";   // Circular

  const screenClasses = platform === Platform.APPLE_WATCH
    ? "rounded-[2rem]"
    : "rounded-full";

  return (
    <div className="relative flex flex-col items-center justify-center p-8">
      {/* Watch Casing */}
      <div className={`relative bg-neutral-800 p-3 shadow-2xl ring-1 ring-white/10 ${caseClasses} w-full max-w-[320px] transition-all duration-300`}>
        
        {/* Screen/Display Area */}
        <div className={`relative w-full h-full overflow-hidden bg-black ${screenClasses} ring-4 ring-black/50`}>
          
          {/* Background Image */}
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Watch Face" 
              className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100'}`}
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600">
              <span className="text-sm font-medium">No Design Loaded</span>
            </div>
          )}

          {/* Complications Overlay */}
          {platform === Platform.WEAR_OS ? (
            // Wear OS Standard Analog/Digital Hybrid Layout
            <div className="absolute inset-0 flex flex-col items-center justify-between py-12 pointer-events-none z-10 text-white drop-shadow-md">
              <div className="text-xs font-semibold uppercase tracking-widest opacity-80">100%</div>
              <div className="flex flex-col items-center">
                <span className="text-6xl font-bold tracking-tighter leading-none">
                   {time.getHours()}:{String(time.getMinutes()).padStart(2, '0')}
                </span>
                <span className="text-lg font-medium text-emerald-400 mt-1">{dateStr}</span>
              </div>
              <div className="flex gap-4 text-xs font-medium opacity-80">
                 <span>12,403 Steps</span>
              </div>
            </div>
          ) : (
            // Apple Watch "Photos" Face Layout simulation
            // Typically time is bottom left, top right, or custom. 
            // We'll simulate the popular "Time Top Right" or "Bottom Left" style.
            <div className="absolute inset-0 p-6 pointer-events-none z-10 text-white drop-shadow-lg flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div className="flex flex-col">
                   <span className="text-xs font-medium opacity-70 uppercase">{dateStr}</span>
                   <span className="text-xs font-medium opacity-70">10:00 AM Meeting</span>
                 </div>
                 <div className="flex flex-col items-end leading-none">
                    <span className="text-6xl font-normal tracking-tight">{time.getHours()}</span>
                    <span className="text-6xl font-normal tracking-tight text-emerald-300">{String(time.getMinutes()).padStart(2, '0')}</span>
                 </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="flex flex-col gap-1">
                   <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                      Activity
                   </div>
                </div>
                {/* Complication placeholder */}
                <div className="text-xs font-medium opacity-70">
                   72 BPM
                </div>
              </div>
            </div>
          )}

          {/* Loading Spinner Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
               <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

        </div>

        {/* Gloss/Reflection Effect */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none z-30 ${screenClasses}`}></div>
      </div>

      {/* Strap Hint */}
      <div className="absolute -z-10 w-40 h-[120%] bg-neutral-900/50 rounded-full blur-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      
      {/* Platform Label */}
      <div className="absolute -bottom-10 text-xs font-medium text-neutral-500 uppercase tracking-widest">
        {platform === Platform.APPLE_WATCH ? "Photos Face Preview" : "Galaxy Watch Preview"}
      </div>
    </div>
  );
};

export default WatchPreview;