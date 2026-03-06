import { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { GameProvider, useGame } from "./context/GameContext";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import DeckBuilder from "./pages/DeckBuilder";
import BattleScreen from "./pages/BattleScreen";
import NotFound from "./pages/NotFound";
import { GameBoard } from "./components/game/GameBoard";

const queryClient = new QueryClient();

const AppContent = () => {
  const { gameState } = useGame();
  const [hash, setHash] = useState<string | null>(null);
  
  // Listen for hash changes
  useEffect(() => {
    // Set initial hash
    setHash(window.location.hash || '#/');
    
    const handleHash = () => {
      setHash(window.location.hash || '#/');
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);
  
  // Show loading until we have hash
  if (hash === null) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }
  
  // Show game if gameState exists
  if (gameState) {
    return <GameBoard />;
  }
  
  // Otherwise show route
  if (hash.startsWith('#/battle')) {
    return <BattleScreen />;
  }
  if (hash.startsWith('#/collection')) {
    return <Collection />;
  }
  if (hash.startsWith('#/deck-builder')) {
    return <DeckBuilder />;
  }
  return <Index />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <AppContent />
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;