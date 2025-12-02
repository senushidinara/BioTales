
import React, { useState, useEffect, useCallback } from 'react';
import { MatchingPair } from '../types';
import { Sparkles, Link, CheckCircle2, RotateCcw } from 'lucide-react';

interface MatchingGameProps {
  pairs: MatchingPair[];
  onComplete: () => void;
}

interface Card {
  id: string;
  text: string;
  type: 'story' | 'science';
  pairId: string;
}

export const MatchingGame: React.FC<MatchingGameProps> = ({ pairs, onComplete }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<Card[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<Set<string>>(new Set());
  const [justMatchedPairId, setJustMatchedPairId] = useState<string | null>(null);
  const [isWrong, setIsWrong] = useState(false);

  const initializeGame = useCallback(() => {
    // Create deck
    const deck: Card[] = [];
    pairs.forEach((pair, index) => {
      const pairId = `pair-${index}`;
      deck.push({
        id: `story-${index}`,
        text: pair.storyTerm,
        type: 'story',
        pairId: pairId
      });
      deck.push({
        id: `science-${index}`,
        text: pair.scientificTerm,
        type: 'science',
        pairId: pairId
      });
    });

    // Shuffle
    setCards(deck.sort(() => Math.random() - 0.5));
    setSelectedCards([]);
    setMatchedPairIds(new Set());
    setJustMatchedPairId(null);
    setIsWrong(false);
  }, [pairs]);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (card: Card) => {
    if (matchedPairIds.has(card.pairId)) return;
    if (selectedCards.length === 2) return;
    if (selectedCards.find(c => c.id === card.id)) return;

    const newSelected = [...selectedCards, card];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      // Check match
      if (newSelected[0].pairId === newSelected[1].pairId) {
        // Match!
        const matchId = newSelected[0].pairId;
        const newMatched = new Set(matchedPairIds);
        newMatched.add(matchId);
        setMatchedPairIds(newMatched);
        
        // Trigger "Pop" animation
        setJustMatchedPairId(matchId);
        
        setSelectedCards([]);

        // Clear "Pop" state after animation
        setTimeout(() => {
            setJustMatchedPairId(null);
        }, 600);

        if (newMatched.size === pairs.length) {
          setTimeout(onComplete, 1000);
        }
      } else {
        // No match
        setIsWrong(true);
        setTimeout(() => {
          setSelectedCards([]);
          setIsWrong(false);
        }, 1000);
      }
    }
  };

  const isComplete = matchedPairIds.size === pairs.length && pairs.length > 0;

  return (
    <div className="bg-stone-100 rounded-xl p-6 md:p-8 border border-stone-200 shadow-inner relative">
      <button 
        onClick={initializeGame}
        className="absolute top-4 right-4 p-2 text-stone-400 hover:text-ink hover:bg-stone-200 rounded-full transition-colors"
        title="Reset Game"
        aria-label="Reset Game"
      >
        <RotateCcw className="w-4 h-4" />
      </button>

      <div className="text-center mb-6">
        <h3 className="text-2xl font-serif font-bold text-ink flex items-center justify-center gap-2">
          <Link className="w-5 h-5 text-accent" />
          Metaphor Matcher
        </h3>
        <p className="text-stone-500 font-sans text-sm">
          Connect the story element to the real science to unlock the next chapter.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((card) => {
          const isSelected = selectedCards.find(c => c.id === card.id);
          const isMatched = matchedPairIds.has(card.pairId);
          const isJustMatched = card.pairId === justMatchedPairId;
          
          let cardStyle = "h-32 p-3 rounded-lg flex items-center justify-center text-center text-sm cursor-pointer transition-all duration-500 relative perspective-1000 ";
          
          if (isJustMatched) {
             // 1. Reward State: Pop up, glow, bright green
             cardStyle += "bg-emerald-100 border-2 border-emerald-500 text-emerald-900 scale-105 shadow-[0_0_20px_rgba(16,185,129,0.4)] z-10 ring-2 ring-emerald-400 ring-offset-2 ";
          } else if (isMatched) {
             // 2. Settled State: Faded, shrunk, unobtrusive
             cardStyle += "bg-emerald-50/50 border-emerald-200/50 text-emerald-800/50 opacity-60 scale-95 grayscale-[0.3] cursor-default ";
          } else if (isSelected) {
            if (isWrong && selectedCards.length === 2) {
              cardStyle += "bg-red-50 border-2 border-red-400 text-red-800 animate-shake ";
            } else {
              cardStyle += "bg-white border-2 border-accent text-accent shadow-lg -translate-y-1 ";
            }
          } else {
            // Default styling based on type
            if (card.type === 'story') {
              cardStyle += "bg-[#fdfbf7] border border-[#e8e4d9] font-serif text-ink hover:border-accent/50 hover:shadow-md font-medium ";
            } else {
              cardStyle += "bg-white border border-stone-200 font-sans text-slate-600 hover:border-blue-400/50 hover:shadow-md ";
            }
          }

          return (
            <div
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={cardStyle}
            >
              <div className="pointer-events-none">
                {isMatched && (
                    <CheckCircle2 
                        className={`w-5 h-5 text-emerald-500 absolute top-2 right-2 ${isJustMatched ? 'animate-in zoom-in spin-in-90 duration-500' : ''}`} 
                    />
                )}
                <span className={card.type === 'story' ? "italic" : "font-semibold"}>
                  {card.text}
                </span>
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-stone-300">
                  {card.type}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {isComplete && (
        <div className="mt-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-100 text-emerald-700 rounded-full font-bold font-sans shadow-sm border border-emerald-200">
            <Sparkles className="w-5 h-5" />
            Connection Established!
          </div>
        </div>
      )}
    </div>
  );
};
