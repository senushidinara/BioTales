import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Chapter } from "../types";

// Initialize Gemini Client
// The API key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const chapterSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A creative, story-like title for the chapter." },
    narrative: { type: Type.STRING, description: "The educational story using metaphors (e.g., characters, battles, factories)." },
    scientificContext: { type: Type.STRING, description: "The factual biological explanation of what happened in the narrative." },
    imagePrompt: { type: Type.STRING, description: "A vivid prompt to generate a visual illustration of the narrative metaphor." },
    quiz: {
      type: Type.OBJECT,
      properties: {
        question: { type: Type.STRING },
        options: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "4 possible answers"
        },
        correctIndex: { type: Type.INTEGER, description: "Index of the correct answer (0-3)" },
        explanation: { type: Type.STRING, description: "Why the answer is correct." }
      },
      required: ["question", "options", "correctIndex", "explanation"]
    }
  },
  required: ["title", "narrative", "scientificContext", "imagePrompt", "quiz"]
};

export const generateChapter = async (
  topic: string,
  previousChapters: Chapter[]
): Promise<Chapter> => {
  const chapterNum = previousChapters.length + 1;
  
  const historySummary = previousChapters.map(c => `Chapter ${c.chapterNumber}: ${c.title} - ${c.scientificContext}`).join("\n");
  
  const systemInstruction = `
    You are a world-class biology educator and storyteller. 
    Your goal is to teach complex biological concepts by weaving them into an engaging, memorable narrative.
    
    Rules:
    1. Use analogies and metaphors (e.g., The Immune System as a medieval castle defense, The Cell as a bustling cyberpunk city).
    2. The 'narrative' should be the story itself.
    3. The 'scientificContext' should explain the real biology behind the metaphors used in this specific chapter.
    4. Keep the tone engaging, suitable for a general audience or students.
    5. This is Chapter ${chapterNum} of the story about "${topic}".
    ${previousChapters.length > 0 ? `Here is what happened previously:\n${historySummary}` : "This is the very first chapter. Introduce the setting and main characters (biological components)."}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Write Chapter ${chapterNum} about ${topic}. Return JSON.`,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: chapterSchema,
      temperature: 0.7,
    },
  });

  if (!response.text) {
    throw new Error("No content generated");
  }

  const data = JSON.parse(response.text);
  
  return {
    ...data,
    chapterNumber: chapterNum,
  };
};

export const generateIllustration = async (prompt: string): Promise<string> => {
  try {
    // Using gemini-2.5-flash-image for speed and efficiency as per guidelines for general image gen
    // We append specific style instructions to the prompt for consistency
    const enhancedPrompt = `A high-quality, digital painting style educational illustration. ${prompt}. Detailed, clean, vibrant colors. No text labels.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: enhancedPrompt,
      // Config removed as responseMimeType is not supported for this model
    });

    // Check parts for the image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Image generation failed:", error);
    // Return a placeholder if generation fails to not break the flow
    return `https://picsum.photos/800/600?blur=2`; 
  }
};