import React, { useState } from 'react';
import { SUGGESTED_TOPICS } from '../types';
import { BookOpen, ArrowRight, Loader2 } from 'lucide-react';

interface TopicSelectorProps {
  onSelectTopic: (topic: string) => void;
  isLoading: boolean;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({ onSelectTopic, isLoading }) => {
  const [customTopic, setCustomTopic] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTopic.trim()) {
      onSelectTopic(customTopic);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-5xl font-serif font-bold text-ink mb-4 tracking-tight">
          BioTales
        </h1>
        <p className="text-xl text-stone-600 max-w-2xl mx-auto font-sans leading-relaxed">
          Master biology and medicine through the power of storytelling. 
          Choose a topic, and let the adventure begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {SUGGESTED_TOPICS.map((topic) => (
          <button
            key={topic.id}
            onClick={() => onSelectTopic(topic.title)}
            disabled={isLoading}
            className="group relative flex flex-col items-start p-8 bg-white border border-stone-200 rounded-xl hover:shadow-xl hover:border-accent/30 transition-all duration-300 text-left disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-4xl mb-4 bg-stone-50 p-3 rounded-lg group-hover:scale-110 transition-transform duration-300">
              {topic.icon}
            </div>
            <h3 className="text-xl font-bold text-ink mb-2 group-hover:text-accent transition-colors font-serif">
              {topic.title}
            </h3>
            <p className="text-stone-500 text-sm leading-relaxed font-sans">
              {topic.description}
            </p>
            <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
              <ArrowRight className="w-5 h-5 text-accent" />
            </div>
          </button>
        ))}
      </div>

      <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
        <label className="block text-sm font-semibold text-stone-700 mb-2 font-sans">
          Or explore a specific topic
        </label>
        <form onSubmit={handleCustomSubmit} className="flex gap-2">
          <input
            type="text"
            value={customTopic}
            onChange={(e) => setCustomTopic(e.target.value)}
            placeholder="e.g. The Kidney, Glycolysis..."
            className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all font-sans"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !customTopic.trim()}
            className="bg-ink text-white px-6 py-3 rounded-lg hover:bg-stone-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-sans font-medium flex items-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start'}
          </button>
        </form>
      </div>
    </div>
  );
};
