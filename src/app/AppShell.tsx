import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useGame } from "@/context/GameContext";
import { Button } from "@/components/design-system";

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

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Battle", path: "/battle" },
    { label: "Deck Builder", path: "/deck-builder" },
    { label: "Collection", path: "/collection" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      <a
        href="#main-content"
        className="sr-only z-[200] rounded-md bg-white px-4 py-2 text-slate-950 focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-black tracking-wider">JJK Cursed Clash</h1>
          <nav aria-label="Primary" className="flex gap-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                aria-current={location.pathname === item.path ? "page" : undefined}
                onClick={() => navigate(item.path)}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        </div>
      </header>
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="border-t border-slate-800 bg-slate-900/90 text-center text-slate-300 text-sm py-3">
        Cursed energy never sleeps.
      </footer>
    </div>
  );
};

export default AppShell;
