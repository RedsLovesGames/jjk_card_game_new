import { render, screen, fireEvent } from '@testing-library/react';
import { GameBoard } from '@/components/game/GameBoard';
import { vi } from 'vitest';
import { createCardInstance, createGameState } from '@/test/gameTestUtils';

const useGameMock = vi.fn();

vi.mock('@/context/GameContext', () => ({
  useGame: () => useGameMock(),
}));

describe('GameBoard play card affordance', () => {
  it('shows play affordance for selected hand card and calls playCard', () => {
    const playCard = vi.fn();
    const handCard = createCardInstance({
      name: 'Divergent Fist',
      instanceId: 'hand-1',
      cost: 2,
    });

    useGameMock.mockReturnValue({
      gameState: createGameState({
        phase: 'main1',
        players: [
          {
            id: 'player-1',
            name: 'Sorcerer',
            life: 20,
            energy: 5,
            ultimateEnergy: 0,
            deck: [],
            hand: [handCard],
            field: [],
            graveyard: [],
            exile: [],
            mulliganUsed: false,
          },
          {
            id: 'player-2',
            name: 'Cursed Spirit',
            life: 20,
            energy: 5,
            ultimateEnergy: 0,
            deck: [],
            hand: [],
            field: [],
            graveyard: [],
            exile: [],
            mulliganUsed: false,
          },
        ],
      }),
      battleLog: [],
      selectedCardId: "hand-1",
      targetingMode: null,
      setSelectedCardId: vi.fn(),
      setTargetingMode: vi.fn(),
      nextPhase: vi.fn(),
      playCard,
      resolveCombat: vi.fn(),
      switchPosition: vi.fn(),
      endGame: vi.fn(),
      gameEngine: null,
    });

    render(<GameBoard />);
    fireEvent.click(screen.getByRole('button', { name: /Play Divergent Fist/i }));

    expect(playCard).toHaveBeenCalledWith('hand-1');
  });
});
