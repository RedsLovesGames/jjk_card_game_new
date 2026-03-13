import React from 'react';
import { Trophy, Skull } from 'lucide-react';
import { Button } from '@/components/design-system';
import { BattleHeader } from '@/components/game/BattleHeader';
import { BattleLogPanel } from '@/components/game/BattleLogPanel';
import { OpponentField } from '@/components/game/OpponentField';
import { PlayerField } from '@/components/game/PlayerField';
import { HandTray } from '@/components/game/HandTray';
import { PhaseControls } from '@/components/game/PhaseControls';
import { useGameBoardViewModel } from '@/components/game/useGameBoardViewModel';

export const GameBoardContainer: React.FC = () => {
  const { board, battleLog, selectedCardId, targetingMode, actions } = useGameBoardViewModel();

  if (!board) {
    return null;
  }

  return (
    <div className="h-screen bg-surface-900 text-slate-100 flex flex-col overflow-hidden font-sans">
      {board.winner && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-700 p-12 rounded-3xl text-center max-w-lg w-full shadow-2xl">
            {board.winner === board.player.id ? (
              <>
                <Trophy className="mx-auto mb-6 text-yellow-500" size={100} />
                <h2 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">VICTORY</h2>
                <p className="text-slate-400 text-lg mb-8">You have defeated the cursed spirit!</p>
              </>
            ) : (
              <>
                <Skull className="mx-auto mb-6 text-red-500" size={100} />
                <h2 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">DEFEAT</h2>
                <p className="text-slate-400 text-lg mb-8">The cursed spirit overpowered you...</p>
              </>
            )}
            <Button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-6 text-xl rounded-xl" onClick={actions.endGame}>Return to Menu</Button>
          </div>
        </div>
      )}

      <BattleHeader
        player={board.player}
        opponent={board.opponent}
        turn={board.turn}
        phase={board.phaseInfo}
        isMyTurn={board.isMyTurn}
        canAdvancePhase={board.canAdvancePhase}
        onEndGame={actions.endGame}
        onEndPhase={actions.handleEndPhase}
      />

      <div className="flex-1 flex overflow-hidden">
        <BattleLogPanel battleLog={battleLog} />

        <div className="flex-1 relative flex flex-col">
          <OpponentField
            opponent={board.opponent}
            selectedCardId={selectedCardId}
            targetingMode={targetingMode}
            canDeclareDirectAttack={board.canDeclareDirectAttack}
            onCardClick={actions.handleFieldCardClick}
            onDirectAttack={actions.handleDirectAttack}
          />
          <div className="h-1 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
          <PlayerField player={board.player} selectedCardId={selectedCardId} onCardClick={actions.handleFieldCardClick} />
        </div>

        <PhaseControls
          selectedCard={board.selectedCard}
          selectedInHand={board.selectedFromHand}
          selectedInField={board.selectedFromField}
          phase={board.phase}
          targetingMode={targetingMode}
          playerEnergy={board.player.energy}
          ultimateEnergy={board.player.ultimateEnergy}
          onPlayCard={actions.handlePlaySelectedCard}
          onSwitchPosition={actions.handleSwitchSelectedPosition}
          onToggleAttack={actions.toggleAttackMode}
        />
      </div>

      <HandTray
        hand={board.player.hand}
        energy={board.player.energy}
        selectedCardId={selectedCardId}
        isMyTurn={board.isMyTurn}
        hasWinner={Boolean(board.winner)}
        onCardClick={actions.selectHandCard}
      />
    </div>
  );
};
