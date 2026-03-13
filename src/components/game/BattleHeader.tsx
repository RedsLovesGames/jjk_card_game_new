import React from 'react';
import { ArrowRight, Home, Shield, Sparkles, Swords, Zap } from 'lucide-react';
import { Button } from '@/components/design-system';
import { StatBadge } from '@/components/design-system';
import { CardInstance } from '@/types/game';

interface BoardPlayer {
  id: string;
  name: string;
  life: number;
  energy: number;
  hand: CardInstance[];
  field: CardInstance[];
  ultimateEnergy: number;
}

interface BattleHeaderProps {
  player: BoardPlayer;
  opponent: BoardPlayer;
  turn: number;
  phase: { name: string; color: string };
  isMyTurn: boolean;
  canAdvancePhase: boolean;
  onEndGame: () => void;
  onEndPhase: () => void;
}

const phaseIcon = (name: string) => {
  if (name.includes('Draw') || name.includes('Energy')) return <Zap size={14} />;
  if (name.includes('Battle')) return <Swords size={14} />;
  if (name.includes('End')) return <Shield size={14} />;
  return <Sparkles size={14} />;
};

export const BattleHeader: React.FC<BattleHeaderProps> = ({
  player,
  opponent,
  turn,
  phase,
  isMyTurn,
  canAdvancePhase,
  onEndGame,
  onEndPhase,
}) => (
  <div className="h-14 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700 flex items-center justify-between px-6">
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white" onClick={onEndGame}>
        <Home size={18} />
      </Button>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center border-2 border-red-500 overflow-hidden">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=opponent" alt="AI" />
      </div>
      <div>
        <div className="text-sm font-bold">{opponent.name}</div>
        <div className="flex gap-1.5">
          <StatBadge label="HP" value={opponent.life} tone="danger" className="px-2 py-1" />
          <StatBadge label="EN" value={opponent.energy} tone="brand" className="px-2 py-1" />
        </div>
      </div>
    </div>

    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center">
        <div className="text-[10px] text-slate-500 uppercase tracking-widest">Turn</div>
        <div className="text-2xl font-black text-white">{turn}</div>
      </div>
      <div className="w-px h-8 bg-slate-700" />
      <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border ${phase.color.replace('text-', 'border-')}/30`}>
        {phaseIcon(phase.name)}
        <span className={`font-bold ${phase.color}`}>{phase.name}</span>
      </div>
      <div className="w-px h-8 bg-slate-700" />
      {!isMyTurn && <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-900/50 border border-red-700 animate-pulse"><span className="text-red-400 text-xs font-bold uppercase">AI Thinking...</span></div>}
      {canAdvancePhase && (
        <Button onClick={onEndPhase} className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold shadow-lg shadow-purple-500/25">
          End Phase <ArrowRight size={16} className="ml-2" />
        </Button>
      )}
    </div>

    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-sm font-bold">{player.name}</div>
        <div className="flex gap-1.5 justify-end">
          <StatBadge label="HP" value={player.life} tone="danger" className="px-2 py-1" />
          <StatBadge label="EN" value={`${player.energy}/10`} tone="brand" className="px-2 py-1" />
        </div>
      </div>
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center border-2 border-blue-500 overflow-hidden">
        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=player" alt="Player" />
      </div>
    </div>
  </div>
);
