import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useGame } from '@/context/GameContext';
import { useDeck } from '@/context/DeckContext';
import { toast } from 'sonner';
import { TutorialOverlay } from '@/components/TutorialOverlay';

export default function BattleScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { startGame } = useGame();
  const { activeDeck, savedDecks, isDeckValid } = useDeck();
  const [loading, setLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const requestedDeckMode = params.get('mode') === 'deck';
  const hasValidActiveDeck = !!activeDeck && isDeckValid(activeDeck.cards);
  const [battleType, setBattleType] = useState<'quick' | 'deck'>(requestedDeckMode ? 'deck' : 'quick');

  const canStartDeckBattle = useMemo(() => hasValidActiveDeck, [hasValidActiveDeck]);

  const startBattle = async () => {
    if (battleType === 'deck' && !canStartDeckBattle) {
      toast.error('Choose or build a valid deck before starting deck battle.');
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 400));
    startGame('Sorcerer', 'Cursed Spirit');
    navigate('/game');
  };

  if (requestedDeckMode && !canStartDeckBattle) {
    return (
      <main className="min-h-screen bg-slate-950 p-6 text-white">
        <Card className="mx-auto mt-20 max-w-xl border-amber-500/40 bg-slate-900 p-6">
          <h1 className="mb-2 text-2xl font-bold">No valid deck selected</h1>
          <p className="mb-4 text-slate-300">You attempted a deck battle, but there is no active valid deck yet.</p>
          <div className="flex gap-2">
            <Button onClick={() => navigate('/deck-builder')}>Build a deck</Button>
            <Button variant="outline" onClick={() => navigate('/battle')}>Switch to quick battle</Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <TutorialOverlay
        pageKey="battle"
        title="Battle Tips"
        steps={[
          'Pick Quick Battle for instant play.',
          'Pick Deck Battle to use your active saved deck.',
          'Use Start battle when your choice is valid.',
        ]}
      />
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black">Battle</h1>
        <p className="mb-4 text-slate-300">Play with quick mode or your saved deck.</p>

        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <Card className={`border p-4 ${battleType === 'quick' ? 'border-red-500' : 'border-slate-700'} bg-slate-900`}>
            <h2 className="text-xl font-bold">Quick Battle</h2>
            <p className="mb-3 text-sm text-slate-300">Use the default starter deck.</p>
            <Button variant={battleType === 'quick' ? 'default' : 'outline'} onClick={() => setBattleType('quick')}>Choose quick battle</Button>
          </Card>
          <Card className={`border p-4 ${battleType === 'deck' ? 'border-emerald-500' : 'border-slate-700'} bg-slate-900`}>
            <h2 className="text-xl font-bold">Deck Battle</h2>
            <p className="mb-3 text-sm text-slate-300">Use your active deck: {activeDeck?.name ?? 'None selected'}</p>
            <Button variant={battleType === 'deck' ? 'default' : 'outline'} onClick={() => setBattleType('deck')}>Choose deck battle</Button>
            {!canStartDeckBattle && <p className="mt-2 text-xs text-amber-300">Need a valid active deck (40+ cards). Saved decks: {savedDecks.length}</p>}
          </Card>
        </div>

        <div className="flex gap-2">
          <Button disabled={loading || (battleType === 'deck' && !canStartDeckBattle)} onClick={startBattle}>Start battle</Button>
          <Button variant="outline" onClick={() => navigate('/deck-builder')}>Use this deck</Button>
          <Button variant="outline" onClick={() => navigate('/')}>Home</Button>
        </div>
      </div>
    </main>
  );
}
