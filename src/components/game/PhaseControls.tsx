import React from 'react';
import { Button } from '@/components/ui/button';
import { getCardAsset, getCardBackground } from '@/data/assets';
import { CardInstance } from '@/types/game';
import { Swords, Zap } from 'lucide-react';
import { GlassPanel } from '@/components/design-system';

interface PhaseControlsProps {
  selectedCard: CardInstance | null;
  selectedInHand: CardInstance | null;
  selectedInField: CardInstance | null;
  phase: string;
  targetingMode: 'attack' | 'ability' | null;
  playerEnergy: number;
  ultimateEnergy: number;
  onPlayCard: () => void;
  onSwitchPosition: () => void;
  onToggleAttack: () => void;
}

export const PhaseControls: React.FC<PhaseControlsProps> = ({ selectedCard, selectedInHand, selectedInField, phase, targetingMode, playerEnergy, ultimateEnergy, onPlayCard, onSwitchPosition, onToggleAttack }) => (
  <GlassPanel className="w-64 border-l border-slate-800 p-4 flex flex-col rounded-none">
    <div className="text-xs font-bold uppercase tracking-tighter text-slate-500 mb-3">Selected Card</div>
    {selectedCard ? (
      <div className="space-y-3">
        {(() => {
          const asset = getCardAsset(selectedCard.id, selectedCard.variant);
          const bgColor = getCardBackground(selectedCard.id, selectedCard.rarity || 'C');
          return (
            <div className="rounded-lg overflow-hidden border border-slate-700" style={{ background: `linear-gradient(to bottom, ${bgColor}dd, ${bgColor}99)` }}>
              <img src={asset.url} alt={selectedCard.name} className="w-full h-32 object-cover" />
              <div className="p-3">
                <div className="font-bold text-purple-400 mb-1">{selectedCard.name}</div>
                <div className="text-[10px] text-slate-400 leading-relaxed mb-2">{selectedCard.effect}</div>
                {selectedCard.type === 'creature' && <div className="flex justify-between text-xs font-bold"><span className="text-red-400">⚔ {selectedCard.attack}</span><span className="text-blue-400">🛡 {selectedCard.defense}</span></div>}
              </div>
            </div>
          );
        })()}

        {(phase === 'main1' || phase === 'main2') && (
          <>
            {selectedInHand && (
              <Button className="w-full bg-blue-600 hover:bg-blue-500 font-bold" onClick={onPlayCard} disabled={selectedInHand.cost > playerEnergy}>
                <Zap size={14} className="mr-2" /> Play Card
              </Button>
            )}
            {selectedInField && <Button className="w-full bg-slate-700 hover:bg-slate-600 font-bold" onClick={onSwitchPosition}>Switch Position</Button>}
          </>
        )}

        {phase === 'battle' && selectedInField && (
          <Button
            className={`w-full font-bold ${targetingMode === 'attack' ? 'bg-red-700' : 'bg-red-600 hover:bg-red-500'}`}
            onClick={onToggleAttack}
            disabled={selectedInField.oncePerTurnUsed}
          >
            <Swords size={14} className="mr-2" /> {targetingMode === 'attack' ? 'Cancel Attack' : 'Declare Attack'}
          </Button>
        )}
      </div>
    ) : (
      <div className="text-xs text-slate-600 italic py-8 text-center">Select a card to see actions</div>
    )}

    <div className="mt-auto pt-4 border-t border-slate-800">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-slate-500">Cursed Energy</span>
        <span className="text-sm font-black text-orange-400">{ultimateEnergy}/5</span>
      </div>
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500" style={{ width: `${(ultimateEnergy / 5) * 100}%` }} />
      </div>
    </div>
  </GlassPanel>
);
