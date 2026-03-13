import React from 'react';
import { Button } from '@/components/design-system';
import { Swords } from 'lucide-react';
import { CardInstance } from '@/types/game';
import { FieldCard } from '@/components/game/FieldCard';

interface OpponentFieldProps {
  opponent: { id: string; hand: CardInstance[]; field: CardInstance[] };
  selectedCardId: string | null;
  targetingMode: 'attack' | 'ability' | null;
  canDeclareDirectAttack: boolean;
  onCardClick: (card: CardInstance, ownerId: string) => void;
  onDirectAttack: () => void;
}

export const OpponentField: React.FC<OpponentFieldProps> = ({ opponent, selectedCardId, targetingMode, canDeclareDirectAttack, onCardClick, onDirectAttack }) => (
  <div className="flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 p-4 flex flex-col items-center justify-center relative">
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at center, #4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
    <div className="absolute top-2 left-4 text-xs font-bold text-slate-600 uppercase tracking-widest">Opponent Field</div>

    <div className="absolute top-2 right-4 flex -space-x-2">
      {opponent.hand.slice(0, 3).map((_, i) => <div key={i} className="w-12 h-16 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-slate-700 transform rotate-3" />)}
      {opponent.hand.length > 3 && <div className="w-12 h-16 rounded-lg bg-slate-900 border-2 border-slate-700 flex items-center justify-center text-[10px] text-slate-500">+{opponent.hand.length - 3}</div>}
    </div>

    <div className="flex gap-2 min-h-[160px] items-center justify-center">
      {opponent.field.length === 0 ? <div className="text-slate-600 text-sm italic">No cards on field</div> : opponent.field.map((card) => (
        <FieldCard
          key={card.instanceId}
          card={card}
          isSelected={selectedCardId === card.instanceId}
          canBeTargeted={targetingMode === 'attack' && card.type === 'creature'}
          onClick={() => onCardClick(card, opponent.id)}
        />
      ))}
    </div>

    {canDeclareDirectAttack && (
      <Button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-500 animate-bounce font-bold shadow-xl shadow-red-500/50 z-30" onClick={onDirectAttack}>
        Attack Player! <Swords size={16} className="ml-2" />
      </Button>
    )}
  </div>
);
