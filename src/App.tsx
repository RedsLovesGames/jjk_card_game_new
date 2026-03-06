import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
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
  
  if (gameState) {
    return <GameBoard />;
  }
  
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/deck-builder" element={<DeckBuilder />} />
        <Route path="/battle" element={<BattleScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
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