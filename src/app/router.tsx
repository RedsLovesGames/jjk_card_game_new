import { createBrowserRouter, Navigate } from 'react-router-dom';
import { GameBoard } from '@/components/game/GameBoard';
import { GameRouteGuard } from '@/components/GameRouteGuard';
import { featureFlags } from '@/config/featureFlags';
import Index from '@/pages/Index';
import Collection from '@/pages/Collection';
import DeckBuilder from '@/pages/DeckBuilder';
import BattleScreen from '@/pages/BattleScreen';
import Results from '@/pages/Results';
import NotFound from '@/pages/NotFound';
import V2Shell from '@/app/v2/V2Shell';
import BattleV2Container from '@/pages/v2/BattleV2Container';
import AppShell from './AppShell';

const gameRouteElement = (
  <GameRouteGuard>
    <GameBoard />
  </GameRouteGuard>
);

const rootDefaultElement = featureFlags.v2Default ? <Navigate to="/v2" replace /> : <Index />;

const legacyRoutes = [
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: rootDefaultElement },
      { path: 'collection', element: <Collection /> },
      { path: 'deck-builder', element: <DeckBuilder /> },
      { path: 'battle', element: <BattleScreen /> },
      { path: 'results', element: <Results /> },
      {
        path: 'game',
        element: gameRouteElement,
      },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <Navigate to="/404" replace /> },
    ],
  },
];

const v2Routes = [
  {
    path: '/v2',
    element: <V2Shell />,
    children: [
      { index: true, element: <Index /> },
      { path: 'collection', element: <Collection /> },
      { path: 'deck-builder', element: <DeckBuilder /> },
      { path: 'battle', element: <BattleV2Container /> },
      { path: 'game', element: gameRouteElement },
    ],
  },
];

export const router = createBrowserRouter([
  ...legacyRoutes,
  ...(featureFlags.v2Enabled ? v2Routes : []),
]);
