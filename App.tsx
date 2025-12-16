import React, { useState, useCallback, useEffect } from 'react';
import { 
  Watch, Sparkles, Download, Palette, Settings, 
  CreditCard, Menu, X, LayoutGrid, Zap, CheckCircle, 
  Loader2, Share2, Crown, AlertCircle, Lock, Wand2,
  Dice5, Clock, Layers, FileCode, Save, Calendar
} from './components/Icons';
import WatchPreview from './components/WatchPreview';
import Store from './components/Store';
import { generateWatchFaceImage, enhancePrompt, generateRandomPrompt, suggestFaceConfig, GenerationError } from './services/geminiService';
import { WatchStyle, GeneratedFace, Platform, User, PricingPlan, WatchHandStyle, ComplicationLayout, FaceConfiguration } from './types';

// --- Static Data: Preset Collections ---
const PRESET_LIBRARY: GeneratedFace[] = [
  // --- FREE STARTER COLLECTION (Every Niche Covered) ---
  { id: 'f_min_1', style: WatchStyle.MINIMAL, prompt: 'Bauhaus Monochrome', imageUrl: 'https://images.unsplash.com/photo-1495856458515-0637185db551?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_lux_1', style: WatchStyle.LUXURY, prompt: 'Classic Silver Link', imageUrl: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_cyb_1', style: WatchStyle.CYBERPUNK, prompt: 'Neon Grid Lines', imageUrl: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_fit_1', style: WatchStyle.FITNESS, prompt: 'Redline Pulse', imageUrl: 'https://images.unsplash.com/photo-1557161176-b8029757697a?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_car_1', style: WatchStyle.CARS, prompt: 'Asphalt Texture', imageUrl: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_ani_1', style: WatchStyle.ANIME, prompt: 'Pastel Sky City', imageUrl: 'https://images.unsplash.com/photo-1519882170906-097a6a43a255?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_spa_1', style: WatchStyle.SPACE, prompt: 'Deep Blue Nebula', imageUrl: 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_nat_1', style: WatchStyle.NATURE, prompt: 'Mountain Peak Fog', imageUrl: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_bus_1', style: WatchStyle.BUSINESS, prompt: 'Navy Executive', imageUrl: 'https://images.unsplash.com/photo-1434056838489-2930eb510854?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_spo_1', style: WatchStyle.SPORTS, prompt: 'Stadium Grass', imageUrl: 'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_isl_1', style: WatchStyle.ISLAMIC, prompt: 'Teal Geometric', imageUrl: 'https://images.unsplash.com/photo-1542031097-f50937c86576?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },
  { id: 'f_cul_1', style: WatchStyle.CULTURAL, prompt: 'Traditional Pattern', imageUrl: 'https://images.unsplash.com/photo-1590059390239-2a13b4c4dfc8?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: false },

  // --- PREMIUM DESIGNER COLLECTION (Slick, Modern, High-End) ---
  { id: 'p_lux_2', style: WatchStyle.LUXURY, prompt: 'Dark Ceramic Tourbillon', imageUrl: 'https://images.unsplash.com/photo-1619195325950-89196d4007f3?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'p_lux_3', style: WatchStyle.LUXURY, prompt: 'Rose Gold Mesh', imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'p_cyb_2', style: WatchStyle.CYBERPUNK, prompt: 'Glitch Data Stream', imageUrl: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'p_cyb_3', style: WatchStyle.CYBERPUNK, prompt: 'Circuit Board Macro', imageUrl: 'https://images.unsplash.com/photo-1592478411213-61535f944806?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'p_car_2', style: WatchStyle.CARS, prompt: 'Carbon Fiber Weave', imageUrl: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'p_car_3', style: WatchStyle.CARS, prompt: 'Red Supercar Vent', imageUrl: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'p_nat_2', style: WatchStyle.NATURE, prompt: 'Volcanic Black Sand', imageUrl: 'https://images.unsplash.com/photo-1506543730435-f2c1d2c87983?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'p_nat_3', style: WatchStyle.NATURE, prompt: 'Tropical Leaf Macro', imageUrl: 'https://images.unsplash.com/photo-1502977249102-1bf2219f57e3?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'p_isl_2', style: WatchStyle.ISLAMIC, prompt: 'Golden Arabesque', imageUrl: 'https://images.unsplash.com/photo-1580251703666-4155fb2721f4?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 'p_cul_2', style: WatchStyle.CULTURAL, prompt: 'Ottoman Mosaic Tile', imageUrl: 'https://images.unsplash.com/photo-1565157618999-523c14c5c290?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  
  // --- SEASONAL COLLECTION (Expanded) ---
  { id: 's_win_1', style: WatchStyle.SEASONAL, prompt: 'Frosty Winter Morning', imageUrl: 'https://images.unsplash.com/photo-1544274488-842245e3f435?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 's_aut_1', style: WatchStyle.SEASONAL, prompt: 'Golden Autumn Leaves', imageUrl: 'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 's_hal_1', style: WatchStyle.SEASONAL, prompt: 'Dark Pumpkin Texture', imageUrl: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
  { id: 's_spr_1', style: WatchStyle.SEASONAL, prompt: 'Sakura Blossom', imageUrl: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?q=80&w=1000&auto=format&fit=crop', createdAt: Date.now(), isPreset: true, isPremium: true },
];

// --- Utilities ---
const getWeeklyDropFaces = () => {
    // Determine current week number to rotate drops
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const weekNumber = Math.floor(diff / oneWeek);
    
    // Select faces based on modulo of week number to cycle through library
    const premiumFaces = PRESET_LIBRARY.filter(f => f.isPremium);
    const startIndex = (weekNumber * 3) % premiumFaces.length;
    return premiumFaces.slice(startIndex, startIndex + 3);
};

// --- Header ---
const Header: React.FC<{ 
  user: User; 
  onNavigate: (page: string) => void;
  onOpenStore: () => void;
  currentPage: string;
}> = ({ user, onNavigate, onOpenStore, currentPage }) => {
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
          className="flex items-center gap-2 cursor-pointer" 
          onClick={() => onNavigate('explore')}
        >
          <div className="bg-gradient-to-br from-primary to-blue-600 p-2 rounded-lg">
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
            {!user.isPro && <span className="text-xs text-neutral-500">credits</span>}
            <span className="ml-2 text-xs text-primary hover:underline font-medium">
              {user.isPro ? 'Manage' : 'Top up'}
            </span>
          </button>
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
        </div>
      )}
    </header>
  );
};

// --- Creator View ---
const CreateView: React.FC<{ 
  user: User; 
  onGenerate: (prompt: string, style: WatchStyle) => Promise<GeneratedFace | null>;
  onSave: (face: GeneratedFace, config: FaceConfiguration) => void;
  platform: Platform;
  setPlatform: (p: Platform) => void;
  onOpenStore: () => void;
  initialFace: GeneratedFace | null;
}> = ({ user, onGenerate, onSave, platform, setPlatform, onOpenStore, initialFace }) => {
  const [prompt, setPrompt] = useState(initialFace?.prompt || '');
  const [selectedStyle, setSelectedStyle] = useState<WatchStyle>(initialFace?.style || WatchStyle.MINIMAL);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isConfiguring, setIsConfiguring] = useState(false); // AI Config state
  const [currentResult, setCurrentResult] = useState<GeneratedFace | null>(initialFace);
  const [error, setError] = useState<{title: string, message: string} | null>(null);

  // Customization State
  const [config, setConfig] = useState<FaceConfiguration>({
    handStyle: initialFace?.config?.handStyle || WatchHandStyle.CLASSIC,
    complicationLayout: initialFace?.config?.complicationLayout || ComplicationLayout.MINIMAL,
    accentColor: initialFace?.config?.accentColor || '#10b981'
  });

  React.useEffect(() => {
    if (initialFace) {
      setCurrentResult(initialFace);
      setPrompt(initialFace.prompt);
      setSelectedStyle(initialFace.style);
      if (initialFace.config) setConfig(initialFace.config);
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
    
    // Check credits/subscription
    if (!user.isPro && user.credits <= 0) {
      onOpenStore();
      return;
    }

    setIsGenerating(true);
    setError(null);
    setCurrentResult(null); 

    try {
      const result = await onGenerate(prompt, selectedStyle);
      if (result) {
        setCurrentResult(result);
        // Reset config defaults on new generation, or maybe call AI suggest?
        setConfig({
             handStyle: WatchHandStyle.CLASSIC,
             complicationLayout: ComplicationLayout.MINIMAL,
             accentColor: '#ffffff'
        });
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
        setConfig(suggested);
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

  const handleExportWFF = () => {
    if (!currentResult) return;
    
    // Mock WFF XML Content
    const wffXml = `
<?xml version="1.0" ?>
<WatchFace width="450" height="450">
    <Metadata key="author" value="FaceGen AI User"/>
    <Metadata key="name" value="${currentResult.prompt.slice(0, 20)}"/>
    <Scene>
        <Image resource="background_image" x="0" y="0" width="450" height="450" />
        <AnalogClock>
             <HourHand resource="${config.handStyle}_hour" x="225" y="225" />
             <MinuteHand resource="${config.handStyle}_minute" x="225" y="225" />
        </AnalogClock>
        <!-- Complications Layout: ${config.complicationLayout} -->
    </Scene>
</WatchFace>
    `.trim();

    // Create blobs for download
    const xmlBlob = new Blob([wffXml], { type: 'text/xml' });
    const xmlUrl = URL.createObjectURL(xmlBlob);
    
    const xmlLink = document.createElement('a');
    xmlLink.href = xmlUrl;
    xmlLink.download = 'watchface.xml';
    document.body.appendChild(xmlLink);
    xmlLink.click();
    document.body.removeChild(xmlLink);

    // Trigger image download separately or user can do it from preview
    const link = document.createElement('a');
    link.href = currentResult.imageUrl;
    link.download = `facegen_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
             Design, Customize, and Export.
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

        {/* 2. Style & Platform */}
        <div className="grid grid-cols-2 gap-4">
           <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Style</label>
              <select 
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as WatchStyle)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
              >
                 {Object.values(WatchStyle).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
           </div>
           <div className="space-y-2">
              <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">Device</label>
              <div className="flex bg-neutral-900 p-1 rounded-lg border border-neutral-800">
                <button 
                  onClick={() => setPlatform(Platform.WEAR_OS)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${platform === Platform.WEAR_OS ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                >
                  Wear OS
                </button>
                <button 
                  onClick={() => setPlatform(Platform.APPLE_WATCH)}
                  className={`flex-1 py-1.5 rounded-md text-xs font-medium transition-all ${platform === Platform.APPLE_WATCH ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}
                >
                  Apple Watch
                </button>
              </div>
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
              <Sparkles size={18} /> Generate Background
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

              {/* Complications */}
              <div className="space-y-2">
                 <label className="text-xs font-semibold text-neutral-400 uppercase">Complications</label>
                 <select
                    value={config.complicationLayout}
                    onChange={(e) => setConfig({...config, complicationLayout: e.target.value as ComplicationLayout})}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                 >
                    {Object.values(ComplicationLayout).map(l => <option key={l} value={l}>{l}</option>)}
                 </select>
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
           
           <WatchPreview 
             imageUrl={currentResult?.imageUrl || null} 
             platform={platform} 
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
                    onClick={handleExportWFF}
                    className="py-3 bg-white text-black font-bold rounded-xl text-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FileCode size={16} /> Export WFF
                  </button>
               </div>
               
               <p className="text-xs text-neutral-500">
                  Export includes <code>watchface.xml</code> and background image. Compatible with Android Studio & Galaxy Watch Studio.
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
                  <span className="bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">New This Week</span>
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
  const [currentPage, setCurrentPage] = useState('explore'); // Default to Explore to show off content
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [user, setUser] = useState<User>({
    credits: 3, 
    isPro: false,
    library: []
  });
  const [platform, setPlatform] = useState<Platform>(Platform.WEAR_OS);
  const [selectedFace, setSelectedFace] = useState<GeneratedFace | null>(null);

  // Gemini Integration
  const handleGenerate = useCallback(async (prompt: string, style: WatchStyle): Promise<GeneratedFace | null> => {
    try {
      if (!user.isPro) {
         setUser(prev => ({ ...prev, credits: prev.credits - 1 }));
      }

      const face = await generateWatchFaceImage(prompt, style);
      
      // Auto-add to library
      setUser(prev => ({
        ...prev,
        library: [face, ...prev.library]
      }));
      
      return face;
    } catch (error) {
      if (!user.isPro) {
        setUser(prev => ({ ...prev, credits: prev.credits + 1 }));
      }
      throw error;
    }
  }, [user.isPro]);

  const handleSaveFace = (face: GeneratedFace, config: FaceConfiguration) => {
     // Update face with new config and ensure it's in library
     const updatedFace = { ...face, config };
     setUser(prev => {
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
    console.log("Initiating Native Purchase Flow for:", plan.id);
    setTimeout(() => {
      setIsStoreOpen(false);
      if (plan.type === 'subscription') {
        setUser(prev => ({ ...prev, isPro: true }));
        alert("Subscription Active! You now have unlimited access.");
      } else {
        setUser(prev => ({ ...prev, credits: prev.credits + (plan.credits || 0) }));
        alert(`Successfully added ${plan.credits} credits!`);
      }
    }, 1000);
  };

  const handleManageSubscription = () => {
    alert("This would open the Google Play Subscription Management screen.");
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header 
        user={user} 
        currentPage={currentPage} 
        onNavigate={(page) => {
          setCurrentPage(page);
          if (page === 'create') setSelectedFace(null);
        }} 
        onOpenStore={() => setIsStoreOpen(true)}
      />

      <main className="flex-grow">
        {currentPage === 'create' && (
          <CreateView 
            user={user} 
            onGenerate={handleGenerate} 
            onSave={handleSaveFace}
            platform={platform}
            setPlatform={setPlatform}
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