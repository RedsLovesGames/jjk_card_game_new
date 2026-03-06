import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import DeckBuilder from "./pages/DeckBuilder";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/deck-builder" element={<DeckBuilder />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;