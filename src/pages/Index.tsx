"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Layout, Sparkles, Zap, Skull, Swords, Shield, Crown } from 'lucide-react';
import { HeroSection, StatBadge } from '@/components/design-system';

interface MenuItem {
  title: string;
  description: string;
  route: string;
  Icon: typeof Swords;
  accentClass: string;
  cta: string;
}

export default function Index() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems: MenuItem[] = [
    {
      title: 'Quick Play',
      description: 'Jump into an intense battle against the AI. Feel the thrill of cursed energy combat!',
      route: '/battle',
      Icon: Swords,
      accentClass: 'hover:border-red-400/60',
      cta: 'Start battle',
    },
    {
      title: 'Deck Builder',
      description: 'Craft your ultimate sorcerer team. Combine techniques and dominate the arena!',
      route: '/deck-builder',
      Icon: Layout,
      accentClass: 'hover:border-purple-400/60',
      cta: 'Build deck',
    },
    {
      title: 'Collection',
      description: 'Explore all available cursed techniques. Discover powerful abilities!',
      route: '/collection',
      Icon: BookOpen,
      accentClass: 'hover:border-blue-400/60',
      cta: 'Browse cards',
    },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white" aria-labelledby="home-title">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-brand-900/30 to-surface-900" aria-hidden="true" />
      <div className="relative z-raised mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-ds10 transition-all duration-slow motion-reduce:transition-none">
        <HeroSection title={<><span id="home-title">JJK</span><br /><span>CURSED CLASH</span></>} subtitle="Jujutsu Kaisen Card Battler">
          <div className="mt-ds4 flex items-center justify-center gap-3 text-yellow-300" aria-hidden="true">
            <Sparkles size={18} />
            <Sparkles size={18} />
          </div>
        </HeroSection>

        <section aria-label="Main menu" className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl w-full">
          {menuItems.map((item, index) => (
            <button
              key={item.route}
              type="button"
              onClick={() => navigate(item.route)}
              className={`
                group relative rounded-xl bg-gradient-to-br from-slate-900/90 to-slate-950/90 p-8 text-center
                border border-slate-700 backdrop-blur-xl overflow-hidden transition-all duration-500
                hover:scale-[1.02] hover:-translate-y-1 ${item.accentClass}
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
                ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
              `}
              style={{ transitionDelay: `${(index + 1) * 0.15}s` }}
              aria-label={`${item.title}. ${item.description}`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center shadow-lg">
                  <item.Icon className="text-white" size={40} aria-hidden="true" />
                </div>

                <h2 className="text-2xl font-black mb-3 uppercase tracking-wider text-white">{item.title}</h2>
                <p className="text-slate-300 text-sm leading-relaxed">{item.description}</p>

                <div className="mt-6 flex items-center justify-center gap-2 text-slate-100 text-sm font-bold">
                  {item.route === '/battle' && <Zap size={14} className="motion-safe:animate-pulse" aria-hidden="true" />}
                  {item.route === '/deck-builder' && <Crown size={14} className="motion-safe:animate-pulse" aria-hidden="true" />}
                  {item.route === '/collection' && <Shield size={14} className="motion-safe:animate-pulse" aria-hidden="true" />}
                  <span>{item.cta.toUpperCase()}</span>
                </div>
              </div>
            </button>
          ))}
        </section>

        <section aria-label="Game stats" className="mx-auto flex flex-wrap items-center justify-center gap-4">
          <StatBadge label="Cursed Cards" value="50+" />
          <StatBadge label="Rarity Tiers" value="4" tone="brand" />
          <StatBadge label="Strategies" value="∞" />
        </section>

        <p className="mt-ds8 text-center text-sm text-slate-300">
          <Skull className="mr-2 inline" size={14} aria-hidden="true" /> Built with passion • Inspired by Jujutsu Kaisen
        </p>
      </div>
    </main>
  );
}
