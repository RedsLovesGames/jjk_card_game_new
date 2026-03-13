import React from 'react';
import { Shield, Swords } from 'lucide-react';
import { CardFrame } from '@/components/design-system';
import { getCardAsset, getCardBackground } from '@/data/assets';
import { CardInstance } from '@/types/game';

interface FieldCardProps {
  card: CardInstance;
  isSelected?: boolean;
  canBeTargeted?: boolean;
  onClick: () => void;
}

export const FieldCard: React.FC<FieldCardProps> = ({ card, isSelected, canBeTargeted, onClick }) => {
  const asset = getCardAsset(card.id, card.variant);
  const bgColor = getCardBackground(card.id, card.rarity || 'C');
  const isExhausted = card.oncePerTurnUsed;

  return (
    <CardFrame
      interactive
      className={`w-28 h-40 border-2 shrink-0 ${isSelected ? 'border-yellow-400 scale-110 z-20 ring-4 ring-yellow-400/30' : ''} ${canBeTargeted ? 'border-red-500 animate-pulse ring-4 ring-red-500/50' : 'border-slate-700'} ${isExhausted ? 'opacity-50 grayscale' : ''}`}
      style={{ background: `linear-gradient(to bottom, ${bgColor}dd, ${bgColor}99)` }}
      onClick={onClick}
    >
      <div className="absolute inset-0">
        <img src={asset.url} alt={card.name} className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute top-1 left-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">{card.cost}</div>
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black to-transparent">
        <div className="text-[10px] font-bold text-white truncate mb-1">{card.name}</div>
        {card.type === 'creature' && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1 text-red-400 font-bold text-xs"><Swords size={10} /> {card.currentAttack || card.attack}</div>
            <div className="flex items-center gap-1 text-blue-400 font-bold text-xs"><Shield size={10} /> {card.currentHealth || card.defense}</div>
          </div>
        )}
      </div>
      {isExhausted && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white text-[8px] font-bold uppercase tracking-widest border border-white px-2 py-1 rotate-[-15deg]">Exhausted</span></div>}
    </CardFrame>
  );
};
