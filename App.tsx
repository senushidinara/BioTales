import React, { useState } from 'react';
import { TopicSelector } from './components/TopicSelector';
import { StoryReader } from './components/StoryReader';
import { AppState, Chapter, StorySession } from './types';
import { generateChapter } from './services/api';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState<StorySession | null>(null);
  
  // History is tracked to prompt the AI for context
  const [history, setHistory] = useState<Chapter[]>([]);

  const handleStartTopic = async (topic: string) => {
    setIsLoading(true);
    try {
      const firstChapter = await generateChapter(topic, []);
      
      setSession({
        topic,
        chapters: [firstChapter],
        currentChapterIndex: 0
      });
      setHistory([]); // History before the current chapter is empty
      setAppState(AppState.READING);
    } catch (error) {
      console.error("Failed to start story:", error);
      alert("Something went wrong starting the story. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateHistory = (chapter: Chapter) => {
    setHistory(prev => [...prev, chapter]);
  };

  const handleHome = () => {
    // Confirm if reading
    if (appState === AppState.READING) {
        if (!window.confirm("Are you sure you want to leave? Your story progress will be lost.")) {
            return;
        }
    }
    setAppState(AppState.HOME);
    setSession(null);
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-paper text-ink selection:bg-accent/20">
      {appState === AppState.HOME && (
        <TopicSelector 
            onSelectTopic={handleStartTopic} 
            isLoading={isLoading} 
        />
      )}

      {appState === AppState.READING && session && (
        <StoryReader
            topic={session.topic}
            initialChapter={session.chapters[0]}
            history={history}
            onUpdateHistory={handleUpdateHistory}
            onHome={handleHome}
        />
      )}
    </div>
  );
};

export default App;