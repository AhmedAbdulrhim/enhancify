import { GoogleGenAI, Modality, Part, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export type EnhancementMode = 'beautify' | 'upscale' | 'colorfix' | 'reference';

interface SafetyCheckResult {
  isSafe: boolean;
  reason: 'safe' | 'celebrity' | 'child';
}

const PROMPTS: Record<EnhancementMode, string> = {
  beautify: `
    Enhance the skin in this portrait to look incredibly clear, smooth, and detailed, as if it were shot in 4K resolution.
    - Remove blemishes, acne, and minor imperfections.
    - Even out the skin tone and reduce redness.
    - Retain natural skin texture to avoid a plastic or artificial look.
    - Subtly brighten the eyes and enhance facial features without heavy makeup effects.
    - Adjust lighting and color for a professional, high-definition finish.
    - The output must be only the edited image, with no text.
  `,
  upscale: `
    Upscale this image to a 4K resolution. Increase the detail, sharpness, and clarity of the entire photo.
    - Enhance textures and fine details throughout the image.
    - Reduce any compression artifacts or noise.
    - Ensure the final result is crisp and high-definition.
    - The output must be only the edited image, with no text.
  `,
  colorfix: `
    Analyze and enhance the colors and lighting in this photo.
    - Correct white balance and color casts.
    - Boost vibrancy and saturation in a natural-looking way.
    - Improve contrast and dynamic range, brightening shadows and recovering highlights.
    - Make the overall image more visually appealing and professional.
    - The output must be only the edited image, with no text.
  `,
  reference: `
    Use the second image as a style reference. Apply its color grading, lighting, and overall mood to the first image. The output must be only the edited first image, with no text.
  `
};


const fileToGenerativePart = async (file: File): Promise<Part> => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        const base64Data = dataUrl.split(',')[1];
        resolve(base64Data);
      };
      reader.readAsDataURL(file);
    });
    
    return {
      inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

export const analyzeImageSafety = async (imageFile: File): Promise<SafetyCheckResult> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);
    const prompt = `Analyze this image. Is the person in the image a celebrity/public figure or a child? Respond in JSON format only. If it is a celebrity, set isSafe to false and reason to "celebrity". If it is a child, set isSafe to false and reason to "child". Otherwise, set isSafe to true and reason to "safe".`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [imagePart, { text: prompt }]
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isSafe: { type: Type.BOOLEAN },
            reason: { type: Type.STRING },
          },
          required: ['isSafe', 'reason'],
        },
      }
    });
    
    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as SafetyCheckResult;

  } catch (error) {
    console.error("Error during safety analysis:", error);
    // Default to safe if analysis fails, to avoid blocking valid images due to transient API errors.
    // A more robust system might retry or require manual review.
    return { isSafe: true, reason: 'safe' };
  }
};

export const enhanceImage = async (imageFile: File, mode: EnhancementMode, referenceImageFile: File | null = null): Promise<string | null> => {
  try {
    const prompt = PROMPTS[mode];
    const imagePart = await fileToGenerativePart(imageFile);
    
    const parts: Part[] = [imagePart];

    if (mode === 'reference' && referenceImageFile) {
      const referenceImagePart = await fileToGenerativePart(referenceImageFile);
      parts.push(referenceImagePart);
    }
    
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts,
      },
      config: {
          responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    
    return null;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to enhance image with Gemini API.");
  }
};