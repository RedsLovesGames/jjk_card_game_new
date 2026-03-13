"use client";

import React, { useEffect, useState } from 'react';
import { BookOpen, Crown, Layout, Shield, Skull, Sparkles, Swords, Zap } from 'lucide-react';
import { CardFrame, HeroSection, StatBadge } from '@/components/design-system';

const menuCards = [
  {
    title: 'Quick Play',
    description: 'Jump into an intense battle against the AI. Feel the thrill of cursed energy combat!',
    icon: Swords,
    tone: 'from-red-600 to-red-800',
    accent: 'text-red-400',
    action: 'START BATTLE',
    onClick: () => {
      window.history.replaceState(null, '', window.location.pathname);
      window.location.hash = '#/battle';
    },
  },
  {
    title: 'Deck Builder',
    description: 'Craft your ultimate sorcerer team. Combine techniques and dominate the arena!',
    icon: Layout,
    tone: 'from-purple-600 to-indigo-800',
    accent: 'text-purple-400',
    action: 'BUILD DECK',
    onClick: () => (window.location.hash = '#/deck-builder'),
  },
  {
    title: 'Collection',
    description: 'Explore all available cursed techniques. Discover powerful abilities!',
    icon: BookOpen,
    tone: 'from-blue-600 to-cyan-800',
    accent: 'text-blue-400',
    action: 'BROWSE CARDS',
    onClick: () => (window.location.hash = '#/collection'),
  },
];

export default function Index() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-brand-900/30 to-surface-900" />
      <div className="relative z-raised mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-ds10 transition-all duration-slow">
        <HeroSection title={<><span>JJK</span><br /><span>CURSED CLASH</span></>} subtitle="Jujutsu Kaisen Card Battler">
          <div className="mt-ds4 flex items-center justify-center gap-3 text-yellow-400">
            <Sparkles size={18} />
            <Sparkles size={18} />
          </div>
        </HeroSection>

        <div className={`mb-ds12 grid gap-6 md:grid-cols-3 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
          {menuCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <CardFrame
                key={card.title}
                interactive
                onClick={card.onClick}
                className="group p-ds6"
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className={`mb-ds5 mx-auto flex h-20 w-20 items-center justify-center rounded-panel bg-gradient-to-br ${card.tone}`}>
                  <Icon size={38} />
                </div>
                <h3 className={`mb-2 text-center text-2xl font-black uppercase ${card.accent}`}>{card.title}</h3>
                <p className="text-center text-sm text-slate-400">{card.description}</p>
                <div className={`mt-ds4 flex items-center justify-center gap-2 text-xs font-bold ${card.accent}`}>
                  <Zap size={14} />
                  {card.action === 'BUILD DECK' ? <Crown size={14} /> : card.action === 'BROWSE CARDS' ? <Shield size={14} /> : null}
                  <span>{card.action}</span>
                </div>
              </CardFrame>
            );
          })}
        </div>

        <div className="mx-auto flex flex-wrap items-center justify-center gap-4">
          <StatBadge label="Cursed Cards" value="50+" />
          <StatBadge label="Rarity Tiers" value="4" tone="brand" />
          <StatBadge label="Strategies" value="∞" />
        </div>

        <div className="mt-ds8 text-center text-sm text-slate-600">
          <Skull className="mr-2 inline" size={14} /> Built with passion • Inspired by Jujutsu Kaisen
        </div>
      </div>
    </div>
  );
}
