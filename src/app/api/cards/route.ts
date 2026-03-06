import { NextRequest, NextResponse } from 'next/server';
import { DataImporter } from '@/data/importer';

const dataImporter = new DataImporter();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const type = searchParams.get('type');
    const faction = searchParams.get('faction');
    const rarity = searchParams.get('rarity');

    // Import cards if not already loaded
    if (!dataImporter.getCards().length) {
      dataImporter.importFromCSV();
    }

    let cards = dataImporter.getCards();

    // Apply filters
    if (name) {
      cards = cards.filter(card => 
        card.name.toLowerCase().includes(name.toLowerCase())
      );
    }

    if (type) {
      cards = cards.filter(card => card.type === type);
    }

    if (faction) {
      cards = cards.filter(card => 
        card.faction.toLowerCase().includes(faction.toLowerCase())
      );
    }

    if (rarity) {
      cards = cards.filter(card => card.rarity === rarity.toUpperCase());
    }

    return NextResponse.json({
      cards,
      total: cards.length,
      filters: { name, type, faction, rarity }
    });
  } catch (error) {
    console.error('Cards API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}