import { GoogleGenAI } from "@google/genai";
import { GeneratedFace, WatchStyle } from "../types";

// Initialize Gemini API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getStyleModifier = (style: WatchStyle): string => {
  switch (style) {
    case WatchStyle.MINIMAL: return "minimalist, clean lines, high contrast, uncluttered, vector art style, flat design";
    case WatchStyle.LUXURY: return "luxury watch face, metallic textures, gold and silver accents, intricate details, photorealistic, horology";
    case WatchStyle.DIGITAL: return "retro digital dashboard, pixel art or segment display, glowing neon, grid background, synthwave";
    case WatchStyle.NATURE: return "beautiful nature photography, landscape, macro detail, cinematic lighting, 4k";
    case WatchStyle.ABSTRACT: return "abstract geometric shapes, colorful, modern art, bauhaus influence, fluid forms";
    case WatchStyle.CYBERPUNK: return "cyberpunk city, high tech HUD, neon lights, futuristic interface, dark background";
    case WatchStyle.ANIME: return "anime art style, vibrant colors, character illustration, cel shaded";
    default: return "high quality, watch face background";
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

export const generateWatchFaceImage = async (prompt: string, style: WatchStyle): Promise<GeneratedFace> => {
  const styleModifier = getStyleModifier(style);
  const fullPrompt = `Design a circular smart watch face background. 
  Subject: ${prompt}. 
  Style: ${styleModifier}. 
  Requirements: The image must be perfectly circular or suitable for a circular mask. High contrast. Center area should be relatively clear for clock hands or digital time. No text or numbers on the image itself unless decorative.`;

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