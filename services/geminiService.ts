import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedFace, WatchStyle, FaceConfiguration, WatchHandStyle, ComplicationLayout, DeviceDefinition, WatchShape, ComplicationSlots } from "../types.ts";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getStyleModifier = (style: WatchStyle): string => {
  switch (style) {
    case WatchStyle.MINIMAL: return "minimalist watch face, clean lines, high contrast, uncluttered, vector art style, flat design, apple watch style, bauhaus influence";
    case WatchStyle.LUXURY: return "luxury watch face, rolex style, metallic textures, gold and silver accents, intricate details, photorealistic, horology, expensive, sapphire glass reflection";
    case WatchStyle.CYBERPUNK: return "cyberpunk city, high tech HUD, neon lights, futuristic interface, dark background, glowing elements, glitch art aesthetic";
    case WatchStyle.FITNESS: return "fitness tracker style, dynamic data visualization, energetic colors, gym aesthetic, pulse lines, digital sport, carbon fiber texture";
    case WatchStyle.CARS: return "supercar dashboard, speedometer style, carbon fiber texture, metallic, red and black, automotive design, porsche style, racing chronograph";
    case WatchStyle.ANIME: return "anime art style, vibrant colors, character illustration, cel shaded, manga aesthetic, studio ghibli style, detailed lineart";
    case WatchStyle.SPACE: return "deep space, galaxy background, stars and nebulae, sci-fi HUD, astronaut interface, nasa style, james webb telescope imagery";
    case WatchStyle.NATURE: return "beautiful nature photography, landscape, macro detail, cinematic lighting, 4k, national geographic style, hyperrealistic";
    case WatchStyle.BUSINESS: return "executive style, professional, elegant, sophisticated, dark blue and silver, classic analog, patek philippe style";
    case WatchStyle.SPORTS: return "sports team aesthetic, football pitch, dynamic action, bold numbers, stadium atmosphere, jersey texture, aggressive design";
    case WatchStyle.ISLAMIC: return "islamic geometric patterns, arabesque, calligraphy art, gold and turquoise, mosque architecture style, intricate mandala";
    case WatchStyle.CULTURAL: return "traditional turkish motifs, kilim pattern, ottoman style, ceramic tile texture, cultural heritage, ornate tapestry";
    case WatchStyle.SEASONAL: return "seasonal theme, holiday aesthetic, festive colors, thematic illustration, high quality wallpaper style";
    case WatchStyle.RELIGIOUS: return "spiritual, divine light, sacred symbols, peaceful atmosphere, golden radiance, heavenly, ethereal";
    case WatchStyle.ABSTRACT: return "abstract art, geometric shapes, fluid acrylic pour, modern art, colorful, avant-garde, kandinsky style";
    case WatchStyle.GRAFFITI: return "street art style, graffiti letters, spray paint texture, urban vibe, vibrant neon colors, banksy style, grunge wall";
    case WatchStyle.RETRO: return "retro 80s aesthetics, synthwave, outrun style, neon grid, sunset, vhs glitch effect, pixelated gradient";
    case WatchStyle.PIXEL: return "8-bit pixel art, retro gaming style, blocky details, limited color palette, nostalgia, arcade game interface";
    case WatchStyle.STEAMPUNK: return "steampunk aesthetic, copper gears, brass pipes, victorian industrial, clockwork mechanism, vintage engineering, steam";
    case WatchStyle.WATERCOLOR: return "watercolor painting, soft brush strokes, artistic, pastel colors, paper texture, dreamy, hand painted style";
    case WatchStyle.SKETCH: return "architectural blueprint, technical sketch, white lines on blue background, grid paper, engineering diagram, pencil shading";
    default: return "high quality, smart watch face background";
  }
};

export class GenerationError extends Error {
  title: string;
  constructor(title: string, message: string) {
    super(message);
    this.title = title;
    this.name = 'GenerationError';
  }
}

// New feature: Magic Prompt Enhancement using text model
export const enhancePrompt = async (originalPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert AI art prompter. Rewrite the following user idea into a highly detailed, descriptive prompt suitable for generating a premium smartwatch face background.
      
      User Idea: "${originalPrompt}"
      
      Rules:
      1. Keep it under 40 words.
      2. Focus on visual description, lighting, and texture.
      3. Do NOT include phrases like "create an image" or "watch face", just describe the subject/scene.
      4. Output ONLY the enhanced prompt string.`,
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Enhancement failed", error);
    return originalPrompt; // Fallback to original
  }
};

// New Feature: Inspire Me (Random Prompt)
export const generateRandomPrompt = async (style: WatchStyle): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, creative, and visually interesting prompt for a smart watch face background in the style of "${style}". 
      Make it unique and cool. 
      Output ONLY the description (e.g., "A glowing neon tiger in a rainy alleyway"). 
      Keep it under 15 words.`,
    });
    return response.text.trim();
  } catch (error) {
    return "A futuristic digital interface with glowing blue lines"; // Fallback
  }
}

// New Feature: AI Config Suggestion
export const suggestFaceConfig = async (prompt: string, style: WatchStyle): Promise<FaceConfiguration> => {
   try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this watch face description: "${prompt}" (Style: ${style}).
      Suggest the best UI configuration.
      Return JSON with:
      - handStyle: "Classic", "Sport", "Minimal", "Blocky", or "Digital Only"
      - complicationLayout: "None", "Minimal (Date)", "Activity (Steps/HR)", or "Full Dashboard"
      - accentColor: A hex color code that matches the image vibe.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                handStyle: { type: Type.STRING },
                complicationLayout: { type: Type.STRING },
                accentColor: { type: Type.STRING }
            }
        }
      }
    });

    const json = JSON.parse(response.text.trim());
    
    // Map string response to enums safely
    let handStyle = WatchHandStyle.CLASSIC;
    if (json.handStyle?.includes('Sport')) handStyle = WatchHandStyle.SPORT;
    if (json.handStyle?.includes('Minimal')) handStyle = WatchHandStyle.MINIMAL;
    if (json.handStyle?.includes('Blocky')) handStyle = WatchHandStyle.BLOCKY;
    if (json.handStyle?.includes('Digital')) handStyle = WatchHandStyle.DIGITAL;

    let layout = ComplicationLayout.MINIMAL;
    if (json.complicationLayout?.includes('None')) layout = ComplicationLayout.NONE;
    if (json.complicationLayout?.includes('Activity')) layout = ComplicationLayout.ACTIVITY;
    if (json.complicationLayout?.includes('Full')) layout = ComplicationLayout.FULL;

    const complications: ComplicationSlots = { top: 'none', bottom: 'none', left: 'none', right: 'none' };

    if (layout === ComplicationLayout.MINIMAL) {
        complications.bottom = 'date';
    } else if (layout === ComplicationLayout.ACTIVITY) {
        complications.bottom = 'steps';
        complications.left = 'heartrate';
        complications.right = 'date';
    } else if (layout === ComplicationLayout.FULL) {
        complications.top = 'weather';
        complications.bottom = 'steps';
        complications.left = 'heartrate';
        complications.right = 'date';
    }

    return {
        handStyle,
        complications,
        accentColor: json.accentColor || '#10b981'
    };

   } catch (error) {
     return {
        handStyle: WatchHandStyle.CLASSIC,
        complications: { top: 'none', bottom: 'date', left: 'none', right: 'none' },
        accentColor: '#ffffff'
     };
   }
}

export const generateWatchFaceImage = async (prompt: string, style: WatchStyle, device: DeviceDefinition): Promise<GeneratedFace> => {
  const styleModifier = getStyleModifier(style);
  
  // Dynamic instruction based on shape
  let shapeInstruction = "perfectly circular aspect ratio (1:1), round smartwatch face";
  if (device.shape === WatchShape.RECTANGLE) {
      shapeInstruction = "rectangular aspect ratio (4:5), rounded corners, full screen apple watch wallpaper";
  } else if (device.shape === WatchShape.SQUARE) {
      shapeInstruction = "square aspect ratio (1:1), rounded corners, smartwatch face";
  }

  const fullPrompt = `Design a premium smart watch face background for ${device.name} (${device.brand}). 
  Subject: ${prompt}. 
  Style: ${styleModifier}. 
  Format: ${shapeInstruction}.
  Requirements: High contrast. Center area relatively clear for clock hands. No text or numbers on the image itself. High resolution.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
         // Although Nano models ignore aspect ratio config mostly, we guide via prompt. 
         // For Imagen (if upgraded later), we would set aspectRatio here.
      }
    });

    // Check for safety blocks or other finish reasons before trying to parse
    if (response.candidates && response.candidates.length > 0) {
      const candidate = response.candidates[0];
      if (candidate.finishReason === 'SAFETY') {
        throw new GenerationError(
          "Safety Filter Triggered", 
          "The description triggered our content safety filters. Please modify your prompt to be more specific or avoid sensitive topics."
        );
      }
      if (candidate.finishReason === 'RECITATION') {
        throw new GenerationError(
          "Copyright Restriction",
          "The request was blocked because it may infringe on copyright or recitation checks."
        );
      }
      if (candidate.finishReason && candidate.finishReason !== 'STOP') {
        throw new GenerationError(
          "Generation Stopped",
          `The model stopped generating due to: ${candidate.finishReason}`
        );
      }
    }

    let imageUrl = '';

    // Parse response for image
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
          break; // Found the image
        }
      }
    }

    if (!imageUrl) {
      // If we got here, we have no image and no explicit finishReason error thrown yet
      throw new GenerationError("No Image Generated", "The AI model returned a response but no image data was found. Please try again.");
    }

    return {
      id: crypto.randomUUID(),
      imageUrl,
      prompt,
      style,
      createdAt: Date.now(),
      targetDevice: device,
      config: { // Default config
        handStyle: WatchHandStyle.CLASSIC,
        complications: { top: 'none', bottom: 'date', left: 'none', right: 'none' },
        accentColor: '#ffffff'
      }
    };

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    
    // Pass through our custom errors
    if (error instanceof GenerationError) {
      throw error;
    }

    // Map common API errors to user friendly messages
    const errorMessage = error.message || '';
    
    if (errorMessage.includes('403') || errorMessage.includes('API key')) {
      throw new GenerationError("Service Configuration Error", "There is an issue with the API configuration. Please verify the API key.");
    }
    
    if (errorMessage.includes('429') || errorMessage.includes('Quota')) {
      throw new GenerationError("High Traffic", "We are experiencing high traffic volume. Please wait a moment and try again.");
    }

    if (errorMessage.includes('503') || errorMessage.includes('Overloaded')) {
      throw new GenerationError("System Busy", "The AI service is currently overloaded. Please try again in a few minutes.");
    }
    
    // Fallback for generic errors
    throw new GenerationError("Generation Failed", "An unexpected error occurred while creating your design. Please check your internet connection and try again.");
  }
};