import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AppShell from '@/app/AppShell';
import { vi } from 'vitest';

const useGameMock = vi.fn();

vi.mock('@/context/GameContext', () => ({
  useGame: () => useGameMock(),
}));

const renderShell = (initialPath = '/') =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<div>Home Route</div>} />
          <Route path="battle" element={<div>Battle Route</div>} />
          <Route path="deck-builder" element={<div>Deck Builder Route</div>} />
          <Route path="collection" element={<div>Collection Route</div>} />
          <Route path="game" element={<div>Game Route</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('AppShell routing and navigation', () => {
  beforeEach(() => {
    useGameMock.mockReturnValue({ gameState: null });
  });

  it('renders the active route and top menu on non-game pages', () => {
    renderShell('/');

    expect(screen.getByText('JJK Cursed Clash')).toBeDefined();
    expect(screen.getByText('Home Route')).toBeDefined();
  });

  it('navigates with header menu buttons', () => {
    renderShell('/');

    fireEvent.click(screen.getByRole('button', { name: 'Battle' }));
    expect(screen.getByText('Battle Route')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Deck Builder' }));
    expect(screen.getByText('Deck Builder Route')).toBeDefined();

    fireEvent.click(screen.getByRole('button', { name: 'Collection' }));
    expect(screen.getByText('Collection Route')).toBeDefined();
  });

  it('redirects active games to the game route', () => {
    useGameMock.mockReturnValue({ gameState: { id: 'active' } });
    renderShell('/battle');

    expect(screen.getByText('Game Route')).toBeDefined();
    expect(screen.queryByText('JJK Cursed Clash')).toBeNull();
  });
});
