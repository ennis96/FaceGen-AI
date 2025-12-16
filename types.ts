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
  SEASONAL = 'Seasonal / Limited',
  RELIGIOUS = 'Religion & Spirituality'
}

export enum WatchShape {
  CIRCLE = 'Circle',
  RECTANGLE = 'Rectangle'
}

export enum Platform {
  APPLE_WATCH = 'Apple Watch',
  WEAR_OS = 'Wear OS'
}

export interface DeviceDefinition {
  id: string;
  name: string;
  brand: string;
  shape: WatchShape;
}

export const SUPPORTED_DEVICES: DeviceDefinition[] = [
  // Apple
  { id: 'apple_ultra_2', name: 'Apple Watch Ultra 2', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_ultra_1', name: 'Apple Watch Ultra 1', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s10_46', name: 'Apple Watch Series 10 (46mm)', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s10_42', name: 'Apple Watch Series 10 (42mm)', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s9_45', name: 'Apple Watch Series 9 (45mm)', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s9_41', name: 'Apple Watch Series 9 (41mm)', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_se_2', name: 'Apple Watch SE (2nd Gen)', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s8', name: 'Apple Watch Series 8', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s7', name: 'Apple Watch Series 7', brand: 'Apple', shape: WatchShape.RECTANGLE },
  
  // Samsung
  { id: 'galaxy_ultra', name: 'Samsung Galaxy Watch Ultra', brand: 'Samsung', shape: WatchShape.CIRCLE }, 
  { id: 'galaxy_7_pro', name: 'Samsung Galaxy Watch 7 Pro', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_7', name: 'Samsung Galaxy Watch 7', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_6_classic', name: 'Samsung Galaxy Watch 6 Classic', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_6', name: 'Samsung Galaxy Watch 6', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_5_pro', name: 'Samsung Galaxy Watch 5 Pro', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_5', name: 'Samsung Galaxy Watch 5', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_4_classic', name: 'Samsung Galaxy Watch 4 Classic', brand: 'Samsung', shape: WatchShape.CIRCLE },

  // Google
  { id: 'pixel_3_45', name: 'Google Pixel Watch 3 (45mm)', brand: 'Google', shape: WatchShape.CIRCLE },
  { id: 'pixel_3_41', name: 'Google Pixel Watch 3 (41mm)', brand: 'Google', shape: WatchShape.CIRCLE },
  { id: 'pixel_2', name: 'Google Pixel Watch 2', brand: 'Google', shape: WatchShape.CIRCLE },
  { id: 'pixel_1', name: 'Google Pixel Watch 1', brand: 'Google', shape: WatchShape.CIRCLE },

  // Garmin
  { id: 'garmin_epix', name: 'Garmin Epix Gen 2', brand: 'Garmin', shape: WatchShape.CIRCLE },
  { id: 'garmin_fenix_7', name: 'Garmin Fenix 7', brand: 'Garmin', shape: WatchShape.CIRCLE },
  { id: 'garmin_venu_3', name: 'Garmin Venu 3', brand: 'Garmin', shape: WatchShape.CIRCLE },

  // Others
  { id: 'oneplus_2', name: 'OnePlus Watch 2', brand: 'OnePlus', shape: WatchShape.CIRCLE },
  { id: 'ticwatch_pro_5', name: 'TicWatch Pro 5', brand: 'Mobvoi', shape: WatchShape.CIRCLE },
  { id: 'xiaomi_s3', name: 'Xiaomi Watch S3', brand: 'Xiaomi', shape: WatchShape.CIRCLE },
];

export enum WatchHandStyle {
  CLASSIC = 'Classic',
  SPORT = 'Sport',
  MINIMAL = 'Minimal',
  BLOCKY = 'Blocky',
  DIGITAL = 'Digital Only'
}

export type ComplicationType = 'none' | 'date' | 'weather' | 'battery' | 'heartrate' | 'steps';

export interface ComplicationSlots {
    top: ComplicationType;
    bottom: ComplicationType;
    left: ComplicationType;
    right: ComplicationType;
}

export interface FaceConfiguration {
  handStyle: WatchHandStyle;
  // Replaced simple layout enum with granular slots
  complications: ComplicationSlots;
  accentColor: string;
}

// Keeping this for backward compatibility if needed, though we moved to slots
export enum ComplicationLayout {
  NONE = 'None',
  MINIMAL = 'Minimal (Date)',
  ACTIVITY = 'Activity (Steps/HR)',
  FULL = 'Full Dashboard'
}

export interface GeneratedFace {
  id: string;
  imageUrl: string;
  prompt: string;
  style: WatchStyle;
  createdAt: number;
  isPremium?: boolean; 
  isPreset?: boolean;
  config?: FaceConfiguration;
  targetDevice?: DeviceDefinition;
}

export interface User {
  id: string;
  email: string;
  name: string;
  credits: number;
  isPro: boolean;
  library: GeneratedFace[];
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