import { Card } from '@/types/game';
import fs from 'fs';
import path from 'path';

export class DataImporter {
  private cards: Card[] = [];

  importFromCSV(): Card[] {
    try {
      // Read characters.csv
      const csvPath = path.join(process.cwd(), 'data', 'characters.csv');
      const csvData = fs.readFileSync(csvPath, 'utf8');
      
      const lines = csvData.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= headers.length) {
          const card = this.parseCSVRow(headers, values);
          if (card) {
            this.cards.push(card);
          }
        }
      }

      return this.cards;
    } catch (error) {
      console.error('Error importing CSV data:', error);
      return [];
    }
  }

  private parseCSVRow(headers: string[], values: string[]): Card | null {
    try {
      const card: any = {};
      
      headers.forEach((header, index) => {
        const value = values[index] || '';
        
        switch (header.toLowerCase()) {
          case 'name':
            card.name = value;
            break;
          case 'variant':
            card.variant = value;
            break;
          case 'atk':
            card.attack = parseInt(value) || 0;
            break;
          case 'def':
            card.defense = parseInt(value) || 0;
            break;
          case 'hp':
            card.health = parseInt(value) || 0;
            break;
          case 'cost':
            card.cost = parseInt(value) || 0;
            break;
          case 'ultimate_cost':
            card.ultimateCost = parseInt(value) || 0;
            break;
          case 'effect':
            card.effect = value;
            break;
          case 'ultimate_effect':
            card.ultimateEffect = value;
            break;
          case 'rarity':
            card.rarity = value.toUpperCase() as 'SSR' | 'SR' | 'R' | 'C';
            break;
          case 'faction':
            card.faction = value;
            break;
          default:
            card[header.toLowerCase()] = value;
        }
      });

      // Set default values and validate
      card.id = this.generateId(card.name, card.variant);
      card.type = this.determineCardType(card);
      card.defense = card.defense || 0;
      card.cost = card.cost || 0;
      card.rarity = card.rarity || 'R';
      card.faction = card.faction || 'Unknown';

      // Parse effect text into structured data
      card.parsedEffect = this.parseEffectText(card.effect);
      card.parsedUltimateEffect = this.parseEffectText(card.ultimateEffect);

      return card as Card;
    } catch (error) {
      console.error('Error parsing CSV row:', error);
      return null;
    }
  }

  private generateId(name: string, variant: string): string {
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    const cleanVariant = variant.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
    return `${cleanName}-${cleanVariant}`;
  }

  private determineCardType(card: any): 'creature' | 'area' | 'spell' | 'ultimate' {
    if (card.attack && card.defense) {
      return 'creature';
    }
    
    if (card.name?.toLowerCase().includes('area') || 
        card.name?.toLowerCase().includes('domain') ||
        card.name?.toLowerCase().includes('incident')) {
      return 'area';
    }
    
    if (card.ultimateEffect) {
      return 'ultimate';
    }
    
    return 'spell';
  }

  private parseEffectText(effectText: string): any {
    if (!effectText) return null;

    // Basic parsing - this will be expanded
    const parsed: any = {
      text: effectText,
      type: 'basic',
      actions: [],
      triggers: [],
      conditions: []
    };

    // Parse common keywords
    const keywords = [
      'deal damage', 'heal', 'buff', 'stun', 'destroy', 'summon', 
      'draw', 'energy', 'cannot', 'once per turn', 'once per game'
    ];

    keywords.forEach(keyword => {
      if (effectText.toLowerCase().includes(keyword)) {
        parsed.keywords = parsed.keywords || [];
        if (!parsed.keywords.includes(keyword)) {
          parsed.keywords.push(keyword);
        }
      }
    });

    // Parse damage values
    const damageMatch = effectText.match(/(\d+)\s*damage/i);
    if (damageMatch) {
      parsed.actions.push({
        type: 'deal_damage',
        value: parseInt(damageMatch[1])
      });
    }

    // Parse heal values
    const healMatch = effectText.match(/heal\s*(\d+)/i);
    if (healMatch) {
      parsed.actions.push({
        type: 'heal',
        value: parseInt(healMatch[1])
      });
    }

    // Parse cost
    const costMatch = effectText.match(/costs?\s*(\d+)/i);
    if (costMatch) {
      parsed.cost = parseInt(costMatch[1]);
    }

    // Parse restrictions
    if (effectText.toLowerCase().includes('cannot attack')) {
      parsed.restrictions = parsed.restrictions || [];
      parsed.restrictions.push('cannot_attack');
    }

    if (effectText.toLowerCase().includes('cannot move')) {
      parsed.restrictions = parsed.restrictions || [];
      parsed.restrictions.push('cannot_move');
    }

    if (effectText.toLowerCase().includes('once per turn')) {
      parsed.oncePerTurn = true;
    }

    if (effectText.toLowerCase().includes('once per game')) {
      parsed.oncePerGame = true;
    }

    return parsed;
  }

  getCards(): Card[] {
    return this.cards;
  }

  exportToJSON(): string {
    return JSON.stringify(this.cards, null, 2);
  }

  saveToFile(filePath: string): void {
    fs.writeFileSync(filePath, this.exportToJSON(), 'utf8');
  }
}