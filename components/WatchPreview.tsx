import React, { useState, useEffect } from 'react';
import { Platform, FaceConfiguration, WatchHandStyle, ComplicationType } from '../types.ts';
import { Battery, Cloud, Footprints, Heart, Calendar } from './Icons.tsx';

interface WatchPreviewProps {
  imageUrl: string | null;
  platform: Platform;
  isLoading?: boolean;
  config?: FaceConfiguration;
}

// Helper Component for Circular Progress Complications
const ComplicationRing = ({ percentage, color, children }: { percentage: number, color: string, children: React.ReactNode }) => {
  const radius = 18;
  const stroke = 2.5;
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-[42px] h-[42px] bg-black/40 backdrop-blur-md rounded-full shadow-lg ring-1 ring-white/10">
      <svg
        height={radius * 2}
        width={radius * 2}
        className="absolute inset-0 m-auto -rotate-90 transform"
      >
        <circle
          stroke="rgba(255,255,255,0.15)"
          strokeWidth={stroke}
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset, transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          strokeLinecap="round"
          fill="transparent"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
      <div className="z-10 flex flex-col items-center justify-center">
         {children}
      </div>
    </div>
  );
};

const ComplicationStandard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
    <div className={`flex flex-col items-center justify-center w-[42px] h-[42px] bg-black/40 backdrop-blur-md rounded-full shadow-lg ring-1 ring-white/10 ${className}`}>
        {children}
    </div>
);

const WatchPreview: React.FC<WatchPreviewProps> = ({ imageUrl, platform, isLoading, config }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hrs = time.getHours();
  const mins = time.getMinutes();
  const secs = time.getSeconds();
  
  // Calculate rotation degrees for analog hands
  const hrRotation = (hrs % 12) * 30 + (mins / 2);
  const minRotation = mins * 6;
  const secRotation = secs * 6;

  // Defaults
  const handStyle = config?.handStyle || WatchHandStyle.CLASSIC;
  const complications = config?.complications || { top: 'none', bottom: 'none', left: 'none', right: 'none' };
  const accentColor = config?.accentColor || '#ffffff';

  // Styles for the physical watch casing
  const caseClasses = platform === Platform.APPLE_WATCH
    ? "rounded-[3.5rem] aspect-[4/5]"
    : "rounded-full aspect-square";

  const screenClasses = platform === Platform.APPLE_WATCH
    ? "rounded-[2.8rem]"
    : "rounded-full";

  // --- Hand Renderers ---
  const renderAnalogHands = () => {
    if (handStyle === WatchHandStyle.DIGITAL) return null;

    const isMinimal = handStyle === WatchHandStyle.MINIMAL;
    const isSport = handStyle === WatchHandStyle.SPORT;
    const isBlocky = handStyle === WatchHandStyle.BLOCKY;

    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
         {/* Hands Container */}
         <div className="relative w-full h-full filter drop-shadow-xl">
            {/* Hour Hand */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full origin-bottom transition-transform duration-1000 ease-linear"
              style={{ transform: `rotate(${hrRotation}deg)`, height: isSport ? '25%' : '28%', width: isBlocky ? '10px' : '6px' }}
            >
               <div className={`w-full h-full ${isMinimal ? 'bg-white' : 'bg-white border-x-2 border-neutral-300'} rounded-full shadow-lg`}></div>
            </div>

            {/* Minute Hand */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full origin-bottom transition-transform duration-1000 ease-linear"
              style={{ transform: `rotate(${minRotation}deg)`, height: isSport ? '38%' : '42%', width: isBlocky ? '8px' : '4px' }}
            >
               <div className={`w-full h-full ${isMinimal ? 'bg-white' : 'bg-white border-x-2 border-neutral-300'} rounded-full shadow-lg`}></div>
            </div>

            {/* Second Hand */}
            {!isMinimal && (
              <div 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[85%] origin-[50%_85%] transition-transform duration-[100ms] ease-linear"
                style={{ transform: `rotate(${secRotation}deg)`, height: '50%', width: '2px' }}
              >
                 <div className="w-full h-full shadow-sm" style={{ backgroundColor: accentColor }}></div>
                 {/* Counterweight */}
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-2 w-1.5 h-6 rounded-full" style={{ backgroundColor: accentColor }}></div>
              </div>
            )}
            
            {/* Center Cap */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-black rounded-full border-[3px] border-white z-40 shadow-lg">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-neutral-400 rounded-full"></div>
            </div>
         </div>
      </div>
    );
  };

  const renderDigitalTime = () => {
    const isBig = handStyle === WatchHandStyle.DIGITAL;
    if (!isBig) return null;

    return (
       <div className={`absolute inset-0 flex items-center justify-center z-10 text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]`}>
          <div className="flex flex-col items-center">
            <span 
                className={`text-6xl md:text-7xl font-bold tracking-tighter leading-none`}
                style={{ color: accentColor }}
            >
                {hrs}:{String(mins).padStart(2, '0')}
            </span>
            <span className="text-lg text-white/80 font-medium tracking-widest mt-1">
                {time.toLocaleDateString([], { weekday: 'short', day: 'numeric' }).toUpperCase()}
            </span>
          </div>
       </div>
    );
  };

  const renderComplicationContent = (type: ComplicationType) => {
    switch (type) {
        case 'battery':
            return (
                <ComplicationRing percentage={85} color="#4ade80">
                    <Battery size={12} className="text-green-400 mb-0.5 fill-current/20" />
                    <span className="text-[9px] font-bold leading-none text-white">85</span>
                </ComplicationRing>
            );
        case 'steps':
             return (
                <ComplicationRing percentage={65} color="#facc15">
                    <Footprints size={12} className="text-yellow-400 mb-0.5 fill-current/20" />
                    <span className="text-[9px] font-bold leading-none text-white">8.5k</span>
                </ComplicationRing>
            );
        case 'heartrate':
            return (
                <ComplicationStandard className="border border-red-500/30">
                    <div className="relative">
                        <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-bold text-white leading-none mt-0.5">68</span>
                </ComplicationStandard>
            );
        case 'weather':
            return (
                <ComplicationStandard>
                    <Cloud size={14} className="text-blue-300 fill-blue-300/20" />
                    <span className="text-[10px] font-bold text-white leading-none mt-0.5">72°</span>
                </ComplicationStandard>
            );
        case 'date':
            return (
                <ComplicationStandard>
                    <span className="text-[8px] font-bold text-red-400 uppercase leading-none tracking-wider mb-0.5">
                        {time.toLocaleDateString([], { weekday: 'short' }).toUpperCase()}
                    </span>
                    <span className="text-sm font-bold text-white leading-none">
                        {time.getDate()}
                    </span>
                </ComplicationStandard>
            );
        default:
            return null;
    }
  };

  const renderSingleComplication = (type: ComplicationType, position: 'top' | 'bottom' | 'left' | 'right') => {
      if (type === 'none') return null;

      let posClasses = '';
      
      if (platform === Platform.APPLE_WATCH) {
         // Rectangular Layout Adjustments
         if (position === 'top') posClasses = 'top-3 left-1/2 -translate-x-1/2';
         if (position === 'bottom') posClasses = 'bottom-3 left-1/2 -translate-x-1/2';
         if (position === 'left') posClasses = 'left-3 top-1/2 -translate-y-1/2';
         if (position === 'right') posClasses = 'right-3 top-1/2 -translate-y-1/2';
      } else {
         // Circular Layout Adjustments
         if (position === 'top') posClasses = 'top-[15%] left-1/2 -translate-x-1/2';
         if (position === 'bottom') posClasses = 'bottom-[15%] left-1/2 -translate-x-1/2';
         if (position === 'left') posClasses = 'left-[15%] top-1/2 -translate-y-1/2';
         if (position === 'right') posClasses = 'right-[15%] top-1/2 -translate-y-1/2';
      }

      return (
          <div className={`absolute ${posClasses} z-20 transition-all duration-300 hover:scale-110 cursor-pointer`}>
              {renderComplicationContent(type)}
          </div>
      );
  };

  return (
    <div className="relative flex flex-col items-center justify-center p-8">
      {/* Watch Casing */}
      <div className={`relative bg-neutral-800 p-3 shadow-2xl ring-1 ring-white/10 ${caseClasses} w-full max-w-[340px] transition-all duration-300 group`}>
        
        {/* Screen/Display Area */}
        <div className={`relative w-full h-full overflow-hidden bg-black ${screenClasses} ring-4 ring-black shadow-inner`}>
          
          {/* Background Image */}
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Watch Face" 
              className={`w-full h-full object-cover transition-all duration-700 ${isLoading ? 'opacity-50 blur-sm scale-105' : 'opacity-100 scale-100'}`}
            />
          ) : (
            <div className="w-full h-full bg-neutral-900 flex items-center justify-center text-neutral-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
                <div className="text-center z-10">
                    <span className="text-sm font-medium tracking-wide opacity-50 block mb-1">FACEGEN AI</span>
                    <span className="text-xs opacity-30">No Design Loaded</span>
                </div>
            </div>
          )}

          {/* Overlays */}
          {!isLoading && (
             <>
               {renderSingleComplication(complications.top, 'top')}
               {renderSingleComplication(complications.bottom, 'bottom')}
               {renderSingleComplication(complications.left, 'left')}
               {renderSingleComplication(complications.right, 'right')}
               
               {renderDigitalTime()}
               {renderAnalogHands()}
             </>
          )}

          {/* Loading Spinner Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-20">
               <div className="flex flex-col items-center gap-3">
                 <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                 <span className="text-xs font-bold text-primary animate-pulse tracking-widest">GENERATING</span>
               </div>
            </div>
          )}

        </div>

        {/* Gloss/Reflection Effect - More realistic curved glass look */}
        <div className={`absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-transparent pointer-events-none z-40 ${screenClasses}`}></div>
        <div className={`absolute top-0 right-0 w-2/3 h-1/3 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none z-40 rounded-tr-[2.8rem] opacity-50`}></div>

      </div>

      {/* Strap Hint - slightly better styling */}
      <div className="absolute -z-10 w-44 h-[120%] bg-gradient-to-b from-neutral-800 to-neutral-900 rounded-full blur-xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
      
      {/* Platform Label */}
      <div className="absolute -bottom-12 text-[10px] font-bold text-neutral-600 uppercase tracking-[0.2em] flex items-center gap-2 bg-neutral-900/50 px-4 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
        {platform === Platform.APPLE_WATCH ? "Apple Watch Preview" : "Wear OS Preview"}
      </div>
    </div>
  );
};

export default WatchPreview;