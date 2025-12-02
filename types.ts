
export enum AppState {
  HOME = 'HOME',
  READING = 'READING',
  QUIZ = 'QUIZ',
}

export interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface MatchingPair {
  storyTerm: string;
  scientificTerm: string;
}

export interface Chapter {
  title: string;
  narrative: string; // The metaphorical story
  scientificContext: string; // The literal biology explanation
  imagePrompt: string; // Prompt for the image generator
  quiz: Quiz;
  matchingPairs: MatchingPair[]; // Data for the matching game
  chapterNumber: number;
}

export interface StorySession {
  topic: string;
  chapters: Chapter[];
  currentChapterIndex: number;
}

export const SUGGESTED_TOPICS = [
  {
    id: 'immune',
    title: 'The Immune System',
    description: 'A fortress under siege: How your body defends itself.',
    icon: '🛡️',
  },
  {
    id: 'heart',
    title: 'The Cardiovascular System',
    description: 'The Great Pump and the rivers of life.',
    icon: '❤️',
  },
  {
    id: 'neuron',
    title: 'Neurons & The Brain',
    description: 'The electric messengers of the mind.',
    icon: '⚡',
  },
  {
    id: 'photosynthesis',
    title: 'Photosynthesis',
    description: 'How plants eat sunlight: The Green Factory.',
    icon: '🌿',
  },
  {
    id: 'dna',
    title: 'DNA Replication',
    description: 'The Library of Life and the Scribe.',
    icon: '🧬',
  },
];
