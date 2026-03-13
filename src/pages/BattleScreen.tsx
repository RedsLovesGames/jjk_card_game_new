import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Play, Sparkles } from 'lucide-react';
import { Button } from '@/components/design-system';
import { Card } from '@/components/design-system';
import { useDeck } from '@/context/DeckContext';
import { useGame } from '@/context/GameContext';

export default function BattleScreen() {
  const navigate = useNavigate();
  const { savedDecks, activeDeck } = useDeck();
  const { startGame } = useGame();

  const [loading, setLoading] = useState(false);
  const [battleType, setBattleType] = useState<'quick' | 'deck'>(() => (activeDeck ? 'deck' : 'quick'));

  const canStartDeckBattle = battleType === 'deck' ? !!activeDeck : true;

  const selectedDeckName = useMemo(() => {
    if (battleType !== 'deck') {
      return 'Default starter deck';
    }

    return activeDeck?.name ?? 'No active deck';
  }, [activeDeck, battleType]);

  const handleStartBattle = async () => {
    if (!canStartDeckBattle) {
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    startGame('Sorcerer', 'Cursed Spirit');
    navigate('/game');
  };

  return (
    <main className="min-h-screen bg-slate-950 p-6 text-white">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <Button variant="ghost" className="w-fit" onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2" size={16} /> Back
        </Button>

        <Card className="border-slate-700 bg-slate-900 p-6">
          <h1 className="text-2xl font-bold">Battle Arena</h1>
          <p className="mt-2 text-slate-300">Choose your battle type, then start the duel.</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setBattleType('quick')}
              className={`rounded-lg border p-4 text-left ${battleType === 'quick' ? 'border-red-500 bg-red-500/10' : 'border-slate-700 bg-slate-950'}`}
            >
              <h2 className="font-semibold">Quick Battle</h2>
              <p className="text-sm text-slate-300">Start immediately with a default deck.</p>
            </button>

            <button
              type="button"
              onClick={() => setBattleType('deck')}
              className={`rounded-lg border p-4 text-left ${battleType === 'deck' ? 'border-green-500 bg-green-500/10' : 'border-slate-700 bg-slate-950'}`}
            >
              <h2 className="font-semibold">Deck Battle</h2>
              <p className="text-sm text-slate-300">Use your active saved deck.</p>
            </button>
          </div>

          <div className="mt-6 rounded-lg border border-slate-700 bg-slate-950 p-4 text-sm text-slate-200">
            <p>Selected mode: <span className="font-semibold">{battleType}</span></p>
            <p>Deck: <span className="font-semibold">{selectedDeckName}</span></p>
            {battleType === 'deck' && !activeDeck && (
              <p className="mt-2 text-amber-300">No active deck. Create/select one in Deck Builder first.</p>
            )}
            {battleType === 'deck' && activeDeck && (
              <p className="mt-2 text-slate-300">Cards: {activeDeck.cards.length}</p>
            )}
            <p className="mt-2 text-slate-400">Saved decks: {savedDecks.length}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={handleStartBattle} disabled={loading || !canStartDeckBattle}>
              {loading ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Play className="mr-2" size={16} />}
              {loading ? 'Starting...' : 'Start Battle'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/deck-builder')}>
              <Sparkles className="mr-2" size={16} /> Open Deck Builder
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
