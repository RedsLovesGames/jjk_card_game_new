import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useGame } from '@/context/GameContext';

export const GameRouteGuard = ({ children }: { children: ReactNode }) => {
  const { gameState, isStartingGame } = useGame();

  if (isStartingGame) {
    return null;
  }

  if (!gameState) {
    return <Navigate to="/battle" replace />;
  }

  return <>{children}</>;
};
