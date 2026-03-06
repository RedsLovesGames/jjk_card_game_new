"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { GameEngine } from '@/engine/GameEngine';
import { GameState, CardInstance } from '@/types/game';
import { SimpleAI } from '@/engine/ai/SimpleAI';

interface GameContextType {
  gameState: GameState | null;
  gameEngine: GameEngine | null;
  battleLog: string[];
  selectedCardId: string | null;
  targetingMode: 'attack' | 'ability' | null;
  setSelectedCardId: (id: string | null) => void;
  setTargetingMode: (mode: 'attack' | 'ability' | null) => void;
  startGame: (p1: string, p2: string) => void;
  endGame: () => void;
  nextPhase: () => void;
  playCard: (cardId: string) => void;
  resolveCombat: (attackerId: string, defenderId?: string) => void;
  switchPosition: (cardId: string) => void;
  aiTurn: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameEngine, setGameEngine] = useState<GameEngine | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [targetingMode, setTargetingMode] = useState<'attack' | 'ability' | null>(null);

  const updateState = useCallback((engine: GameEngine) => {
    setGameState(engine.getGameState());
    setBattleLog([...engine.getBattleLog()]);
  }, []);

  const startGame = useCallback((p1: string, p2: string) => {
    const engine = GameEngine.createNewGame(p1, p2);
    // createNewGame already initializes decks and draws initial hands
    setGameEngine(engine);
    updateState(engine);
  }, [updateState]);

  const nextPhase = useCallback(() => {
    if (gameEngine) {
      gameEngine.nextPhase();
      updateState(gameEngine);
      
      // If it's now the AI's turn (Player 2), trigger AI logic
      const state = gameEngine.getGameState();
      if (state.currentPlayer === 1 && !state.winner) {
        setTimeout(() => aiTurn(), 1000);
      }
    }
  }, [gameEngine, updateState]);

  const aiTurn = useCallback(() => {
    if (gameEngine) {
      const ai = new SimpleAI(gameEngine);
      ai.makeMove();
      updateState(gameEngine);
      
      // If still AI's turn, keep going
      const state = gameEngine.getGameState();
      if (state.currentPlayer === 1 && !state.winner) {
        setTimeout(() => aiTurn(), 1000);
      }
    }
  }, [gameEngine, updateState]);

  const playCard = useCallback((cardId: string): boolean => {
    console.log('playCard called with:', cardId);
    console.log('gameEngine:', !!gameEngine, 'gameState:', !!gameState);
    if (gameEngine && gameState) {
      const player = gameEngine.getCurrentPlayer();
      console.log('current player:', player.getId(), 'energy:', player.getEnergy());
      const result = gameEngine.playCard(player.getId(), cardId);
      console.log('playCard result:', result);
      if (result) {
        updateState(gameEngine);
      }
      return result;
    }
    return false;
  }, [gameEngine, gameState, updateState]);

  const resolveCombat = useCallback((attackerId: string, defenderId?: string) => {
    if (gameEngine) {
      gameEngine.resolveCombat(attackerId, defenderId);
      updateState(gameEngine);
      setSelectedCardId(null);
      setTargetingMode(null);
    }
  }, [gameEngine, updateState]);

  const switchPosition = useCallback((cardId: string) => {
    if (gameEngine && gameState) {
      const player = gameEngine.getCurrentPlayer();
      if (gameEngine.switchPosition(player.getId(), cardId)) {
        updateState(gameEngine);
      }
    }
  }, [gameEngine, gameState, updateState]);

  const endGame = useCallback(() => {
    setGameEngine(null);
    setGameState(null);
    setBattleLog([]);
    setSelectedCardId(null);
    setTargetingMode(null);
    // Navigate to home
    window.location.hash = '#/';
  }, []);

  return (
    <GameContext.Provider value={{
      gameState,
      gameEngine,
      battleLog,
      selectedCardId,
      targetingMode,
      setSelectedCardId,
      setTargetingMode,
      startGame,
      endGame,
      nextPhase,
      playCard,
      resolveCombat,
      switchPosition,
      aiTurn
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) throw new Error('useGame must be used within a GameProvider');
  return context;
};