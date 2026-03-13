import { useCallback, useMemo, useState } from 'react';
import { useGame } from '@/context/GameContext';
import { CardInstance } from '@/types/game';

export interface BattleAnimation {
  type: 'attack' | 'play' | 'damage' | 'death';
  from?: string;
  to?: string;
  cardId?: string;
}

type TargetingMode = 'attack' | 'ability' | null;

const PHASE_DISPLAY: Record<string, { name: string; color: string }> = {
  start: { name: 'Start Phase', color: 'text-yellow-400' },
  draw: { name: 'Draw Phase', color: 'text-blue-400' },
  energy: { name: 'Energy Phase', color: 'text-cyan-400' },
  standby: { name: 'Standby Phase', color: 'text-yellow-400' },
  main1: { name: 'Main Phase 1', color: 'text-green-400' },
  battle: { name: 'Battle Phase', color: 'text-red-400' },
  main2: { name: 'Main Phase 2', color: 'text-purple-400' },
  end: { name: 'End Phase', color: 'text-slate-400' },
};

export const useGameBoardViewModel = () => {
  const { gameState, battleLog, endGame, nextPhase, playCard, resolveCombat, switchPosition } = useGame();
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [targetingMode, setTargetingMode] = useState<TargetingMode>(null);
  const [animations, setAnimations] = useState<BattleAnimation[]>([]);

  const board = useMemo(() => {
    if (!gameState) {
      return null;
    }

    const player = gameState.players[0];
    const opponent = gameState.players[1];
    const selectedFromHand = selectedCardId
      ? player.hand.find((card) => card.instanceId === selectedCardId) ?? null
      : null;
    const selectedFromField = selectedCardId
      ? player.field.find((card) => card.instanceId === selectedCardId) ?? null
      : null;
    const selectedCard =
      selectedFromHand ??
      selectedFromField ??
      (selectedCardId ? opponent.field.find((card) => card.instanceId === selectedCardId) ?? null : null);

    const isMyTurn = gameState.currentPlayer === 0;

    return {
      player,
      opponent,
      winner: gameState.winner,
      turn: gameState.turn,
      phase: gameState.phase,
      isMyTurn,
      canAdvancePhase: isMyTurn && !gameState.winner,
      phaseInfo: PHASE_DISPLAY[gameState.phase] ?? { name: gameState.phase, color: 'text-white' },
      selectedCard,
      selectedFromHand,
      selectedFromField,
      canDeclareDirectAttack:
        targetingMode === 'attack' &&
        player.field.some((card) => !card.oncePerTurnUsed) &&
        isMyTurn &&
        !gameState.winner,
    };
  }, [gameState, selectedCardId, targetingMode]);

  const clearSelection = useCallback(() => {
    setSelectedCardId(null);
    setTargetingMode(null);
  }, []);

  const selectHandCard = useCallback((card: CardInstance) => {
    setSelectedCardId(card.instanceId);
    setTargetingMode(null);
  }, []);

  const handleFieldCardClick = useCallback((card: CardInstance, ownerId: string) => {
    if (!board || !board.isMyTurn || board.winner) {
      return;
    }

    if (targetingMode === 'attack' && ownerId === board.opponent.id && card.type === 'creature') {
      if (selectedCardId) {
        setAnimations((prev) => [...prev, { type: 'attack', from: selectedCardId, to: card.instanceId }]);
        resolveCombat(selectedCardId, card.instanceId);
        clearSelection();
      }
      return;
    }

    if (selectedCardId === card.instanceId) {
      clearSelection();
      return;
    }

    setSelectedCardId(card.instanceId);
  }, [board, clearSelection, resolveCombat, selectedCardId, targetingMode]);

  const handleDirectAttack = useCallback(() => {
    if (!board || !selectedCardId || targetingMode !== 'attack') {
      return;
    }

    setAnimations((prev) => [...prev, { type: 'attack', from: selectedCardId, to: 'opponent' }]);
    resolveCombat(selectedCardId);
    clearSelection();
  }, [board, clearSelection, resolveCombat, selectedCardId, targetingMode]);

  const handlePlaySelectedCard = useCallback(() => {
    if (!board?.selectedFromHand || !selectedCardId) {
      return;
    }

    setAnimations((prev) => [...prev, { type: 'play', cardId: selectedCardId }]);
    if (playCard(selectedCardId)) {
      clearSelection();
    }
  }, [board?.selectedFromHand, clearSelection, playCard, selectedCardId]);

  const handleSwitchSelectedPosition = useCallback(() => {
    if (!board?.selectedFromField || !selectedCardId) {
      return;
    }
    if (switchPosition(selectedCardId)) {
      clearSelection();
    }
  }, [board?.selectedFromField, clearSelection, selectedCardId, switchPosition]);

  const toggleAttackMode = useCallback(() => {
    setTargetingMode((prev) => (prev === 'attack' ? null : 'attack'));
  }, []);

  const handleEndPhase = useCallback(() => {
    if (!board?.canAdvancePhase) {
      return;
    }
    nextPhase();
    clearSelection();
  }, [board?.canAdvancePhase, clearSelection, nextPhase]);

  return {
    gameState,
    battleLog,
    selectedCardId,
    targetingMode,
    animations,
    board,
    actions: {
      endGame,
      setSelectedCardId,
      selectHandCard,
      handleFieldCardClick,
      handleDirectAttack,
      handlePlaySelectedCard,
      handleSwitchSelectedPosition,
      toggleAttackMode,
      handleEndPhase,
      clearSelection,
    },
  };
};
