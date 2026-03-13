import React from 'react';
import { CardFrame } from '@/components/design-system';
import { getCardAsset, getCardBackground } from '@/data/assets';
import { CardInstance } from '@/types/game';

interface HandTrayProps {
  hand: CardInstance[];
  energy: number;
  selectedCardId: string | null;
  isMyTurn: boolean;
  hasWinner: boolean;
  onCardClick: (card: CardInstance) => void;
}

export const HandTray: React.FC<HandTrayProps> = ({ hand, energy, selectedCardId, isMyTurn, hasWinner, onCardClick }) => (
  <div className="h-44 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 p-4 flex flex-col">
    <div className="flex justify-between items-center mb-2">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your Hand</span>
      <span className="text-xs text-slate-500">{hand.length} cards</span>
    </div>
    <div className="flex-1 flex items-center justify-center gap-3 overflow-x-auto px-4">
      {hand.map((card) => {
        const asset = getCardAsset(card.id, card.variant);
        const bgColor = getCardBackground(card.id, card.rarity || 'C');
        const canPlay = isMyTurn && card.cost <= energy && !hasWinner;
        return (
          <CardFrame
            key={card.instanceId}
            interactive
            className={`w-24 h-36 border-2 shrink-0 ${selectedCardId === card.instanceId ? 'border-yellow-400 scale-110 z-20' : 'border-slate-700'} ${!canPlay ? 'opacity-60' : ''}`}
            style={{ background: `linear-gradient(to bottom, ${bgColor}dd, ${bgColor}99)` }}
            onClick={() => canPlay && onCardClick(card)}
          >
            <div className="absolute inset-0"><img src={asset.url} alt={card.name} className="w-full h-full object-cover" /></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-[10px]">{card.cost}</div>
            <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black to-transparent"><div className="text-[8px] font-bold text-white truncate">{card.name}</div></div>
          </CardFrame>
        );
      })}
      {hand.length === 0 && <div className="text-slate-600 text-sm italic">No cards in hand</div>}
    </div>
  </div>
);
