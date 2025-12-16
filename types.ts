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
  RELIGIOUS = 'Religion & Spirituality',
  ABSTRACT = 'Abstract Art',
  GRAFFITI = 'Street Art / Graffiti',
  RETRO = 'Retro 80s / Synthwave',
  PIXEL = 'Pixel Art / 8-Bit',
  STEAMPUNK = 'Steampunk / Gears',
  WATERCOLOR = 'Watercolor / Paint',
  SKETCH = 'Blueprint / Sketch'
}

export enum WatchShape {
  CIRCLE = 'Circle',
  RECTANGLE = 'Rectangle',
  SQUARE = 'Square' // Added for some older models or Fitbit
}

export enum Platform {
  APPLE_WATCH = 'Apple Watch',
  WEAR_OS = 'Wear OS',
  FITBIT = 'Fitbit / Other',
  GARMIN = 'Garmin',
  HUAWEI = 'Huawei / HarmonyOS'
}

export interface DeviceDefinition {
  id: string;
  name: string;
  brand: string;
  shape: WatchShape;
}

export const SUPPORTED_DEVICES: DeviceDefinition[] = [
  // --- APPLE ---
  { id: 'apple_ultra_2', name: 'Apple Watch Ultra 2', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_ultra_1', name: 'Apple Watch Ultra 1', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s10_46', name: 'Apple Watch Series 10 (46mm)', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s10_42', name: 'Apple Watch Series 10 (42mm)', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s9_45', name: 'Apple Watch Series 9 (45mm)', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s9_41', name: 'Apple Watch Series 9 (41mm)', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_se_2', name: 'Apple Watch SE (2nd Gen)', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s8', name: 'Apple Watch Series 8', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s7', name: 'Apple Watch Series 7', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s6', name: 'Apple Watch Series 6', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s5', name: 'Apple Watch Series 5', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s4', name: 'Apple Watch Series 4', brand: 'Apple', shape: WatchShape.RECTANGLE },
  { id: 'apple_s3', name: 'Apple Watch Series 3', brand: 'Apple', shape: WatchShape.RECTANGLE },
  
  // --- SAMSUNG ---
  { id: 'galaxy_ultra', name: 'Samsung Galaxy Watch Ultra', brand: 'Samsung', shape: WatchShape.CIRCLE }, 
  { id: 'galaxy_7_pro', name: 'Samsung Galaxy Watch 7 Pro', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_7', name: 'Samsung Galaxy Watch 7', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_6_classic', name: 'Samsung Galaxy Watch 6 Classic', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_6', name: 'Samsung Galaxy Watch 6', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_5_pro', name: 'Samsung Galaxy Watch 5 Pro', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_5', name: 'Samsung Galaxy Watch 5', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_4_classic', name: 'Samsung Galaxy Watch 4 Classic', brand: 'Samsung', shape: WatchShape.CIRCLE },
  { id: 'galaxy_active_2', name: 'Samsung Galaxy Watch Active 2', brand: 'Samsung', shape: WatchShape.CIRCLE },

  // --- GOOGLE ---
  { id: 'pixel_3_45', name: 'Google Pixel Watch 3 (45mm)', brand: 'Google', shape: WatchShape.CIRCLE },
  { id: 'pixel_3_41', name: 'Google Pixel Watch 3 (41mm)', brand: 'Google', shape: WatchShape.CIRCLE },
  { id: 'pixel_2', name: 'Google Pixel Watch 2', brand: 'Google', shape: WatchShape.CIRCLE },
  { id: 'pixel_1', name: 'Google Pixel Watch 1', brand: 'Google', shape: WatchShape.CIRCLE },

  // --- GARMIN ---
  { id: 'garmin_fenix_8', name: 'Garmin Fenix 8', brand: 'Garmin', shape: WatchShape.CIRCLE },
  { id: 'garmin_epix_pro', name: 'Garmin Epix Pro (Gen 2)', brand: 'Garmin', shape: WatchShape.CIRCLE },
  { id: 'garmin_venu_3', name: 'Garmin Venu 3 / 3S', brand: 'Garmin', shape: WatchShape.CIRCLE },
  { id: 'garmin_forerunner_965', name: 'Garmin Forerunner 965', brand: 'Garmin', shape: WatchShape.CIRCLE },
  { id: 'garmin_forerunner_265', name: 'Garmin Forerunner 265', brand: 'Garmin', shape: WatchShape.CIRCLE },
  { id: 'garmin_instinct_2', name: 'Garmin Instinct 2', brand: 'Garmin', shape: WatchShape.CIRCLE },
  { id: 'garmin_lily', name: 'Garmin Lily', brand: 'Garmin', shape: WatchShape.CIRCLE },
  { id: 'garmin_sq_2', name: 'Garmin Venu Sq 2', brand: 'Garmin', shape: WatchShape.RECTANGLE },

  // --- FITBIT ---
  { id: 'fitbit_sense_2', name: 'Fitbit Sense 2', brand: 'Fitbit', shape: WatchShape.SQUARE },
  { id: 'fitbit_versa_4', name: 'Fitbit Versa 4', brand: 'Fitbit', shape: WatchShape.SQUARE },
  { id: 'fitbit_charge_6', name: 'Fitbit Charge 6', brand: 'Fitbit', shape: WatchShape.RECTANGLE },

  // --- HUAWEI ---
  { id: 'huawei_gt_4', name: 'Huawei Watch GT 4', brand: 'Huawei', shape: WatchShape.CIRCLE },
  { id: 'huawei_ultimate', name: 'Huawei Watch Ultimate', brand: 'Huawei', shape: WatchShape.CIRCLE },
  { id: 'huawei_watch_4', name: 'Huawei Watch 4 Pro', brand: 'Huawei', shape: WatchShape.CIRCLE },
  { id: 'huawei_fit_3', name: 'Huawei Watch Fit 3', brand: 'Huawei', shape: WatchShape.RECTANGLE },

  // --- AMAZFIT ---
  { id: 'amazfit_gtr_4', name: 'Amazfit GTR 4', brand: 'Amazfit', shape: WatchShape.CIRCLE },
  { id: 'amazfit_gts_4', name: 'Amazfit GTS 4', brand: 'Amazfit', shape: WatchShape.SQUARE },
  { id: 'amazfit_t_rex_ultra', name: 'Amazfit T-Rex Ultra', brand: 'Amazfit', shape: WatchShape.CIRCLE },
  { id: 'amazfit_balance', name: 'Amazfit Balance', brand: 'Amazfit', shape: WatchShape.CIRCLE },

  // --- OTHERS ---
  { id: 'xiaomi_watch_2_pro', name: 'Xiaomi Watch 2 Pro', brand: 'Xiaomi', shape: WatchShape.CIRCLE },
  { id: 'oneplus_watch_2', name: 'OnePlus Watch 2', brand: 'OnePlus', shape: WatchShape.CIRCLE },
  { id: 'ticwatch_pro_5', name: 'Mobvoi TicWatch Pro 5', brand: 'Mobvoi', shape: WatchShape.CIRCLE },
  { id: 'fossil_gen_6', name: 'Fossil Gen 6', brand: 'Fossil', shape: WatchShape.CIRCLE },
  { id: 'suunto_race', name: 'Suunto Race', brand: 'Suunto', shape: WatchShape.CIRCLE },
  { id: 'polar_vantage_v3', name: 'Polar Vantage V3', brand: 'Polar', shape: WatchShape.CIRCLE },
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