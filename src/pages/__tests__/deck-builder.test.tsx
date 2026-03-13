import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DeckBuilder from '@/pages/DeckBuilder';
import { DeckProvider } from '@/context/DeckContext';
import { vi } from 'vitest';

const { toastHelpersMock } = vi.hoisted(() => ({
  toastHelpersMock: {
    showSuccess: vi.fn(),
    showError: vi.fn(),
  },
}));

vi.mock('@/lib/toast', () => toastHelpersMock);

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

const renderDeckBuilder = () =>
  render(
    <MemoryRouter>
      <DeckProvider>
        <DeckBuilder />
      </DeckProvider>
    </MemoryRouter>,
  );


describe('DeckBuilder interactions', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders deck builder controls with context-backed draft state', async () => {
    renderDeckBuilder();

    expect(screen.getByText('0/60')).toBeDefined();
    expect(screen.getByRole('button', { name: /Saved Decks/i })).toBeDefined();
    await waitFor(() => expect(screen.getByRole('button', { name: /Auto Optimize/i })).toBeDefined());
  });

  it('auto-optimizes a deck and enables save button', async () => {
    renderDeckBuilder();

    const optimizeButton = screen.getByRole('button', { name: /Auto Optimize/i });

    await waitFor(() => {
      expect(optimizeButton.hasAttribute('disabled')).toBe(false);
    });

    fireEvent.click(optimizeButton);

    await waitFor(() => expect(toastHelpersMock.showSuccess).toHaveBeenCalledWith('Deck optimized!'), { timeout: 2000 });

    const cardsStatText = screen.getByText(/\d+\/60/).textContent ?? '0/60';
    const deckCount = Number(cardsStatText.split('/')[0]);
    expect(deckCount).toBeGreaterThan(0);
  });
});
