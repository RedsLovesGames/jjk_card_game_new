"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Layout, Play, Sparkles, Zap, Skull, Swords, Shield, Crown } from 'lucide-react';

export default function Index() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950" />
        
        {/* Animated orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Animated scan lines */}
        <div className="absolute inset-0 animate-scan bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/50 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className={`relative z-10 min-h-screen flex flex-col items-center justify-center p-4 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        {/* Logo / Title */}
        <div className="text-center mb-16 relative">
          {/* Glow effect behind title */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] bg-purple-600/30 blur-[80px] rounded-full" />
          
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter relative mb-4">
            <span className="bg-gradient-to-r from-red-500 via-white to-purple-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              JJK
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient" style={{ animationDelay: '0.5s' }}>
              CURSED
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient" style={{ animationDelay: '1s' }}>
              CLASH
            </span>
          </h1>
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <Sparkles className="text-yellow-400 animate-pulse" size={20} />
            <p className="text-xl md:text-2xl text-slate-300 font-light tracking-[0.3em] uppercase">
              Jujutsu Kaisen Card Battler
            </p>
            <Sparkles className="text-yellow-400 animate-pulse" size={20} />
          </div>
        </div>

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
            onClick={() => window.location.hash = '#/battle'}
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
            onClick={() => window.location.hash = '#/deck-builder'}
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
            onClick={() => window.location.hash = '#/collection'}
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

        {/* Stats Banner */}
        <div className={`
          flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center
          ${mounted ? 'opacity-100' : 'opacity-0'}
          transition-opacity duration-1000 delay-700
        `}>
          <div>
            <div className="text-3xl font-black text-white">50+</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Cursed Cards</div>
          </div>
          <div className="w-px h-12 bg-slate-800" />
          <div>
            <div className="text-3xl font-black text-white">4</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Rarity Tiers</div>
          </div>
          <div className="w-px h-12 bg-slate-800" />
          <div>
            <div className="text-3xl font-black text-white">∞</div>
            <div className="text-xs text-slate-500 uppercase tracking-widest">Strategies</div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-slate-600 text-sm">
            <Skull className="inline mr-2" size={14} />
            Built with passion • Inspired by Jujutsu Kaisen
          </p>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
        }
        
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes gradient {
          0% { background-position: 0% center; }
          50% { background-position: 100% center; }
          100% { background-position: 0% center; }
        }
        
        .animate-float {
          animation: float 8s infinite linear;
        }
        
        .animate-scan {
          animation: scan 8s infinite linear;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
      `}</style>
    </div>
  );
}