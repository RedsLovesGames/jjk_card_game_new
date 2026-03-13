import React from 'react';
import { CardInstance } from '@/types/game';
import { FieldCard } from '@/components/game/FieldCard';

interface PlayerFieldProps {
  player: { id: string; field: CardInstance[] };
  selectedCardId: string | null;
  onCardClick: (card: CardInstance, ownerId: string) => void;
}

export const PlayerField: React.FC<PlayerFieldProps> = ({ player, selectedCardId, onCardClick }) => (
  <div className="flex-1 bg-gradient-to-t from-slate-900 via-slate-950 to-slate-900 p-4 flex flex-col items-center justify-center relative">
    <div className="absolute bottom-2 left-4 text-xs font-bold text-slate-600 uppercase tracking-widest">Your Field</div>
    <div className="flex gap-2 min-h-[160px] items-center justify-center">
      {player.field.length === 0 ? <div className="text-slate-600 text-sm italic">No cards on field</div> : player.field.map((card) => (
        <FieldCard
          key={card.instanceId}
          card={card}
          isSelected={selectedCardId === card.instanceId}
          onClick={() => onCardClick(card, player.id)}
        />
      ))}
    </div>
  </div>
);
