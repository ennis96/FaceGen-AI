export enum WatchStyle {
  MINIMAL = 'Minimal / Clean',
  LUXURY = 'Luxury / Gold',
  CYBERPUNK = 'Cyberpunk / Neon',
  FITNESS = 'Fitness / Gym',
  CARS = 'Cars / Supercars',
  ANIME = 'Anime / Manga',
  SPACE = 'Space / Sci-Fi',
  NATURE = 'Nature / Landscapes',
  BUSINESS = 'Business / Executive',
  SPORTS = 'Football / Sports',
  ISLAMIC = 'Islamic Geometric',
  CULTURAL = 'Turkish Motifs',
  SEASONAL = 'Seasonal / Limited'
}

export enum Platform {
  WEAR_OS = 'Wear OS',
  APPLE_WATCH = 'Apple Watch'
}

export enum WatchHandStyle {
  CLASSIC = 'Classic',
  SPORT = 'Sport',
  MINIMAL = 'Minimal',
  BLOCKY = 'Blocky',
  DIGITAL = 'Digital Only'
}

export enum ComplicationLayout {
  NONE = 'None',
  MINIMAL = 'Minimal (Date)',
  ACTIVITY = 'Activity (Steps/HR)',
  FULL = 'Full Dashboard'
}

export interface FaceConfiguration {
  handStyle: WatchHandStyle;
  complicationLayout: ComplicationLayout;
  accentColor: string;
}

export interface GeneratedFace {
  id: string;
  imageUrl: string;
  prompt: string;
  style: WatchStyle;
  createdAt: number;
  isPremium?: boolean; // True if it requires subscription to use
  isPreset?: boolean;  // True if it's a pre-made face, not AI generated
  config?: FaceConfiguration; // Saved configuration
}

export interface User {
  credits: number;
  isPro: boolean;
  library: GeneratedFace[];
}

export interface GenerationRequest {
  prompt: string;
  style: WatchStyle;
}

export interface PricingPlan {
  id: string;
  type: 'subscription' | 'credit_pack';
  name: string;
  price: string;
  description: string;
  features: string[];
  credits?: number;
  popular?: boolean;
}