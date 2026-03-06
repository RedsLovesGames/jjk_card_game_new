"use client";

import React, { useState, useEffect } from 'react';
import { GameBoard } from '@/components/game/GameBoard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Index() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameId, setGameId] = useState<string>('');

  const startNewGame = () => {
    setGameStarted(true);
    setGameId('demo-game-123');
  };

  if (gameStarted) {
    return <GameBoard gameId={gameId} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Jujutsu Kaisen Card Game
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            A strategic trading card game based on the popular anime series
          </p>
        </div>

        {/* Game Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="p-6 text-center">
              <div className="text-3xl mb-4">⚔️</div>
              <h3 className="text-xl font-bold text-white mb-2">Epic Battles</h3>
              <p className="text-gray-300">
                Engage in strategic combat with your favorite Jujutsu Kaisen characters
              </p>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="p-6 text-center">
              <div className="text-3xl mb-4">🎴</div>
              <h3 className="text-xl font-bold text-white mb-2">Card Collection</h3>
              <p className="text-gray-300">
                Collect and build decks with hundreds of cards featuring unique abilities
              </p>
            </div>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <div className="p-6 text-center">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Strategic Gameplay</h3>
              <p className="text-gray-300">
                Master deep mechanics including ultimates, areas, and tactical positioning
              </p>
            </div>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button 
            onClick={startNewGame}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 text-lg"
            size="lg"
          >
            Start New Game
          </Button>
          <p className="text-gray-400 mt-4">
            Experience the ultimate Jujutsu Kaisen card game
          </p>
        </div>

        {/* Made with Dyad */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Built with Dyad • React • TypeScript • Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}