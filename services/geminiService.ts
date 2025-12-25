import { GoogleGenAI, Type } from "@google/genai";
import { JournalEntry } from "../types.ts";

export const parseNaturalLanguageEntry = async (text: string): Promise<Partial<JournalEntry>> => {
  if (!process.env.API_KEY) {
    console.warn("Gemini API Key missing");
    return {};
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract railway travel details from this text: "${text}". 
      Return JSON with keys: date (YYYY-MM-DD), trainNo, depStation, depTime (HH:mm), arrStation, arrTime (HH:mm), purpose.
      If a value is missing, exclude the key.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            date: { type: Type.STRING },
            trainNo: { type: Type.STRING },
            depStation: { type: Type.STRING },
            depTime: { type: Type.STRING },
            arrStation: { type: Type.STRING },
            arrTime: { type: Type.STRING },
            purpose: { type: Type.STRING },
          }
        }
      }
    });

    const output = response.text;
    if (output) {
        return JSON.parse(output.trim());
    }
    return {};

  } catch (error) {
    console.error("Error parsing with Gemini:", error);
    return {};
  }
};