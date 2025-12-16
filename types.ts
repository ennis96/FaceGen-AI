export enum WatchStyle {
  MINIMAL = 'Minimalist',
  LUXURY = 'Luxury Analog',
  DIGITAL = 'Retro Digital',
  NATURE = 'Nature & Landscapes',
  ABSTRACT = 'Abstract Art',
  CYBERPUNK = 'Cyberpunk/Sci-Fi',
  ANIME = 'Anime/Illustration'
}

export enum Platform {
  WEAR_OS = 'Wear OS',
  APPLE_WATCH = 'Apple Watch'
}

export interface GeneratedFace {
  id: string;
  imageUrl: string;
  prompt: string;
  style: WatchStyle;
  createdAt: number;
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