
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
    },
    matchingPairs: {
        type: Type.ARRAY,
        description: "Create 4 pairs that map a specific metaphor from the story to the real biological term.",
        items: {
            type: Type.OBJECT,
            properties: {
                storyTerm: { type: Type.STRING, description: "The metaphor used in the story (e.g., 'The Castle Wall')" },
                scientificTerm: { type: Type.STRING, description: "The real biological term (e.g., 'Cell Membrane')" }
            },
            required: ["storyTerm", "scientificTerm"]
        }
    }
  },
  required: ["title", "narrative", "scientificContext", "imagePrompt", "quiz", "matchingPairs"]
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
    5. Generate a 'matchingPairs' list where users must connect the metaphor to the science to unlock the next chapter.
    
    Current Topic: ${topic}
    Chapter Number: ${chapterNum}
    
    Previous Context (if any):
    ${historySummary}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: `Write chapter ${chapterNum} about ${topic}.`,
    config: {
      responseMimeType: 'application/json',
      responseSchema: chapterSchema,
      systemInstruction: systemInstruction,
    },
  });

  const text = response.text;
  if (!text) {
    throw new Error("No content generated");
  }

  const data = JSON.parse(text);
  return {
    ...data,
    chapterNumber: chapterNum
  };
};

export const generateIllustration = async (prompt: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
        parts: [{ text: prompt }]
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      const base64EncodeString = part.inlineData.data;
      return `data:image/png;base64,${base64EncodeString}`;
    }
  }
  
  throw new Error("No image generated");
};
