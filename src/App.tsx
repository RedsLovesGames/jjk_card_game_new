import { Toaster } from "@/components/design-system";
import { Toaster as Sonner } from "@/components/design-system";
import { TooltipProvider } from "@/components/design-system";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { GameProvider } from "./context/GameContext";
import { DeckProvider } from "./context/DeckContext";
import { router } from "./app/router";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DeckProvider>
        <GameProvider>
          <Toaster />
          <Sonner />
          <RouterProvider router={router} />
        </GameProvider>
      </DeckProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
