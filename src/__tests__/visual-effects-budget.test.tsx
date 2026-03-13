/** @vitest-environment jsdom */

import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Index from '@/pages/Index';
import Collection from '@/pages/Collection';

function mockMatchMedia(reducedMotion: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? reducedMotion : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

const renderBudgets = { index: 60, collection: 90 };

describe('visual effects budgets', () => {
  beforeEach(() => {
    mockMatchMedia(false);
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 });
  });

  afterEach(() => {
    cleanup();
  });

  it('renders Index within budget and includes deterministic particles only on full motion tier', () => {
    const start = performance.now();
    const { container } = render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>,
    );
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(renderBudgets.index);
    expect(container.querySelectorAll('span.animate-pulse').length).toBeGreaterThan(0);
  });

  it('renders Collection within budget', () => {
    const start = performance.now();
    render(
      <MemoryRouter>
        <Collection />
      </MemoryRouter>,
    );
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(renderBudgets.collection);
  });

  it('disables pulse effects on reduced motion tier', () => {
    mockMatchMedia(true);
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 375 });

    const { container } = render(
      <MemoryRouter>
        <Index />
      </MemoryRouter>,
    );

    expect(container.querySelectorAll('span.animate-pulse').length).toBe(0);
  });
});
