import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const V2Shell = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-surface-900 text-surface-100 flex flex-col">
      <header className="border-b border-surface-700 bg-surface-800/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-ds4 h-16 flex items-center justify-between">
          <h1 className="font-black tracking-wider">JJK Cursed Clash · v2</h1>
          <nav className="flex gap-2">
            <Button variant="ghost" onClick={() => navigate("/v2")}>Home</Button>
            <Button variant="ghost" onClick={() => navigate("/v2/battle")}>Battle</Button>
            <Button variant="ghost" onClick={() => navigate("/v2/deck-builder")}>Deck Builder</Button>
            <Button variant="ghost" onClick={() => navigate("/v2/collection")}>Collection</Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-surface-700 bg-surface-800/90 text-center text-surface-300 text-sm py-3">
        v2 migration route (parallel rollout)
      </footer>
    </div>
  );
};

export default V2Shell;
