import React, { useState, useCallback, useEffect } from 'react';
import { 
  Watch, Sparkles, Download, Palette, Settings, 
  CreditCard, Menu, X, LayoutGrid, Zap, CheckCircle, 
  Loader2, Share2, Crown, AlertCircle, Lock, Wand2,
  Dice5, Clock, Layers, FileCode, Save, Calendar, Star,
  LogOut, User as UserIcon, Smartphone, Search,
  ArrowRight, Check, Battery, Cloud, Heart, Footprints
} from './components/Icons';
import WatchPreview from './components/WatchPreview';
import Store from './components/Store';
import Auth from './components/Auth';
import { generateWatchFaceImage, enhancePrompt, generateRandomPrompt, suggestFaceConfig, GenerationError } from './services/geminiService';
import { WatchStyle, GeneratedFace, Platform, User, PricingPlan, WatchHandStyle, ComplicationType, FaceConfiguration, SUPPORTED_DEVICES, DeviceDefinition, WatchShape } from './types';

// --- Static Data: Preset Collections ---
const PRESET_LIBRARY: GeneratedFace[] = [
  // --- FREE STARTER COLLECTION ---
  { id: 'f_min_1', style: WatchStyle.MINIMAL, prompt: 'Bauhaus White Clean', imageUrl: 'https://images.unsplash.com/photo-1495856458515-0637185db551?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_nat_1', style: WatchStyle.NATURE, prompt: 'Misty Pine Forest', imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_car_1', style: WatchStyle.CARS, prompt: 'Speedometer Macro', imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_fit_1', style: WatchStyle.FITNESS, prompt: 'Red Energy Abstract', imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_spa_1', style: WatchStyle.SPACE, prompt: 'Orbiting Planet', imageUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_ani_1', style: WatchStyle.ANIME, prompt: 'Cyber City Anime', imageUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_spo_1', style: WatchStyle.SPORTS, prompt: 'Stadium Lights', imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_bus_1', style: WatchStyle.BUSINESS, prompt: 'Executive Leather', imageUrl: 'https://images.unsplash.com/photo-1491336477066-31156b5e4f35?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_cyb_1', style: WatchStyle.CYBERPUNK, prompt: 'Neon Grid Lines', imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },

  // --- PREMIUM DESIGNER COLLECTION ---
  { id: 'p_lux_1', style: WatchStyle.LUXURY, prompt: 'Gold Mechanism', imageUrl: 'https://images.unsplash.com/photo-1614726365723-49cfae96a6f6?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'p_nat_1', style: WatchStyle.NATURE, prompt: 'Volcanic Texture', imageUrl: 'https://images.unsplash.com/photo-1506543730435-f2c1d2c87983?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  
  // --- RELIGIOUS & CULTURAL COLLECTION (GLOBAL) ---
  // ISLAM
  { id: 'rel_isl_1', style: WatchStyle.ISLAMIC, prompt: 'Golden Mosque Dome', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'rel_isl_2', style: WatchStyle.ISLAMIC, prompt: 'Ramadan Lanterns', imageUrl: 'https://images.unsplash.com/photo-1587573088697-b4480442355e?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'rel_isl_3', style: WatchStyle.ISLAMIC, prompt: 'Blue Tile Patterns', imageUrl: 'https://images.unsplash.com/photo-1580251703666-4155fb2721f4?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },

  // CHRISTIANITY
  { id: 'rel_chr_1', style: WatchStyle.RELIGIOUS, prompt: 'Stained Glass Art', imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'rel_chr_2', style: WatchStyle.RELIGIOUS, prompt: 'Christmas Candles', imageUrl: 'https://images.unsplash.com/photo-1513297887119-d46091b24bfa?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  
  // HINDUISM
  { id: 'rel_hin_1', style: WatchStyle.RELIGIOUS, prompt: 'Diwali Lamps (Diyas)', imageUrl: 'https://images.unsplash.com/photo-1476362555312-ab9e108a0b7e?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'rel_hin_2', style: WatchStyle.RELIGIOUS, prompt: 'Holi Colors Abstract', imageUrl: 'https://images.unsplash.com/photo-1550948329-1393845bb084?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'rel_hin_3', style: WatchStyle.RELIGIOUS, prompt: 'Ganesh Statue Gold', imageUrl: 'https://images.unsplash.com/photo-1567591414240-e791e8e2e22c?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },

  // BUDDHISM
  { id: 'rel_bud_1', style: WatchStyle.RELIGIOUS, prompt: 'Golden Buddha Statue', imageUrl: 'https://images.unsplash.com/photo-1596720614569-826d9c6e5a62?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'rel_bud_2', style: WatchStyle.RELIGIOUS, prompt: 'Lotus Flower Pond', imageUrl: 'https://images.unsplash.com/photo-1584305813353-8d6e91fc8976?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },

  // JUDAISM
  { id: 'rel_jud_1', style: WatchStyle.RELIGIOUS, prompt: 'Hanukkah Menorah', imageUrl: 'https://images.unsplash.com/photo-1543787720-3b7c4d5d4d3d?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },

  // SIKHISM
  { id: 'rel_sik_1', style: WatchStyle.RELIGIOUS, prompt: 'Golden Temple Light', imageUrl: 'https://images.unsplash.com/photo-1570183180299-c5603b222340?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  
  // JAPANESE/SHINTO
  { id: 'rel_shin_1', style: WatchStyle.RELIGIOUS, prompt: 'Red Torii Gate', imageUrl: 'https://images.unsplash.com/photo-1528360983277-13d9b152c6d4?q=80&w=800&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
];

// --- Utilities ---
const getWeeklyDropFaces = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const weekNumber = Math.floor(diff / oneWeek);
    const premiumFaces = PRESET_LIBRARY.filter(f => f.isPremium && f.style !== WatchStyle.SEASONAL);
    const startIndex = (weekNumber * 3) % premiumFaces.length;
    const drops = [];
    for(let i=0; i<3; i++) {
        drops.push(premiumFaces[(startIndex + i) % premiumFaces.length]);
    }
    return drops;
};

// --- Header ---
const Header: React.FC<{ 
  user: User; 
  onNavigate: (page: string) => void;
  onOpenStore: () => void;
  onLogout: () => void;
  currentPage: string;
}> = ({ user, onNavigate, onOpenStore, onLogout, currentPage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'explore', label: 'Explore', icon: <LayoutGrid size={18} /> },
    { id: 'create', label: 'AI Studio', icon: <Sparkles size={18} /> },
    { id: 'library', label: 'Library', icon: <Watch size={18} /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => onNavigate('explore')}
        >
          <div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-primary/20 transition-all">
            <Watch className="text-white" size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight hidden sm:block">FaceGen AI</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentPage === item.id 
                  ? 'bg-white/10 text-white' 
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={onOpenStore}
            className="hidden sm:flex items-center gap-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-full hover:bg-neutral-800 transition-colors group"
          >
            {user.isPro ? (
              <Crown size={14} className="text-amber-400 fill-amber-400" />
            ) : (
              <Zap size={14} className="text-amber-400 group-hover:fill-amber-400" />
            )}
            <span className="text-xs font-bold text-white">{user.isPro ? 'PRO' : user.credits}</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 border-l border-white/10 pl-4">
            <div className="w-8 h-8 rounded-full bg-neutral-800 flex items-center justify-center text-xs font-bold text-neutral-400">
               {user.name.charAt(0)}
            </div>
            <button onClick={onLogout} className="text-neutral-500 hover:text-white transition-colors">
               <LogOut size={18} />
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-surface p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium ${
                currentPage === item.id 
                  ? 'bg-primary/20 text-primary' 
                  : 'text-neutral-400 hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
          <button 
             onClick={() => {
                onOpenStore();
                setMobileMenuOpen(false);
             }}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-amber-400 hover:bg-white/5"
          >
             <Zap size={18} />
             Store & Credits
          </button>
          <button 
             onClick={onLogout}
             className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-white/5"
          >
             <LogOut size={18} />
             Log Out
          </button>
        </div>
      )}
    </header>
  );
};

// --- Creator View ---
const CreateView: React.FC<{ 
  user: User; 
  onGenerate: (prompt: string, style: WatchStyle, device: DeviceDefinition) => Promise<GeneratedFace | null>;
  onSave: (face: GeneratedFace, config: FaceConfiguration) => void;
  selectedDevice: DeviceDefinition;
  setSelectedDevice: (d: DeviceDefinition) => void;
  onOpenStore: () => void;
  initialFace: GeneratedFace | null;
}> = ({ user, onGenerate, onSave, selectedDevice, setSelectedDevice, onOpenStore, initialFace }) => {
  const [prompt, setPrompt] = useState(initialFace?.prompt || '');
  const [selectedStyle, setSelectedStyle] = useState<WatchStyle>(initialFace?.style || WatchStyle.MINIMAL);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false); 
  const [currentResult, setCurrentResult] = useState<GeneratedFace | null>(initialFace);
  const [error, setError] = useState<{title: string, message: string} | null>(null);
  const [deviceSearch, setDeviceSearch] = useState('');
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);

  // Filter devices logic
  const filteredDevices = SUPPORTED_DEVICES.filter(d => 
     d.name.toLowerCase().includes(deviceSearch.toLowerCase()) || 
     d.brand.toLowerCase().includes(deviceSearch.toLowerCase())
  );

  // Customization State
  const [config, setConfig] = useState<FaceConfiguration>({
    handStyle: initialFace?.config?.handStyle || WatchHandStyle.CLASSIC,
    complications: initialFace?.config?.complications || { top: 'none', bottom: 'none', left: 'none', right: 'none' },
    accentColor: initialFace?.config?.accentColor || '#10b981'
  });

  React.useEffect(() => {
    if (initialFace) {
      setCurrentResult(initialFace);
      setPrompt(initialFace.prompt);
      setSelectedStyle(initialFace.style);
      if (initialFace.config) setConfig(initialFace.config);
      if (initialFace.targetDevice) setSelectedDevice(initialFace.targetDevice);
    }
  }, [initialFace]);

  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt);
      setPrompt(enhanced);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleInspireMe = async () => {
    setIsEnhancing(true);
    try {
      const randomPrompt = await generateRandomPrompt(selectedStyle);
      setPrompt(randomPrompt);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Check credits/subscription with STRICT logic
    if (!user.isPro && user.credits <= 0) {
      // Force store open if out of credits
      onOpenStore();
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentResult(null); 

    try {
      // Pass the specific device model here
      const result = await onGenerate(prompt, selectedStyle, selectedDevice);
      if (result) {
        setCurrentResult(result);
        // Reset defaults
        setConfig(prev => ({
             ...prev,
             handStyle: WatchHandStyle.CLASSIC,
        }));
      }
    } catch (e: any) {
      let title = "Generation Failed";
      let message = "An unexpected error occurred.";
      if (e instanceof GenerationError) {
        title = e.title;
        message = e.message;
      } else if (e.message) {
         message = e.message;
      }
      setError({ title, message });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAISuggestConfig = async () => {
    if (!currentResult) return;
    setIsConfiguring(true);
    try {
        const suggested = await suggestFaceConfig(currentResult.prompt, currentResult.style);
        // Map simple suggest response to new granular response if needed, for now just partial update
        setConfig(prev => ({
            ...prev,
            handStyle: suggested.handStyle,
            accentColor: suggested.accentColor
        }));
    } catch(e) {
        console.error(e);
    } finally {
        setIsConfiguring(false);
    }
  };

  const handleSaveToLibrary = () => {
      if (currentResult) {
          onSave(currentResult, config);
          alert("Face saved to your library!");
      }
  };

  const complicationTypes: {type: ComplicationType, label: string, icon: React.ReactNode}[] = [
      { type: 'none', label: 'None', icon: <X size={12} /> },
      { type: 'date', label: 'Date', icon: <Calendar size={12} /> },
      { type: 'weather', label: 'Weather', icon: <Cloud size={12} /> },
      { type: 'battery', label: 'Battery', icon: <Battery size={12} /> },
      { type: 'steps', label: 'Steps', icon: <Footprints size={12} /> },
      { type: 'heartrate', label: 'Heart', icon: <Heart size={12} /> },
  ];

  const updateComplication = (slot: keyof typeof config.complications, type: ComplicationType) => {
      setConfig(prev => ({
          ...prev,
          complications: {
              ...prev.complications,
              [slot]: type
          }
      }));
  };

  return (
    <div className="container mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
      {/* Controls */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            {currentResult?.isPreset ? 'Customize Preset' : 'AI Studio'}
          </h1>
          <p className="text-neutral-400">
             Design specific faces for your {selectedDevice.name}.
          </p>
        </div>

        {/* 1. Prompt Section */}
        <div className="space-y-3 relative">
          <div className="flex justify-between items-center">
             <label className="text-sm font-semibold text-neutral-300">Prompt</label>
             <div className="flex gap-2">
                <button 
                  onClick={handleInspireMe}
                  disabled={isEnhancing}
                  className="text-xs flex items-center gap-1 text-accent hover:text-amber-300 disabled:opacity-50 transition-colors"
                >
                   {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Dice5 size={12} />}
                   Inspire Me
                </button>
                <div className="w-px h-3 bg-white/20 self-center"></div>
                <button 
                  onClick={handleEnhance}
                  disabled={isEnhancing || !prompt}
                  className="text-xs flex items-center gap-1 text-primary hover:text-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isEnhancing ? <Loader2 size={12} className="animate-spin" /> : <Wand2 size={12} />}
                    Magic Enhance
                </button>
             </div>
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe your vision..."
            className="w-full h-24 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white placeholder-neutral-600 focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-all"
          />
        </div>

        {/* 2. Device & Style Selection */}
        <div className="grid grid-cols-1 gap-4">
           
           {/* Robust Device Selector */}
           <div className="space-y-2 relative">
             <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Target Watch Model</label>
             <div className="relative">
                <button 
                  onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
                  className="w-full flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm text-white hover:border-neutral-700 transition-colors"
                >
                   <span className="flex items-center gap-2">
                      <Smartphone size={16} className="text-neutral-500" />
                      {selectedDevice.name}
                   </span>
                   <ArrowRight size={14} className="rotate-90 text-neutral-600" />
                </button>

                {showDeviceDropdown && (
                   <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                      <div className="sticky top-0 bg-neutral-900 p-2 border-b border-neutral-800">
                         <div className="flex items-center gap-2 bg-neutral-800 rounded-lg px-2 py-1.5">
                            <Search size={14} className="text-neutral-500" />
                            <input 
                              autoFocus
                              className="bg-transparent text-xs text-white placeholder-neutral-500 focus:outline-none w-full"
                              placeholder="Search Apple, Samsung, Pixel..."
                              value={deviceSearch}
                              onChange={(e) => setDeviceSearch(e.target.value)}
                            />
                         </div>
                      </div>
                      {filteredDevices.map(device => (
                         <button
                           key={device.id}
                           onClick={() => {
                             setSelectedDevice(device);
                             setShowDeviceDropdown(false);
                             setDeviceSearch('');
                           }}
                           className="w-full text-left px-4 py-2 text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white flex justify-between items-center"
                         >
                            {device.name}
                            {selectedDevice.id === device.id && <Check size={14} className="text-primary" />}
                         </button>
                      ))}
                   </div>
                )}
             </div>
           </div>

           <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Art Style</label>
              <select 
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as WatchStyle)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-primary"
              >
                 {Object.values(WatchStyle).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
           </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className="w-full bg-primary hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} /> Generate for {selectedDevice.brand}
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={20} />
            <div className="flex-1">
              <h3 className="text-red-400 font-semibold text-sm mb-1">{error.title}</h3>
              <p className="text-red-300/80 text-xs leading-relaxed">{error.message}</p>
            </div>
            <button onClick={() => setError(null)} className="text-red-400/50 hover:text-red-400 transition-colors">
              <X size={18} />
            </button>
          </div>
        )}

        <hr className="border-white/5 my-6" />

        {/* 3. Customization Panel */}
        {currentResult && (
           <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center">
                 <h2 className="text-lg font-bold text-white flex items-center gap-2"><Settings size={18}/> Customization</h2>
                 <button 
                   onClick={handleAISuggestConfig}
                   disabled={isConfiguring}
                   className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-purple-500/30 transition-colors"
                 >
                    {isConfiguring ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>}
                    AI Suggest Config
                 </button>
              </div>

              {/* Hand Style Grid */}
              <div className="space-y-2">
                 <label className="text-xs font-semibold text-neutral-400 uppercase">Watch Hands</label>
                 <div className="grid grid-cols-3 gap-2">
                    {Object.values(WatchHandStyle).map((style) => (
                       <button
                         key={style}
                         onClick={() => setConfig({...config, handStyle: style})}
                         className={`py-2 px-1 text-xs rounded-lg border transition-all ${config.handStyle === style ? 'bg-white text-black border-white' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600'}`}
                       >
                          {style}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Advanced Complications Editor */}
              <div className="space-y-2">
                 <label className="text-xs font-semibold text-neutral-400 uppercase">Complication Slots</label>
                 <div className="grid grid-cols-2 gap-4">
                    {/* Top Slot */}
                    <div className="space-y-1">
                        <span className="text-[10px] text-neutral-500 uppercase">Top</span>
                        <select 
                            value={config.complications.top}
                            onChange={(e) => updateComplication('top', e.target.value as ComplicationType)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                        >
                            {complicationTypes.map(c => <option key={c.type} value={c.type}>{c.label}</option>)}
                        </select>
                    </div>
                     {/* Bottom Slot */}
                    <div className="space-y-1">
                        <span className="text-[10px] text-neutral-500 uppercase">Bottom</span>
                        <select 
                            value={config.complications.bottom}
                            onChange={(e) => updateComplication('bottom', e.target.value as ComplicationType)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                        >
                            {complicationTypes.map(c => <option key={c.type} value={c.type}>{c.label}</option>)}
                        </select>
                    </div>
                     {/* Left Slot */}
                     <div className="space-y-1">
                        <span className="text-[10px] text-neutral-500 uppercase">Left</span>
                        <select 
                            value={config.complications.left}
                            onChange={(e) => updateComplication('left', e.target.value as ComplicationType)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                        >
                            {complicationTypes.map(c => <option key={c.type} value={c.type}>{c.label}</option>)}
                        </select>
                    </div>
                     {/* Right Slot */}
                     <div className="space-y-1">
                        <span className="text-[10px] text-neutral-500 uppercase">Right</span>
                        <select 
                            value={config.complications.right}
                            onChange={(e) => updateComplication('right', e.target.value as ComplicationType)}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-xs text-white"
                        >
                            {complicationTypes.map(c => <option key={c.type} value={c.type}>{c.label}</option>)}
                        </select>
                    </div>
                 </div>
              </div>
              
              {/* Accent Color */}
              <div className="space-y-2">
                 <label className="text-xs font-semibold text-neutral-400 uppercase">Accent Color</label>
                 <div className="flex items-center gap-3">
                    <input 
                      type="color" 
                      value={config.accentColor}
                      onChange={(e) => setConfig({...config, accentColor: e.target.value})}
                      className="bg-transparent w-8 h-8 rounded-full overflow-hidden border-0 cursor-pointer"
                    />
                    <span className="text-sm font-mono text-neutral-500">{config.accentColor}</span>
                 </div>
              </div>
           </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="bg-surface border border-white/5 rounded-3xl p-8 w-full flex flex-col items-center justify-center min-h-[500px] relative">
           
           {/* Pass selectedDevice to preview instead of just platform */}
           <WatchPreview 
             imageUrl={currentResult?.imageUrl || null} 
             platform={selectedDevice.brand === 'Apple' ? Platform.APPLE_WATCH : Platform.WEAR_OS} 
             isLoading={isGenerating} 
             config={config}
           />

           {currentResult && (
             <div className="mt-8 text-center space-y-4 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
               
               <div className="grid grid-cols-2 gap-3 w-full max-w-sm mx-auto">
                  <button 
                    onClick={handleSaveToLibrary}
                    className="py-3 bg-neutral-800 text-white font-semibold rounded-xl text-sm hover:bg-neutral-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Save size={16} /> Save
                  </button>
                  <button 
                    className="py-3 bg-white text-black font-bold rounded-xl text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileCode size={16} /> Export WFF
                  </button>
               </div>
               
               <p className="text-xs text-neutral-500">
                  Optimized for <strong>{selectedDevice.name}</strong>. Export includes XML & assets.
               </p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

// --- Explore View ---
const ExploreView: React.FC<{
  onSelect: (face: GeneratedFace) => void;
  user: User;
  onOpenStore: () => void;
}> = ({ onSelect, user, onOpenStore }) => {
  
  const handleFaceClick = (face: GeneratedFace) => {
    if (face.isPremium && !user.isPro) {
      onOpenStore();
    } else {
      onSelect(face);
    }
  };

  const weeklyDrops = getWeeklyDropFaces();
  const freeFaces = PRESET_LIBRARY.filter(f => !f.isPremium);
  // Filter out weekly drops from main premium list to avoid duplicates if desired, or just show all
  const premiumFaces = PRESET_LIBRARY.filter(f => f.isPremium && f.style !== WatchStyle.SEASONAL);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      
      {/* Weekly Drops Banner */}
      <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/20 rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
              <Calendar size={120} />
          </div>
          <div className="relative z-10 mb-6">
              <div className="flex items-center gap-2 mb-2">
                  <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse">New This Week</span>
              </div>
              <h2 className="text-2xl font-bold text-white">Weekly Drops</h2>
              <p className="text-indigo-200 text-sm">Fresh premium styles curated for you every Monday.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative z-10">
              {weeklyDrops.map((face) => (
                  <div 
                  key={face.id} 
                  className="group relative aspect-square rounded-xl overflow-hidden bg-neutral-900 border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer shadow-lg"
                  onClick={() => handleFaceClick(face)}
                  >
                     <img 
                        src={face.imageUrl} 
                        alt={face.style} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                     />
                     {!user.isPro && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                           <Lock className="text-indigo-400" size={24} />
                        </div>
                     )}
                     <div className="absolute top-2 right-2">
                        <Star className="fill-amber-400 text-amber-400" size={16} />
                     </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Free Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Zap className="text-emerald-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Starter Collection (Free)</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {freeFaces.map((face) => (
            <div 
              key={face.id} 
              className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-emerald-500/50 transition-all cursor-pointer"
              onClick={() => handleFaceClick(face)}
            >
              <img 
                src={face.imageUrl} 
                alt={face.style} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-100 transition-opacity flex flex-col justify-end p-4">
                <span className="text-white font-medium text-sm truncate">{face.prompt}</span>
                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wide">Free to use</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Crown className="text-amber-400" size={24} />
          <h2 className="text-2xl font-bold text-white">Designer Collection (Premium)</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {premiumFaces.map((face) => (
            <div 
              key={face.id} 
              className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 transition-all cursor-pointer"
              onClick={() => handleFaceClick(face)}
            >
              <img 
                src={face.imageUrl} 
                alt={face.style} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {!user.isPro && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
                   <div className="bg-black/60 p-3 rounded-full border border-amber-500/50">
                     <Lock className="text-amber-400" size={24} />
                   </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4 z-20">
                <span className="text-white font-medium text-sm truncate">{face.prompt}</span>
                <div className="flex justify-between items-center">
                   <span className="text-amber-400 text-xs font-bold uppercase tracking-wide">Pro Only</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('explore'); 
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [storeMessage, setStoreMessage] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<DeviceDefinition>(SUPPORTED_DEVICES[0]);
  const [selectedFace, setSelectedFace] = useState<GeneratedFace | null>(null);

  // Gemini Integration
  const handleGenerate = useCallback(async (prompt: string, style: WatchStyle, device: DeviceDefinition): Promise<GeneratedFace | null> => {
    if (!user) return null;

    try {
      // STRICT CREDIT CHECK
      if (!user.isPro && user.credits <= 0) {
        setStoreMessage("You've run out of free credits! Upgrade to Pro for unlimited access or top up now.");
        setIsStoreOpen(true);
        return null;
      }

      // Deduct credit optimistically (restore on fail)
      if (!user.isPro) {
         setUser(prev => prev ? ({ ...prev, credits: prev.credits - 1 }) : null);
      }

      const face = await generateWatchFaceImage(prompt, style, device);
      
      // Auto-add to library
      setUser(prev => prev ? ({
        ...prev,
        library: [face, ...prev.library]
      }) : null);
      
      return face;
    } catch (error) {
      if (!user?.isPro) {
        setUser(prev => prev ? ({ ...prev, credits: prev.credits + 1 }) : null);
      }
      throw error;
    }
  }, [user]);

  const handleSaveFace = (face: GeneratedFace, config: FaceConfiguration) => {
     // Update face with new config and ensure it's in library
     const updatedFace = { ...face, config };
     setUser(prev => {
         if (!prev) return null;
         const exists = prev.library.find(f => f.id === face.id);
         if (exists) {
             return {
                 ...prev,
                 library: prev.library.map(f => f.id === face.id ? updatedFace : f)
             };
         } else {
             return { ...prev, library: [updatedFace, ...prev.library] };
         }
     });
  };

  const handlePurchase = (plan: PricingPlan) => {
    // This function is called AFTER the "Mock" payment is processed successfully in Store.tsx
    if (plan.type === 'subscription') {
      setUser(prev => prev ? ({ ...prev, isPro: true }) : null);
      alert("Subscription Active! You now have unlimited access.");
    } else {
      setUser(prev => prev ? ({ ...prev, credits: prev.credits + (plan.credits || 0) }) : null);
      alert(`Successfully added ${plan.credits} credits!`);
    }
    setIsStoreOpen(false);
    setStoreMessage(null);
  };

  const handleManageSubscription = () => {
    alert("This would open the Google Play Subscription Management screen.");
  };

  // If not logged in, show Auth
  if (!user) {
    return <Auth onLogin={(u) => setUser(u)} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header 
        user={user} 
        currentPage={currentPage} 
        onNavigate={(page) => {
          setCurrentPage(page);
          if (page === 'create') setSelectedFace(null);
        }} 
        onOpenStore={() => {
            setStoreMessage(null);
            setIsStoreOpen(true);
        }}
        onLogout={() => setUser(null)}
      />

      <main className="flex-grow">
        {currentPage === 'create' && (
          <CreateView 
            user={user} 
            onGenerate={handleGenerate} 
            onSave={handleSaveFace}
            selectedDevice={selectedDevice}
            setSelectedDevice={setSelectedDevice}
            onOpenStore={() => setIsStoreOpen(true)}
            initialFace={selectedFace}
          />
        )}
        {currentPage === 'explore' && (
          <ExploreView 
            user={user}
            onSelect={(face) => {
              setSelectedFace(face);
              setCurrentPage('create');
            }} 
            onOpenStore={() => setIsStoreOpen(true)}
          />
        )}
        {currentPage === 'library' && (
           <div className="container mx-auto px-4 py-20">
             <h2 className="text-2xl font-bold text-white mb-6 text-center">Your Library</h2>
             {user.library.length === 0 ? (
               <div className="flex flex-col items-center text-neutral-500">
                 <Watch size={48} className="mb-4 opacity-50" />
                 <p>You haven't generated any faces yet.</p>
                 <button onClick={() => setCurrentPage('create')} className="mt-4 text-primary hover:underline">
                   Create one now
                 </button>
               </div>
             ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {user.library.map(face => (
                    <div 
                        key={face.id} 
                        className="aspect-square bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 group relative cursor-pointer hover:border-white/20 transition-all"
                        onClick={() => {
                            setSelectedFace(face);
                            setCurrentPage('create');
                        }}
                    >
                      <img src={face.imageUrl} alt="Saved Face" className="w-full h-full object-cover" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black to-transparent">
                         <p className="text-xs text-white truncate font-medium">{face.prompt}</p>
                         <p className="text-[10px] text-neutral-400">{new Date(face.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
             )}
           </div>
        )}
      </main>
      
      {isStoreOpen && (
        <Store 
          user={user} 
          message={storeMessage}
          onClose={() => setIsStoreOpen(false)} 
          onPurchase={handlePurchase}
          onManageSubscription={handleManageSubscription}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 bg-surface py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-sm">
          <p>&copy; 2024 FaceGen AI. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Privacy Policy</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}