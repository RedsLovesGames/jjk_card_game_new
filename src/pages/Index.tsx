"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { BookOpen, Layout, Sparkles, Zap, Skull, Swords, Shield, Crown } from 'lucide-react';
import { HeroSection, StatBadge } from '@/components/design-system';
import { useMotionTier } from '@/hooks/use-motion-tier';
import { createDeterministicParticles } from '@/lib/visual-effects';

export default function Index() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const motionTier = useMotionTier();
  const isReducedMotion = motionTier === 'reduced';
  const particles = useMemo(() => createDeterministicParticles('index-hero', isReducedMotion ? 0 : 14), [isReducedMotion]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cardClassName = `
    group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 
    border border-slate-800/50 overflow-hidden
    transition-all duration-500 cursor-pointer
    ${isReducedMotion ? '' : 'backdrop-blur-xl hover:scale-105 hover:-translate-y-2'}
  `;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-brand-900/30 to-surface-900" />
      {!isReducedMotion && particles.map((particle, index) => (
        <span
          key={`${particle.x}-${particle.y}-${index}`}
          className="absolute rounded-full bg-white/60 animate-pulse"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delayMs}ms`,
            animationDuration: `${particle.durationMs}ms`,
            opacity: particle.opacity,
          }}
        />
      ))}

      <div className="relative z-raised mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-4 py-ds10 transition-all duration-slow">
        <HeroSection title={<><span>JJK</span><br /><span>CURSED CLASH</span></>} subtitle="Jujutsu Kaisen Card Battler">
          <div className="mt-ds4 flex items-center justify-center gap-3 text-yellow-400">
            <Sparkles size={18} />
            <Sparkles size={18} />
          </div>
        </HeroSection>

        <div className="mb-16 grid w-full max-w-5xl gap-6 md:grid-cols-3">
          <Card
            className={`${cardClassName} hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(239,68,68,0.3)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '0.2s' }}
            onClick={() => navigate('/battle')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-red-800 shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform duration-300">
                <Swords className="text-white" size={40} />
              </div>
              <h3 className="mb-3 text-2xl font-black uppercase tracking-wider text-white group-hover:text-red-400 transition-colors">Quick Play</h3>
              <p className="text-sm leading-relaxed text-slate-400">Jump into an intense battle against the AI. Feel the thrill of cursed energy combat!</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap size={14} className={isReducedMotion ? '' : 'animate-pulse'} />
                <span>START BATTLE</span>
              </div>
            </div>
          </Card>

          <Card
            className={`${cardClassName} hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '0.4s' }}
            onClick={() => navigate('/deck-builder')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform duration-300">
                <Layout className="text-white" size={40} />
              </div>
              <h3 className="mb-3 text-2xl font-black uppercase tracking-wider text-white group-hover:text-purple-400 transition-colors">Deck Builder</h3>
              <p className="text-sm leading-relaxed text-slate-400">Craft your ultimate sorcerer team. Combine techniques and dominate the arena!</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Crown size={14} className={isReducedMotion ? '' : 'animate-pulse'} />
                <span>BUILD DECK</span>
              </div>
            </div>
          </Card>

          <Card
            className={`${cardClassName} hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)] ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '0.6s' }}
            onClick={() => navigate('/collection')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative p-8 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-800 shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="text-white" size={40} />
              </div>
              <h3 className="mb-3 text-2xl font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">Collection</h3>
              <p className="text-sm leading-relaxed text-slate-400">Explore all available cursed techniques. Discover powerful abilities!</p>
              <div className="mt-6 flex items-center justify-center gap-2 text-sm font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                <Shield size={14} className={isReducedMotion ? '' : 'animate-pulse'} />
                <span>BROWSE CARDS</span>
              </div>
            </div>
          </Card>
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
