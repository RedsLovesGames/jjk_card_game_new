import { Card as GameCard } from '@/types/game';
import { Badge } from '@/components/design-system';
import { Button } from '@/components/design-system';
import { Input } from '@/components/design-system';
import { ScrollArea } from '@/components/design-system';
import { GlassPanel, StatBadge } from '@/components/design-system';
import { Loader2, Sparkles, Trash2 } from 'lucide-react';

interface DeckBuilderStatsPanelProps {
  deckName: string;
  deck: GameCard[];
  deckStats: {
    creatures: number;
    spells: number;
    avgCost: string;
  };
  optimizing: boolean;
  canOptimize: boolean;
  onDeckNameChange: (value: string) => void;
  onAutoOptimize: () => void;
  onRemoveCard: (index: number) => void;
}

export function DeckBuilderStatsPanel({
  deckName,
  deck,
  deckStats,
  optimizing,
  canOptimize,
  onDeckNameChange,
  onAutoOptimize,
  onRemoveCard,
}: DeckBuilderStatsPanelProps) {
  return (
    <aside aria-label="Current deck">
      <GlassPanel className="p-ds4">
        <Input
          aria-label="Deck name"
          value={deckName}
          onChange={event => onDeckNameChange(event.target.value)}
          className="mb-ds4 bg-slate-800 border-slate-700"
        />
        <Button
          onClick={onAutoOptimize}
          disabled={optimizing || !canOptimize}
          className="mb-ds4 w-full bg-gradient-to-r from-blue-600 to-brand-600"
        >
          {optimizing ? <Loader2 className="mr-2 motion-safe:animate-spin" size={16} /> : <Sparkles className="mr-2" size={16} />}
          Auto Optimize
        </Button>
        <section aria-label="Deck stats" className="mb-ds4 grid grid-cols-2 gap-2">
          <StatBadge label="Cards" value={`${deck.length}/60`} tone={deck.length >= 40 ? 'success' : 'danger'} />
          <StatBadge label="Avg Cost" value={deckStats.avgCost} tone="brand" />
          <StatBadge label="Creatures" value={deckStats.creatures} />
          <StatBadge label="Spells" value={deckStats.spells} />
        </section>
        <ScrollArea className="h-[45vh]">
          <div className="space-y-1">
            {deck.map((card, index) => (
              <div key={`${card.id}-${index}`} className="flex items-center justify-between rounded-ds bg-surface-700 p-2 text-xs">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="h-5 text-[8px]">{card.cost}</Badge>
                  {card.name}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5"
                  onClick={() => onRemoveCard(index)}
                  aria-label={`Remove ${card.name} from deck`}
                >
                  <Trash2 size={12} />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </GlassPanel>
    </aside>
  );
}
