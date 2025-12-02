
import React, { useState, useEffect, useRef } from 'react';
import { Chapter } from '../types';
import { generateChapter, generateIllustration } from '../services/api';
import { ArrowRight, BrainCircuit, Check, X, RefreshCw, Home, Lock } from 'lucide-react';
import { MatchingGame } from './MatchingGame';

interface StoryReaderProps {
  topic: string;
  initialChapter: Chapter;
  history: Chapter[];
  onUpdateHistory: (chapter: Chapter) => void;
  onHome: () => void;
}

export const StoryReader: React.FC<StoryReaderProps> = ({
  topic,
  initialChapter,
  history,
  onUpdateHistory,
  onHome,
}) => {
  const [currentChapter, setCurrentChapter] = useState<Chapter>(initialChapter);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [isGeneratingNext, setIsGeneratingNext] = useState(false);
  
  // Progress State
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Quiz State
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  
  // Ref for scrolling to top on new chapter
  const topRef = useRef<HTMLDivElement>(null);

  // Load image when chapter changes
  useEffect(() => {
    let active = true;
    
    const fetchImage = async () => {
      setIsImageLoading(true);
      setImageUrl(null);
      try {
        const url = await generateIllustration(currentChapter.imagePrompt);
        if (active) setImageUrl(url);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setIsImageLoading(false);
      }
    };

    if (currentChapter.imagePrompt) {
        fetchImage();
    }

    // Reset states on chapter change
    setQuizSelected(null);
    setQuizSubmitted(false);
    setGameCompleted(false);

    // Scroll to top
    topRef.current?.scrollIntoView({ behavior: 'smooth' });

    return () => { active = false; };
  }, [currentChapter]);

  const handleNextChapter = async () => {
    setIsGeneratingNext(true);
    try {
        // Add current chapter to history before generating next
        const newHistory = [...history, currentChapter];
        onUpdateHistory(currentChapter);

        const nextChapter = await generateChapter(topic, newHistory);
        setCurrentChapter(nextChapter);
    } catch (error) {
        console.error("Failed to generate next chapter", error);
        alert("We encountered a hiccup in the story. Please try again.");
    } finally {
        setIsGeneratingNext(false);
    }
  };

  const handleQuizOptionClick = (index: number) => {
    if (quizSubmitted) return;
    setQuizSelected(index);
  };

  const handleQuizSubmit = () => {
    if (quizSelected === null) return;
    setQuizSubmitted(true);
  };

  const isCorrect = quizSelected === currentChapter.quiz.correctIndex;
  
  // Determine if user can proceed (Game must be done, Quiz is optional but recommended)
  const canProceed = gameCompleted;

  return (
    <div className="min-h-screen bg-paper pb-20" ref={topRef}>
      {/* Header */}
      <nav className="sticky top-0 z-10 bg-paper/90 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <button 
            onClick={onHome}
            className="flex items-center gap-2 text-stone-600 hover:text-ink transition-colors font-sans text-sm font-medium"
        >
            <Home className="w-4 h-4" />
            Home
        </button>
        <span className="font-serif font-bold text-ink text-lg truncate max-w-xs">{topic}</span>
        <div className="w-16"></div> {/* Spacer for centering */}
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-12">
        
        {/* Chapter Title & Image */}
        <section className="space-y-6">
            <div className="text-center space-y-2">
                <span className="text-accent font-sans text-sm font-bold tracking-wider uppercase">Chapter {currentChapter.chapterNumber}</span>
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-ink leading-tight">{currentChapter.title}</h1>
            </div>

            <div className="relative aspect-video w-full bg-stone-200 rounded-xl overflow-hidden shadow-lg border border-stone-300">
                {isImageLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center text-stone-500 gap-3 bg-stone-100">
                        <RefreshCw className="w-6 h-6 animate-spin" />
                        <span className="font-sans text-sm font-medium">Illustrating the scene...</span>
                    </div>
                ) : (
                    imageUrl && <img src={imageUrl} alt={currentChapter.imagePrompt} className="w-full h-full object-cover animate-in fade-in duration-700" />
                )}
            </div>
        </section>

        {/* Narrative */}
        <section className="max-w-3xl mx-auto">
            <div className="font-serif text-xl md:text-2xl leading-loose text-stone-800 whitespace-pre-line first-letter:text-5xl first-letter:font-bold first-letter:text-accent first-letter:mr-1 first-letter:float-left">
                {currentChapter.narrative}
            </div>
        </section>

        {/* Scientific Context */}
        <section className="bg-white border border-stone-200 rounded-xl p-6 md:p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-accent"></div>
            <div className="flex items-start gap-4">
                <div className="p-2 bg-accent/10 rounded-lg text-accent mt-1 shrink-0">
                    <BrainCircuit className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-bold font-serif text-ink">The Science Behind The Story</h3>
                    <p className="text-stone-600 font-sans leading-relaxed">
                        {currentChapter.scientificContext}
                    </p>
                </div>
            </div>
        </section>

        {/* Interactive Game Section */}
        <section className="scroll-mt-20">
             <MatchingGame 
                pairs={currentChapter.matchingPairs || []} 
                onComplete={() => setGameCompleted(true)} 
             />
        </section>

        {/* Quiz Section - Unlocks after Game */}
        {gameCompleted ? (
            <section className="max-w-2xl mx-auto pt-8 border-t border-stone-200 animate-in fade-in slide-in-from-bottom-8">
                <div className="mb-6 text-center">
                    <h3 className="text-2xl font-serif font-bold text-ink mb-2">Knowledge Check</h3>
                    <p className="text-stone-500 font-sans">{currentChapter.quiz.question}</p>
                </div>

                <div className="space-y-3">
                    {currentChapter.quiz.options.map((option, idx) => {
                        let btnClass = "w-full p-4 text-left border rounded-xl transition-all duration-200 flex items-center justify-between group ";
                        
                        if (quizSubmitted) {
                            if (idx === currentChapter.quiz.correctIndex) {
                                btnClass += "bg-emerald-50 border-emerald-500 text-emerald-900";
                            } else if (idx === quizSelected && idx !== currentChapter.quiz.correctIndex) {
                                btnClass += "bg-red-50 border-red-300 text-red-900";
                            } else {
                                btnClass += "bg-stone-50 border-stone-200 text-stone-400 opacity-60";
                            }
                        } else {
                            if (idx === quizSelected) {
                                btnClass += "bg-stone-100 border-ink shadow-sm ring-1 ring-ink";
                            } else {
                                btnClass += "bg-white border-stone-200 hover:border-stone-400 hover:bg-stone-50";
                            }
                        }

                        return (
                            <button 
                                key={idx}
                                onClick={() => handleQuizOptionClick(idx)}
                                disabled={quizSubmitted}
                                className={btnClass}
                            >
                                <span className="font-sans font-medium">{option}</span>
                                {quizSubmitted && idx === currentChapter.quiz.correctIndex && <Check className="w-5 h-5 text-emerald-600" />}
                                {quizSubmitted && idx === quizSelected && idx !== currentChapter.quiz.correctIndex && <X className="w-5 h-5 text-red-500" />}
                            </button>
                        );
                    })}
                </div>

                {!quizSubmitted && (
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleQuizSubmit}
                            disabled={quizSelected === null}
                            className="bg-ink text-white px-6 py-2 rounded-lg font-sans font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
                        >
                            Check Answer
                        </button>
                    </div>
                )}

                {quizSubmitted && (
                    <div className={`mt-6 p-4 rounded-lg animate-in fade-in slide-in-from-top-4 ${isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-stone-100 text-stone-800'}`}>
                        <p className="font-sans">
                            <span className="font-bold block mb-1">{isCorrect ? 'Correct!' : 'Not quite.'}</span>
                            {currentChapter.quiz.explanation}
                        </p>
                    </div>
                )}
            </section>
        ) : (
             <div className="text-center py-8 text-stone-400 flex flex-col items-center gap-2">
                <Lock className="w-6 h-6" />
                <p className="font-sans">Complete the Metaphor Matcher to unlock the quiz and next chapter</p>
             </div>
        )}

        {/* Navigation Footer */}
        <div className="pt-8 flex justify-center pb-8">
            <div className="flex flex-col items-center gap-2">
                <button
                    onClick={handleNextChapter}
                    disabled={isGeneratingNext || !canProceed}
                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-accent hover:bg-accent-dark text-white rounded-full font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-lg disabled:cursor-not-allowed disabled:bg-stone-300"
                >
                    {isGeneratingNext ? (
                        <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Writing Chapter {currentChapter.chapterNumber + 1}...</span>
                        </>
                    ) : (
                        <>
                            <span>Continue Story</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};
