import { Card as GameCard } from '@/types/game';
import { Button } from '@/components/design-system';
import { Input } from '@/components/design-system';
import { ScrollArea } from '@/components/design-system';
import { CardFrame, FilterBar, GlassPanel } from '@/components/design-system';
import { Plus } from 'lucide-react';

interface DeckBuilderLibraryPanelProps {
  filteredLibrary: GameCard[];
  search: string;
  typeFilter: string;
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onAddCard: (card: GameCard) => void;
}

export function DeckBuilderLibraryPanel({
  filteredLibrary,
  search,
  typeFilter,
  onSearchChange,
  onTypeFilterChange,
  onAddCard,
}: DeckBuilderLibraryPanelProps) {
  return (
    <section aria-label="Card library">
      <GlassPanel className="p-ds4">
        <FilterBar className="mb-ds4 p-0 border-0 bg-transparent shadow-none">
          <Input
            aria-label="Search library cards"
            placeholder="Search cards..."
            value={search}
            onChange={event => onSearchChange(event.target.value)}
            className="bg-slate-800 border-slate-700"
          />
          <select
            aria-label="Filter cards by type"
            value={typeFilter}
            onChange={event => onTypeFilterChange(event.target.value)}
            className="rounded-md border border-slate-700 bg-slate-800 px-3 text-sm"
          >
            <option value="all">All Types</option>
            <option value="creature">Creature</option>
            <option value="spell">Spell</option>
            <option value="area">Area</option>
            <option value="ultimate">Ultimate</option>
          </select>
        </FilterBar>

        <ScrollArea className="h-[62vh]">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            {filteredLibrary.map(card => (
              <CardFrame key={card.id} className="p-2">
                <h3 className="mb-1 truncate text-xs font-bold">{card.name}</h3>
                <p className="mb-2 text-[10px] text-slate-300">
                  {card.type} | Cost: {card.cost}
                </p>
                <Button
                  size="sm"
                  className="h-6 w-full text-xs"
                  onClick={() => onAddCard(card)}
                  aria-label={`Add ${card.name} to deck`}
                >
                  <Plus size={12} />
                </Button>
              </CardFrame>
            ))}
          </div>
        </ScrollArea>
      </GlassPanel>
    </section>
  );
}
