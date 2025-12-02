import { Chapter } from "../types";

// NOTE: This service now simulates the ON-DEVICE "ToyGenerator" logic 
// described in the Swift submission to allow the web preview to function 
// without Cloud APIs, demonstrating the "Offline" capability.

export const generateChapter = async (
  topic: string,
  previousChapters: Chapter[]
): Promise<Chapter> => {
  // Simulate inference latency (e.g., 42ms - 100ms on Arm NPU)
  await new Promise(resolve => setTimeout(resolve, 800));

  const chapterNum = previousChapters.length + 1;
  
  // Deterministic "Toy LLM" generation based on topic
  // In the real iPad app, this is handled by BioTalesLLM.mlmodelc via Core ML
  
  const safeTopic = topic || "Biology";
  
  return {
    chapterNumber: chapterNum,
    title: `The Citadel of ${safeTopic}`,
    narrative: `In the great Citadel of ${safeTopic}, the walls pulse with a rhythm ancient and deep. 

For eons, the ${safeTopic} has stood as a guardian, a fortress constructed not of stone, but of living will. Our hero, a young messenger named 'Signal', rushes through the grand corridors, carrying a message that could save the kingdom from the approaching shadow.

"We must activate the core!" Signal shouts, their voice echoing against the chambers that hum with the energy of a thousand suns. The Citadel is not merely a building; it is alive, breathing, and fighting for its survival against the chaos outside.`,
    scientificContext: `This narrative metaphorically describes the biological function of ${safeTopic}. 

In reality, ${safeTopic} acts as a crucial system in the organism. Just as the Citadel has walls and messengers, biological systems rely on membranes for protection and signal transduction pathways (the 'messengers') to coordinate responses to external stress. The 'energy' refers to metabolic processes, likely ATP production or specific enzymatic activities essential for homeostasis.`,
    imagePrompt: `fantasy digital art, a glowing organic citadel representing ${safeTopic}, bioluminescent fortress, microscopic world, epic scale, 8k resolution`,
    quiz: {
      question: `In the story, what does the 'Citadel' most likely represent in biological terms?`,
      options: [
        `The ${safeTopic} itself or a specific organelle`,
        "A foreign invader",
        "A purely mechanical structure",
        "External food sources"
      ],
      correctIndex: 0,
      explanation: `The Citadel is the central structure being defended, representing the ${safeTopic} (e.g., cell, organ, or system) maintaining its internal stability (homeostasis).`
    },
    matchingPairs: [
      { storyTerm: "The Citadel Walls", scientificTerm: "Membrane/Protective Layer" },
      { storyTerm: "The Messenger 'Signal'", scientificTerm: "Signal Molecules/Hormones" },
      { storyTerm: "The Shadow", scientificTerm: "Pathogen/Stressor" },
      { storyTerm: "The Core Energy", scientificTerm: "ATP/Metabolic Energy" }
    ]
  };
};

export const generateIllustration = async (prompt: string): Promise<string> => {
  // Simulate image generation latency
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return a placeholder organic abstract image to simulate on-device generation
  // In the real app, this would use a small diffusion model or cached assets
  return `https://placehold.co/600x400/059669/FFFFFF/png?text=Generated+Art:+${encodeURIComponent(prompt.substring(0, 20))}...`;
};