import React, { useState, useCallback } from 'react';
import { 
  Watch, Sparkles, Download, Palette, Settings, 
  CreditCard, Menu, X, LayoutGrid, Zap, CheckCircle, 
  Loader2, Share2, Crown, AlertCircle 
} from './components/Icons';
import WatchPreview from './components/WatchPreview';
import Store from './components/Store';
import { generateWatchFaceImage, GenerationError } from './services/geminiService';
import { WatchStyle, GeneratedFace, Platform, User, PricingPlan } from './types';

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
    { id: 'create', label: 'Create', icon: <Sparkles size={18} /> },
    { id: 'library', label: 'My Library', icon: <Watch size={18} /> },
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
          <span className="font-bold text-xl tracking-tight hidden sm:block">ChronoGen</span>
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
  platform: Platform;
  setPlatform: (p: Platform) => void;
  onOpenStore: () => void;
}> = ({ user, onGenerate, platform, setPlatform, onOpenStore }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<WatchStyle>(WatchStyle.MINIMAL);
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentResult, setCurrentResult] = useState<GeneratedFace | null>(null);
  const [error, setError] = useState<{title: string, message: string} | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    // Check credits/subscription
    if (!user.isPro && user.credits <= 0) {
      onOpenStore();
      return;
    }

    setIsGenerating(true);
    setError(null);
    try {
      const result = await onGenerate(prompt, selectedStyle);
      if (result) {
        setCurrentResult(result);
      }
    } catch (e: any) {
      // Determine error details
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

  return (
    <div className="container mx-auto px-4 py-8 grid lg:grid-cols-12 gap-8">
      {/* Controls */}
      <div className="lg:col-span-5 space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Craft your Timepiece
          </h1>
          <p className="text-neutral-400">Describe your perfect watch face and let AI build it.</p>
        </div>

        {/* Prompt Input */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-neutral-300">Prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. A futuristic neon city with rain, cyberpunk aesthetic..."
            className="w-full h-32 bg-neutral-900 border border-neutral-800 rounded-2xl p-4 text-white placeholder-neutral-600 focus:ring-2 focus:ring-primary focus:outline-none resize-none transition-all"
          />
        </div>

        {/* Style Selector */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-neutral-300">Style</label>
          <div className="flex flex-wrap gap-2">
            {Object.values(WatchStyle).map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  selectedStyle === style 
                    ? 'bg-white text-black border-white' 
                    : 'bg-transparent text-neutral-400 border-neutral-800 hover:border-neutral-600'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Toggle */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-neutral-300">Target Device</label>
          <div className="flex bg-neutral-900 p-1 rounded-xl w-fit border border-neutral-800">
            <button 
              onClick={() => setPlatform(Platform.WEAR_OS)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${platform === Platform.WEAR_OS ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}
            >
              Wear OS
            </button>
            <button 
              onClick={() => setPlatform(Platform.APPLE_WATCH)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${platform === Platform.APPLE_WATCH ? 'bg-neutral-800 text-white shadow-sm' : 'text-neutral-500 hover:text-white'}`}
            >
              Apple Watch
            </button>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            {platform === Platform.APPLE_WATCH 
              ? "Generates a background for the 'Photos' face + Complications." 
              : "Generates a complete Watch Face Format package."}
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt}
          className="w-full bg-primary hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" /> Generating...
            </>
          ) : (
            <>
              <Sparkles size={20} /> Generate Design
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
            <button 
              onClick={() => setError(null)}
              className="text-red-400/50 hover:text-red-400 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Preview Area */}
      <div className="lg:col-span-7 flex flex-col items-center">
        <div className="bg-surface border border-white/5 rounded-3xl p-8 w-full flex flex-col items-center justify-center min-h-[500px] relative">
           <div className="absolute top-4 right-4 flex gap-2">
              {currentResult && (
                 <>
                  <button className="p-2 bg-neutral-800 rounded-full text-white hover:bg-neutral-700 transition-colors" title="Download Image">
                     <Download size={18} />
                  </button>
                 </>
              )}
           </div>
           
           <WatchPreview 
             imageUrl={currentResult?.imageUrl || null} 
             platform={platform} 
             isLoading={isGenerating} 
           />

           {currentResult && (
             <div className="mt-8 text-center space-y-4 max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div>
                  <h3 className="text-lg font-semibold text-white">Result Ready</h3>
                  <p className="text-sm text-neutral-400">
                    {platform === Platform.APPLE_WATCH 
                      ? "1. Save image to Photos.\n2. On Watch, Create 'Photos' Face.\n3. Add ChronoGen Complications."
                      : "Download the WFF package or send to watch."}
                  </p>
               </div>
               
               <div className="flex gap-3 justify-center">
                  <button className="px-6 py-2 bg-white text-black font-bold rounded-full text-sm hover:bg-neutral-200 transition-colors">
                    {platform === Platform.APPLE_WATCH ? "Download Background" : "Install Face"}
                  </button>
                  <button className="px-6 py-2 border border-neutral-700 text-white font-medium rounded-full text-sm hover:bg-neutral-800 transition-colors">
                    Edit Details
                  </button>
               </div>
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
}> = ({ onSelect }) => {
  // Mock data for display
  const mockFaces: GeneratedFace[] = Array.from({ length: 8 }).map((_, i) => ({
    id: `mock-${i}`,
    imageUrl: `https://picsum.photos/400/400?random=${i}`,
    prompt: "Sample Watch Face",
    style: i % 2 === 0 ? WatchStyle.MINIMAL : WatchStyle.LUXURY,
    createdAt: Date.now()
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Explore Collections</h1>
          <p className="text-neutral-400">Curated designs from the community and top designers.</p>
        </div>
        <div className="hidden md:flex gap-2">
           {['Trending', 'Newest', 'Top Rated'].map(filter => (
             <button key={filter} className="px-4 py-1.5 rounded-full text-xs font-medium border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-all">
               {filter}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockFaces.map((face) => (
          <div 
            key={face.id} 
            className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-primary/50 transition-all cursor-pointer"
            onClick={() => onSelect(face)}
          >
            <img 
              src={face.imageUrl} 
              alt={face.style} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <span className="text-white font-medium text-sm">{face.style}</span>
              <span className="text-neutral-400 text-xs">By ChronoCraft</span>
            </div>
            <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
               <Download size={14} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main App ---
export default function App() {
  const [currentPage, setCurrentPage] = useState('create');
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [user, setUser] = useState<User>({
    credits: 5, // Start with low credits to encourage store interaction
    isPro: false,
    library: []
  });
  const [platform, setPlatform] = useState<Platform>(Platform.WEAR_OS);

  // Gemini Integration
  const handleGenerate = useCallback(async (prompt: string, style: WatchStyle): Promise<GeneratedFace | null> => {
    try {
      if (!user.isPro) {
         // Optimistic update for credits
         setUser(prev => ({ ...prev, credits: prev.credits - 1 }));
      }

      const face = await generateWatchFaceImage(prompt, style);
      
      setUser(prev => ({
        ...prev,
        library: [face, ...prev.library]
      }));
      
      return face;
    } catch (error) {
      // Error is caught here but re-thrown to be handled by the specific view (CreateView)
      // We only handle global state reversal here
      if (!user.isPro) {
        // Revert credit if failed
        setUser(prev => ({ ...prev, credits: prev.credits + 1 }));
      }
      throw error;
    }
  }, [user.isPro]);

  const handlePurchase = (plan: PricingPlan) => {
    // In a real app, this would trigger RevenueCat/Stripe SDK
    console.log("Purchasing", plan);
    setIsStoreOpen(false);
    
    // Simulate successful purchase
    if (plan.type === 'subscription') {
      setUser(prev => ({ ...prev, isPro: true }));
      alert("Welcome to Pro! You now have unlimited generations.");
    } else {
      setUser(prev => ({ ...prev, credits: prev.credits + (plan.credits || 0) }));
      alert(`Purchase successful! Added ${plan.credits} credits.`);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header 
        user={user} 
        currentPage={currentPage} 
        onNavigate={setCurrentPage} 
        onOpenStore={() => setIsStoreOpen(true)}
      />

      <main className="flex-grow">
        {currentPage === 'create' && (
          <CreateView 
            user={user} 
            onGenerate={handleGenerate} 
            platform={platform}
            setPlatform={setPlatform}
            onOpenStore={() => setIsStoreOpen(true)}
          />
        )}
        {currentPage === 'explore' && (
          <ExploreView 
            onSelect={(face) => {
              setCurrentPage('create');
            }} 
          />
        )}
        {currentPage === 'library' && (
           <div className="container mx-auto px-4 py-20 text-center">
             <h2 className="text-2xl font-bold text-white mb-4">Your Library</h2>
             {user.library.length === 0 ? (
               <div className="flex flex-col items-center text-neutral-500">
                 <Watch size={48} className="mb-4 opacity-50" />
                 <p>You haven't generated any faces yet.</p>
                 <button onClick={() => setCurrentPage('create')} className="mt-4 text-primary hover:underline">
                   Create one now
                 </button>
               </div>
             ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {user.library.map(face => (
                    <div key={face.id} className="aspect-square bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800">
                      <img src={face.imageUrl} alt="Saved Face" className="w-full h-full object-cover" />
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
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 bg-surface py-8 mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-neutral-500 text-sm">
          <p>&copy; 2024 ChronoGen AI. All rights reserved.</p>
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