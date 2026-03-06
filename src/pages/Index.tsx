"use client";

import React, { useState } from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Layout, Play } from 'lucide-react';

export default function Index() {
  const [gameStarted, setGameStarted] = useState(false);

  if (gameStarted) {
    return <GameBoard gameId="demo-game" />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black mb-4 tracking-tighter bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-500 bg-clip-text text-transparent">
            JJK: CURSED CLASH
          </h1>
          <p className="text-xl text-slate-400">
            Master the art of Jujutsu in this strategic card battler.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-slate-900 border-slate-800 p-6 text-center hover:border-purple-500 transition-all cursor-pointer group" onClick={() => setGameStarted(true)}>
            <Play className="mx-auto mb-4 text-purple-500 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-bold mb-2">Quick Play</h3>
            <p className="text-sm text-slate-400">Jump into a battle against the AI.</p>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-6 text-center hover:border-blue-500 transition-all cursor-pointer group" onClick={() => window.location.href = '/deck-builder'}>
            <Layout className="mx-auto mb-4 text-blue-500 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-bold mb-2">Deck Builder</h3>
            <p className="text-sm text-slate-400">Construct your ultimate sorcerer team.</p>
          </Card>

          <Card className="bg-slate-900 border-slate-800 p-6 text-center hover:border-indigo-500 transition-all cursor-pointer group" onClick={() => window.location.href = '/collection'}>
            <BookOpen className="mx-auto mb-4 text-indigo-500 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-bold mb-2">Collection</h3>
            <p className="text-sm text-slate-400">Browse all available cursed techniques.</p>
          </Card>
        </div>

        <div className="text-center text-slate-500 text-sm">
          Built with Dyad • Inspired by Jujutsu Kaisen
        </div>
      </div>
    </div>
  );
}