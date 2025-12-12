import { GoogleGenAI, Type } from "@google/genai";
import { BeliefSystem, GeminiJSONResponse } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key is missing. Please check your configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

// Helper to convert File to Base64 for Gemini
const fileToPart = async (file: File) => {
    const base64EncodedDataPromise = new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: {
            data: await base64EncodedDataPromise as string,
            mimeType: file.type,
        },
    };
};

/**
 * Detects emotion and provides spiritual guidance using Gemini Flash Lite for low latency.
 */
export const analyzeEmotion = async (
  text: string,
  belief: BeliefSystem
): Promise<GeminiJSONResponse> => {
  const ai = getAiClient();

  const prompt = `
    Analyze the following journal entry written by a youth who believes in ${belief}.
    Text: "${text}"

    Task:
    1. Detect the dominant emotion (e.g., Happy, Neutral, Stressed, Sad, Anxious).
    2. Write a 1-2 line calming, empathetic message.
    3. Provide a short piece of spiritual wisdom or quote strictly from ${belief}.
    4. Suggest one simple calming action (e.g., "Deep breathing", "Drink water", "Short walk").
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            emotion: { type: Type.STRING },
            calmingMessage: { type: Type.STRING },
            spiritualWisdom: { type: Type.STRING },
            suggestedAction: { type: Type.STRING },
          },
          required: ["emotion", "calmingMessage", "spiritualWisdom", "suggestedAction"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    console.error("Error analyzing emotion:", error);
    throw error;
  }
};

/**
 * Reframes overthinking using Gemini Flash Lite for speed.
 */
export const reframeWorry = async (
  worry: string,
  belief: BeliefSystem
): Promise<GeminiJSONResponse> => {
  const ai = getAiClient();

  const prompt = `
    The user is overthinking: "${worry}".
    Belief System: ${belief}.

    Reframe this thought into something calm, logical, constructive, and spiritually aligned with their belief.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-lite-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reframedThought: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["reframedThought", "explanation"],
        },
      },
    });

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Error reframing worry:", error);
    throw error;
  }
};

/**
 * Generates daily wisdom.
 */
export const getDailyWisdom = async (belief: BeliefSystem): Promise<{ quote: string; source: string }> => {
    const ai = getAiClient();
    try {
        const response = await ai.models.generateContent({
            model: "gemini-flash-lite-latest",
            contents: `Give me one inspiring, short spiritual quote from ${belief} for a young person today. Return JSON with 'quote' and 'source'.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        quote: { type: Type.STRING },
                        source: { type: Type.STRING }
                    }
                }
            }
        });
        return JSON.parse(response.text || "{}");
    } catch (e) {
        return { quote: "Peace comes from within.", source: "Unknown" };
    }
}

/**
 * Chatbot functionality using Gemini 3 Pro Preview with Thinking Mode.
 */
export const sendChatMessage = async (
  message: string,
  history: { role: string; parts: { text: string }[] }[],
  belief: BeliefSystem
): Promise<string> => {
  const ai = getAiClient();

  const systemInstruction = `You are InnerLight, a wise, empathetic, and spiritual companion for a young person. 
  Their belief system is ${belief}. Always answer in a way that is supportive, non-judgmental, and aligned with their faith/spirituality.`;

  try {
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        systemInstruction: systemInstruction,
        thinkingConfig: { thinkingBudget: 32768 }
      },
      history: history,
    });

    const result = await chat.sendMessage({
      message: message,
    });

    return result.text || "I am here with you.";
  } catch (error) {
    console.error("Chat error:", error);
    return "I am having trouble connecting to the spiritual network right now. Please try again.";
  }
};

/**
 * Search Grounding for factual queries using Gemini 2.5 Flash + Google Search.
 */
export const searchWisdom = async (query: string): Promise<{ text: string; sources: { title: string; uri: string }[] }> => {
    const ai = getAiClient();
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `User question: ${query}. Find the most accurate, up-to-date spiritual or mental wellness information relevant to this.`,
            config: {
                tools: [{ googleSearch: {} }]
            }
        });
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = chunks
            .map((chunk: any) => chunk.web)
            .filter((web: any) => web)
            .map((web: any) => ({ title: web.title, uri: web.uri }));

        return { 
            text: response.text || "I couldn't find specific information on that.",
            sources
        };
    } catch (error) {
        console.error("Search error:", error);
        return { text: "Search is currently unavailable.", sources: [] };
    }
}

/**
 * Analyze Video content using Gemini 3 Pro.
 */
export const analyzeVideoContent = async (videoFile: File, prompt: string): Promise<string> => {
    const ai = getAiClient();
    try {
        const filePart = await fileToPart(videoFile);
        
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: {
                parts: [
                    filePart,
                    { text: prompt }
                ]
            }
        });
        return response.text || "I could not analyze the video.";
    } catch (error) {
        console.error("Video analysis error:", error);
        throw error;
    }
}