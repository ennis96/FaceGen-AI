import React, { useState, useEffect } from 'react';
import { Platform, FaceConfiguration, WatchHandStyle, ComplicationLayout } from '../types';

interface WatchPreviewProps {
  imageUrl: string | null;
  platform: Platform;
  isLoading?: boolean;
  config?: FaceConfiguration;
}

const WatchPreview: React.FC<WatchPreviewProps> = ({ imageUrl, platform, isLoading, config }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hrs = time.getHours();
  const mins = time.getMinutes();
  const secs = time.getSeconds();
  const dateStr = time.toLocaleDateString([], { weekday: 'short', day: 'numeric' });

  // Calculate rotation degrees for analog hands
  const hrRotation = (hrs % 12) * 30 + (mins / 2);
  const minRotation = mins * 6;
  const secRotation = secs * 6;

  const activeConfig = config || {
     handStyle: WatchHandStyle.CLASSIC,
     complicationLayout: ComplicationLayout.MINIMAL,
     accentColor: '#ffffff'
  };

  const { handStyle, complicationLayout, accentColor } = activeConfig;

  // Styles for the physical watch casing
  const caseClasses = platform === Platform.APPLE_WATCH
    ? "rounded-[2.5rem] aspect-[4/5]"
    : "rounded-full aspect-square";

  const screenClasses = platform === Platform.APPLE_WATCH
    ? "rounded-[2rem]"
    : "rounded-full";

  // --- Hand Renderers ---
  const renderAnalogHands = () => {
    if (handStyle === WatchHandStyle.DIGITAL) return null;

    const isMinimal = handStyle === WatchHandStyle.MINIMAL;
    const isSport = handStyle === WatchHandStyle.SPORT;
    const isBlocky = handStyle === WatchHandStyle.BLOCKY;

    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
         {/* Hands Container */}
         <div className="relative w-full h-full">
            {/* Hour Hand */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full origin-bottom"
              style={{ transform: `rotate(${hrRotation}deg)`, height: isSport ? '25%' : '30%', width: isBlocky ? '8px' : '4px' }}
            >
               <div className={`w-full h-full ${isMinimal ? 'bg-white' : 'bg-white border border-neutral-400'} rounded-full shadow-md`}></div>
            </div>

            {/* Minute Hand */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full origin-bottom"
              style={{ transform: `rotate(${minRotation}deg)`, height: isSport ? '35%' : '40%', width: isBlocky ? '6px' : '3px' }}
            >
               <div className={`w-full h-full ${isMinimal ? 'bg-white' : 'bg-white border border-neutral-400'} rounded-full shadow-md`}></div>
            </div>

            {/* Second Hand */}
            {!isMinimal && (
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full origin-bottom"
                style={{ transform: `rotate(${secRotation}deg)`, height: '42%', width: '1.5px' }}
              >
                 <div className="w-full h-full rounded-full shadow-sm" style={{ backgroundColor: accentColor }}></div>
              </div>
            )}
            
            {/* Center Cap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-black rounded-full border-2 border-white z-30"></div>
         </div>
      </div>
    );
  };

  const renderDigitalTime = () => {
    // Show digital time if specifically Digital style OR if layout includes full/digital elements
    if (handStyle !== WatchHandStyle.DIGITAL && complicationLayout !== ComplicationLayout.FULL) return null;

    // If hands are shown, digital time is small. If Digital Only, it's huge.
    const isBig = handStyle === WatchHandStyle.DIGITAL;

    return (
       <div className={`absolute ${isBig ? 'inset-0 flex items-center justify-center' : 'top-8 w-full flex justify-center'} z-10 text-white drop-shadow-md`}>
          <span 
            className={`${isBig ? 'text-6xl md:text-7xl font-bold tracking-tighter' : 'text-xl font-medium'} leading-none`}
            style={{ color: isBig ? accentColor : 'white' }}
          >
             {hrs}:{String(mins).padStart(2, '0')}
          </span>
       </div>
    );
  };

  const renderComplications = () => {
     if (complicationLayout === ComplicationLayout.NONE) return null;

     return (
        <div className="absolute inset-0 p-6 pointer-events-none z-10 flex flex-col justify-between text-white drop-shadow-md">
           {/* Top Complication */}
           <div className="flex justify-center">
              {complicationLayout !== ComplicationLayout.NONE && (
                 <span className="text-xs font-semibold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {dateStr}
                 </span>
              )}
           </div>

           {/* Bottom Complications (Activity) */}
           <div className="flex justify-between items-end">
              {(complicationLayout === ComplicationLayout.ACTIVITY || complicationLayout === ComplicationLayout.FULL) && (
                 <>
                  <div className="flex flex-col items-center gap-0.5">
                     <div className="w-8 h-8 rounded-full border-2 border-dashed border-white/50 flex items-center justify-center text-[9px] font-bold">
                        75%
                     </div>
                     <span className="text-[10px] uppercase opacity-80">Steps</span>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                     <span className="text-xl font-bold leading-none" style={{ color: accentColor }}>72</span>
                     <span className="text-[10px] uppercase opacity-80">BPM</span>
                  </div>
                 </>
              )}
           </div>
        </div>
     );
  };

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

          {/* Overlays */}
          {!isLoading && (
             <>
               {renderComplications()}
               {renderDigitalTime()}
               {renderAnalogHands()}
             </>
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
      <div className="absolute -bottom-10 text-xs font-medium text-neutral-500 uppercase tracking-widest flex items-center gap-2">
        {platform === Platform.APPLE_WATCH ? "Apple Watch Preview" : "Wear OS Preview"}
      </div>
    </div>
  );
};

export default WatchPreview;