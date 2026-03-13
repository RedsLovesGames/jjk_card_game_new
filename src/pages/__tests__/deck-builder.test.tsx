import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DeckBuilder from '@/pages/DeckBuilder';
import { vi } from 'vitest';

const toastMock = {
  success: vi.fn(),
  error: vi.fn(),
};

vi.mock('sonner', () => ({ toast: toastMock }));

vi.mock('@/data/cards.json', () => ({
  default: [
    {
      id: 'c1',
      name: 'Gojo Satoru',
      variant: 'Limitless',
      type: 'creature',
      faction: 'Tokyo',
      cost: 2,
      attack: 4,
      defense: 3,
      effect: 'Infinity',
      rarity: 'SR',
    },
    {
      id: 'c2',
      name: 'Cleave',
      variant: 'Sukuna',
      type: 'spell',
      faction: 'Curse',
      cost: 1,
      defense: 0,
      effect: 'Deal damage',
      rarity: 'R',
    },
  ],
}));

describe('DeckBuilder interactions', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('adds cards from library and updates deck count', async () => {
    render(
      <MemoryRouter>
        <DeckBuilder />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByText('Gojo Satoru')).toBeDefined());

    const addButtons = screen.getAllByRole('button').filter((button) => button.className.includes('h-6') && button.className.includes('w-full'));
    fireEvent.click(addButtons[0]);

    expect(screen.getByText('1/60')).toBeDefined();
    expect(screen.getByText('Gojo Satoru')).toBeDefined();
  });

  it('auto-optimizes a deck and enables save button', async () => {
    render(
      <MemoryRouter>
        <DeckBuilder />
      </MemoryRouter>,
    );

    await waitFor(() => expect(screen.getByRole('button', { name: /Auto Optimize/i })).toBeDefined());

    fireEvent.click(screen.getByRole('button', { name: /Auto Optimize/i }));

    act(() => {
      vi.advanceTimersByTime(500);
    });

    await waitFor(() => expect(screen.getByText('50/60')).toBeDefined());
    expect(screen.getByRole('button', { name: /Save/i })).toBeDefined();
  });
});
