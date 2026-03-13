import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const winner = (location.state as { winner?: number } | null)?.winner;

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <Card className="mx-auto mt-20 max-w-2xl border-slate-700 bg-slate-900 p-6">
        <h1 className="mb-2 text-3xl font-black">Results</h1>
        <p className="mb-6 text-slate-300">
          {winner === 0 ? 'Victory! You won the battle.' : winner === 1 ? 'Defeat. The cursed spirit prevailed.' : 'Battle complete.'}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate('/battle')}>Start battle</Button>
          <Button variant="outline" onClick={() => navigate('/deck-builder')}>Use this deck</Button>
          <Button variant="outline" onClick={() => navigate('/collection')}>Discover more cards</Button>
          <Button variant="outline" onClick={() => navigate('/')}>Back home</Button>
        </div>
      </Card>
    </main>
  );
}
