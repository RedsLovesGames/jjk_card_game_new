"use client";

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Layout, Play, Sparkles, Zap, Skull, Swords, Shield, Crown } from 'lucide-react';

export default function Index() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();

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

        {/* Main Menu Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16 max-w-5xl w-full">
          {/* Quick Play */}
          <Card 
            className={`
              group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 
              border border-slate-800/50 backdrop-blur-xl overflow-hidden
              hover:border-red-500/50 hover:shadow-[0_0_40px_rgba(239,68,68,0.3)]
              transition-all duration-500 cursor-pointer
              hover:scale-105 hover:-translate-y-2
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '0.2s' }}
            onClick={() => navigate('/battle')}
          >
            {/* Card glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-lg shadow-red-600/30 group-hover:scale-110 transition-transform duration-300">
                <Swords className="text-white" size={40} />
              </div>
              
              <h3 className="text-2xl font-black mb-3 uppercase tracking-wider text-white group-hover:text-red-400 transition-colors">
                Quick Play
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Jump into an intense battle against the AI. Feel the thrill of cursed energy combat!
              </p>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-red-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <Zap size={14} className="animate-pulse" />
                <span>START BATTLE</span>
              </div>
            </div>
          </Card>

          {/* Deck Builder */}
          <Card 
            className={`
              group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 
              border border-slate-800/50 backdrop-blur-xl overflow-hidden
              hover:border-purple-500/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]
              transition-all duration-500 cursor-pointer
              hover:scale-105 hover:-translate-y-2
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '0.4s' }}
            onClick={() => navigate('/deck-builder')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-purple-600/30 group-hover:scale-110 transition-transform duration-300">
                <Layout className="text-white" size={40} />
              </div>
              
              <h3 className="text-2xl font-black mb-3 uppercase tracking-wider text-white group-hover:text-purple-400 transition-colors">
                Deck Builder
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Craft your ultimate sorcerer team. Combine techniques and dominate the arena!
              </p>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-purple-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <Crown size={14} className="animate-pulse" />
                <span>BUILD DECK</span>
              </div>
            </div>
          </Card>

          {/* Collection */}
          <Card 
            className={`
              group relative bg-gradient-to-br from-slate-900/80 to-slate-950/80 
              border border-slate-800/50 backdrop-blur-xl overflow-hidden
              hover:border-blue-500/50 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]
              transition-all duration-500 cursor-pointer
              hover:scale-105 hover:-translate-y-2
              ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
            style={{ transitionDelay: '0.6s' }}
            onClick={() => navigate('/collection')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-800 flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="text-white" size={40} />
              </div>
              
              <h3 className="text-2xl font-black mb-3 uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                Collection
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Explore all available cursed techniques. Discover powerful abilities!
              </p>
              
              <div className="mt-6 flex items-center justify-center gap-2 text-blue-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                <Shield size={14} className="animate-pulse" />
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
