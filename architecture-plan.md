# JJK Card Game - Architecture Plan

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **UI Library**: shadcn/ui + Tailwind CSS
- **State Management**: Zustand for client state, React Query for server state
- **Routing**: React Router (already in base repo)
- **Real-time**: WebSocket for multiplayer (future)
- **Testing**: Jest + React Testing Library

### Backend/Game Engine
- **Framework**: Node.js/TypeScript (port Python engine)
- **Game State**: In-memory with persistence layer
- **API**: REST + WebSocket for real-time
- **Database**: PostgreSQL for persistence (SQLite for development)
- **ORM**: Prisma
- **Testing**: Jest

### Asset Management
- **Image System**: Remote URL-based with manifest
- **Fallback System**: Local placeholders
- **Attribution**: Metadata tracking
- **Caching**: CDN-friendly caching headers

## Project Structure

```
src/
├── app/                    # Next.js app router
├── components/             # React components
│   ├── game/              # Game-specific components
│   ├── ui/                # shadcn/ui components
│   └── common/            # Shared components
├── lib/                   # Utilities and helpers
├── types/                 # TypeScript definitions
├── hooks/                 # Custom React hooks
├── store/                 # State management
├── engine/                # Game engine logic
│   ├── models/           # Game data models
│   ├── effects/          # Effect system
│   ├── rules/            # Game rules
│   └── ai/               # AI logic
├── data/                 # Static data and migrations
├── api/                  # API routes
├── utils/                # Utility functions
└── styles/               # Global styles
```

## Core Components

### 1. Game Engine (`src/engine/`)
- **Game State Manager**: Central game state
- **Effect Engine**: Unified effect resolution
- **Card Factory**: Card creation and validation
- **Battle Resolver**: Combat logic
- **Turn Manager**: Turn structure and phases
- **Rule Validator**: Move legality checking

### 2. Data Models (`src/engine/models/`)
```typescript
interface Card {
  id: string;
  name: string;
  variant: string;
  type: 'creature' | 'area' | 'spell' | 'ultimate';
  subtype?: string;
  faction: string;
  cost: number;
  ultimateCost?: number;
  attack?: number;
  defense: number;
  health?: number;
  effect: string;
  ultimateEffect?: string;
  rarity: 'SSR' | 'SR' | 'R' | 'C';
  artUrl?: string;
  attribution?: string;
  sourceUrl?: string;
}

interface Player {
  id: string;
  name: string;
  life: number;
  energy: number;
  ultimateEnergy: number;
  deck: Card[];
  hand: Card[];
  field: Card[];
  graveyard: Card[];
  exile: Card[];
  area?: Card;
}

interface GameState {
  players: Player[];
  currentPlayer: number;
  turn: number;
  phase: 'start' | 'draw' | 'energy' | 'main1' | 'battle' | 'main2' | 'end';
  stack: Effect[];
  battleLog: string[];
}
```

### 3. Effect System (`src/engine/effects/`)
```typescript
interface Effect {
  id: string;
  type: 'triggered' | 'activated' | 'passive' | 'continuous';
  category: 'damage' | 'heal' | 'buff' | 'debuff' | 'summon' | 'destroy';
  trigger?: 'on_play' | 'on_attack' | 'on_damage' | 'on_destroy' | 'start_turn' | 'end_turn';
  cost?: number;
  target: TargetSelector;
  actions: Action[];
  duration?: number;
  oncePerTurn?: boolean;
  oncePerGame?: boolean;
}

interface TargetSelector {
  type: 'creature' | 'player' | 'card' | 'field';
  conditions: TargetCondition[];
  zone: 'hand' | 'field' | 'graveyard' | 'any';
  count: number;
}

interface Action {
  type: 'deal_damage' | 'heal' | 'buff_atk' | 'buff_def' | 'grant_status' | 'remove_status' | 'summon_token' | 'draw_cards' | 'gain_energy';
  value: number | string;
  target: TargetSelector;
}
```

### 4. Frontend Components
- **GameBoard**: Main game interface
- **HandManager**: Player's hand display
- **FieldManager**: Field zones and creatures
- **CardDetail**: Modal for card information
- **DeckBuilder**: Deck construction interface
- **CollectionBrowser**: Card library
- **BattleLog**: Game event log
- **EnergyDisplay**: Resource tracking
- **LifePointDisplay**: HP tracking

### 5. API Routes
- `/api/game` - Game state management
- `/api/cards` - Card data and search
- `/api/decks` - Deck management
- `/api/match` - Matchmaking and multiplayer
- `/api/health` - Health check

## Migration Strategy

### Phase 1: Core Infrastructure
1. Set up Next.js project structure
2. Implement basic data models
3. Create database schema
4. Build card import system
5. Implement basic game state

### Phase 2: Game Engine
1. Port Python game logic to TypeScript
2. Build unified effect system
3. Implement turn structure
4. Add combat resolution
5. Create test suite

### Phase 3: Frontend
1. Build game board UI
2. Implement card interactions
3. Add hand management
4. Create deck builder
5. Add collection browser

### Phase 4: Advanced Features
1. Add multiplayer support
2. Implement AI opponent
3. Add image/art system
4. Create balance tools
5. Add admin interface

### Phase 5: Polish & Testing
1. Comprehensive testing
2. Performance optimization
3. UI/UX improvements
4. Documentation
5. Deployment setup