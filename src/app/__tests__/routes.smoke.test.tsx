import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import AppShell from '@/app/AppShell';
import Index from '@/pages/Index';
import Collection from '@/pages/Collection';
import DeckBuilder from '@/pages/DeckBuilder';
import BattleScreen from '@/pages/BattleScreen';
import NotFound from '@/pages/NotFound';
import { GameBoard } from '@/components/game/GameBoard';
import { vi } from 'vitest';
import { createGameState } from '@/test/gameTestUtils';

const useGameMock = vi.fn();

vi.mock('@/context/GameContext', () => ({
  useGame: () => useGameMock(),
}));

const baseGameContext = {
  gameState: null,
  gameEngine: null,
  battleLog: [],
  selectedCardId: null,
  targetingMode: null,
  setSelectedCardId: vi.fn(),
  setTargetingMode: vi.fn(),
  startGame: vi.fn(),
  endGame: vi.fn(),
  nextPhase: vi.fn(),
  playCard: vi.fn(),
  resolveCombat: vi.fn(),
  switchPosition: vi.fn(),
  aiTurn: vi.fn(),
};

const buildRouter = (initialEntry: string) =>
  createMemoryRouter(
    [
      {
        path: '/',
        element: <AppShell />,
        children: [
          { index: true, element: <Index /> },
          { path: 'collection', element: <Collection /> },
          { path: 'deck-builder', element: <DeckBuilder /> },
          { path: 'battle', element: <BattleScreen /> },
          { path: 'game', element: <GameBoard /> },
          { path: '404', element: <NotFound /> },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  );

describe('major route smoke tests', () => {
  beforeEach(() => {
    useGameMock.mockReturnValue(baseGameContext);
  });

  it('renders the home route', () => {
    render(<RouterProvider router={buildRouter('/')} />);
    expect(screen.getByText('Quick Play')).toBeDefined();
  });

  it('renders the collection route', () => {
    render(<RouterProvider router={buildRouter('/collection')} />);
    expect(screen.getByText('Cursed')).toBeDefined();
  });

  it('renders the deck builder route', () => {
    render(<RouterProvider router={buildRouter('/deck-builder')} />);
    expect(screen.getByText('Deck Builder')).toBeDefined();
  });

  it('renders the battle route', () => {
    render(<RouterProvider router={buildRouter('/battle')} />);
    expect(screen.getByText('Battle Arena')).toBeDefined();
  });

  it('renders the game route when game state exists', () => {
    useGameMock.mockReturnValue({ ...baseGameContext, gameState: createGameState() });
    render(<RouterProvider router={buildRouter('/game')} />);
    expect(screen.getByText('Your Hand')).toBeDefined();
  });

  it('renders not found route', () => {
    render(<RouterProvider router={buildRouter('/404')} />);
    expect(screen.getByText('Oops! Page not found')).toBeDefined();
  });
});
