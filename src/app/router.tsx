import { createBrowserRouter, Navigate } from 'react-router-dom';
import { GameBoard } from '@/components/game/GameBoard';
import Index from '@/pages/Index';
import Collection from '@/pages/Collection';
import DeckBuilder from '@/pages/DeckBuilder';
import BattleScreen from '@/pages/BattleScreen';
import Results from '@/pages/Results';
import NotFound from '@/pages/NotFound';
import AppShell from './AppShell';
import { GameRouteGuard } from '@/components/GameRouteGuard';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <Index /> },
      { path: 'collection', element: <Collection /> },
      { path: 'deck-builder', element: <DeckBuilder /> },
      { path: 'battle', element: <BattleScreen /> },
      { path: 'results', element: <Results /> },
      {
        path: 'game',
        element: (
          <GameRouteGuard>
            <GameBoard />
          </GameRouteGuard>
        ),
      },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
]);
