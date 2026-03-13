import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/ui/button";

const AppShell = () => {
  const { gameState } = useGame();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (gameState && location.pathname !== "/game") {
      navigate("/game", { replace: true });
      return;
    }

    if (!gameState && location.pathname === "/game") {
      navigate("/", { replace: true });
    }
  }, [gameState, location.pathname, navigate]);

  const isGameRoute = location.pathname === "/game";

  if (isGameRoute) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-black tracking-wider">JJK Cursed Clash</h1>
          <nav className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/")}>Home</Button>
            <Button variant="ghost" onClick={() => navigate("/battle")}>Battle</Button>
            <Button variant="ghost" onClick={() => navigate("/deck-builder")}>Deck Builder</Button>
            <Button variant="ghost" onClick={() => navigate("/collection")}>Collection</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 bg-slate-900/90 text-center text-slate-400 text-sm py-3">
        Cursed energy never sleeps.
      </footer>
    </div>
  );
};

export default AppShell;
