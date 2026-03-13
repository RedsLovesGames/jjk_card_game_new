export interface Particle {
  x: number;
  y: number;
  size: number;
  delayMs: number;
  durationMs: number;
  opacity: number;
}

function hashSeed(seed: string) {
  let hash = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function lcg(seed: number) {
  let value = seed;
  return () => {
    value = Math.imul(1664525, value) + 1013904223;
    return (value >>> 0) / 4294967296;
  };
}

export function createDeterministicParticles(seed: string, count: number): Particle[] {
  const next = lcg(hashSeed(seed));
  return Array.from({ length: count }, () => ({
    x: Math.round(next() * 1000) / 10,
    y: Math.round(next() * 1000) / 10,
    size: Math.round((next() * 2.5 + 1.5) * 10) / 10,
    delayMs: Math.round(next() * 1800),
    durationMs: Math.round(2200 + next() * 1800),
    opacity: Math.round((0.2 + next() * 0.5) * 100) / 100,
  }));
}
