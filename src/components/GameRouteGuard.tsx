import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useGame } from '@/context/GameContext';

export const GameRouteGuard = ({ children }: { children: ReactNode }) => {
  const { gameState } = useGame();

  if (!gameState) {
    return <Navigate to="/battle" replace />;
  }

  return <>{children}</>;
};
