import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import AppShell from '@/app/AppShell';
import BattleScreen from '@/pages/BattleScreen';
import { GameBoard } from '@/components/game/GameBoard';
import { vi } from 'vitest';
import { createCardInstance, createGameState } from '@/test/gameTestUtils';

const useGameMock = vi.fn();

vi.mock('@/context/GameContext', () => ({
  useGame: () => useGameMock(),
}));

describe('integration-style player loop', () => {
  it('starts a battle and plays a card in the game view', async () => {
    vi.useFakeTimers();

    const playCard = vi.fn();
    const nextPhase = vi.fn();
    const setSelectedCardId = vi.fn();
    const handCard = createCardInstance({ name: 'Black Flash', instanceId: 'black-flash', cost: 1 });

    const baseState = createGameState();
    const gameContext = {
      gameState: null,
      gameEngine: null,
      battleLog: ['Ready'],
      selectedCardId: 'black-flash',
      targetingMode: null,
      setSelectedCardId,
      setTargetingMode: vi.fn(),
      startGame: vi.fn(() => {
        gameContext.gameState = createGameState({
          phase: 'main1',
          players: [
            { ...baseState.players[0], hand: [handCard] },
            baseState.players[1],
          ],
        });
      }),
      endGame: vi.fn(),
      nextPhase,
      playCard,
      resolveCombat: vi.fn(),
      switchPosition: vi.fn(),
      aiTurn: vi.fn(),
    };

    useGameMock.mockImplementation(() => gameContext);

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <AppShell />,
          children: [
            { path: 'battle', element: <BattleScreen /> },
            { path: 'game', element: <GameBoard /> },
          ],
        },
      ],
      { initialEntries: ['/battle'] },
    );

    render(<RouterProvider router={router} />);

    fireEvent.click(screen.getByRole('button', { name: /Start Battle/i }));

    await act(async () => {
      vi.advanceTimersByTime(1600);
    });

    await waitFor(() => expect(screen.getByText('Your Hand')).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: /Play Black Flash/i }));

    expect(gameContext.startGame).toHaveBeenCalledWith('Sorcerer', 'Cursed Spirit');
    expect(playCard).toHaveBeenCalledWith('black-flash');

    vi.useRealTimers();
  });
});
