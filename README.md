# Jujutsu Kaisen Card Game

A fully playable trading card game web application based on the popular Jujutsu Kaisen anime series. Built with modern web technologies and featuring strategic gameplay inspired by Yu-Gi-Oh mechanics. The runtime is frontend-only (Vite + React), with no bundled server API routes.

## 🎮 Game Features

### Core Gameplay
- **Turn-based Strategy**: Engage in tactical combat with phase-based gameplay
- **Card Types**: Creatures, Areas, Spells, and Ultimate abilities
- **Resource Management**: Energy and Ultimate Energy systems
- **Position Mechanics**: Front row and back row positioning
- **Effect System**: Unified effect resolution with triggers and conditions
- **Battle System**: Creature combat with damage calculation and overflow

### Game Systems
- **Deck Building**: Construct custom decks from the card library
- **Collection Browser**: Browse and filter all available cards
- **Multiplayer Ready**: Infrastructure for local and online play
- **Battle Log**: Complete game event tracking
- **AI Opponent**: Extensible AI system for single-player mode

### Technical Features
- **Modern Stack**: Vite, React 19, TypeScript, Tailwind CSS
- **Game Engine**: Robust TypeScript-based game logic
- **Effect System**: Unified effect resolution with structured data
- **Data Import**: CSV-based card data import and parsing
- **Image System**: Remote art with attribution tracking
- **Testing**: Comprehensive test suite for game mechanics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jjk-card-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:8080`


### One-click local launcher (Windows)

If you want to start the app by double-clicking a file on your PC:

1. Double-click `start-local.bat` in the project root.
2. It will:
   - install dependencies (only if `node_modules` is missing),
   - start the Vite dev server,
   - open `http://localhost:8080` in your default browser.

Keep the terminal window open while playing. Closing it will stop the server.

## 🎯 How to Play

### Basic Rules
- **Life Points**: Start with 2000 LP
- **Deck Size**: Minimum 40 cards
- **Starting Hand**: 5 cards
- **Energy Gain**: 1 energy per turn
- **Field Limit**: 5 creatures per side
- **Area Limit**: 1 area per side

### Turn Structure
1. **Start Phase**: Apply ongoing effects, check win conditions
2. **Draw Phase**: Draw 1 card
3. **Energy Phase**: Gain 1 energy
4. **Main Phase 1**: Play cards, use abilities
5. **Battle Phase**: Declare attacks and resolve combat
6. **Main Phase 2**: Additional play opportunities
7. **End Phase**: Apply end-of-turn effects

### Card Types

#### Creatures
- Main units with ATK and DEF stats
- Can attack during Battle Phase
- Can occupy front or back row
- Have unique abilities and ultimate moves

#### Areas
- Environment-altering cards
- One active area per side maximum
- Provide ongoing passive effects

#### Spells
- One-time effects and abilities
- Can be played during Main Phase
- Some have once-per-turn restrictions

#### Ultimates
- Powerful character-specific abilities
- Require ultimate energy to cast
- Often have dramatic game-altering effects

### Combat System
- **Attacks**: Creatures in front row can attack
- **Blocking**: Enemy creatures can block attacks
- **Damage**: ATK vs DEF, excess damage to player
- **Positioning**: Front row protects back row from direct attacks

## 🌐 GitHub Pages deployment

To ensure GitHub Pages always reflects your latest `main` changes:

- In repository **Settings → Pages**, set **Build and deployment** to **GitHub Actions** (not `Deploy from a branch`).
- Push to `main`; the `Deploy to GitHub Pages` workflow will build and publish the `dist` artifact.
- The workflow now writes `version.txt` into the deployed site so you can verify the live commit SHA quickly.

If your Pages site is a project site (`https://<user>.github.io/<repo>/`), the build uses an automatic base path derived from the repository name.

## 🛠️ Development

### Project Structure
```
src/
├── app/                    # Client app shell and routing
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
│   └── rules/            # Game rules
├── data/                 # Static data and migrations
└── utils/                # Utility functions
```


### Accessibility requirement for UI PRs

All pull requests that modify UI routes or components must include and complete the accessibility acceptance checklist in `docs/a11y-acceptance-checklist.md`.

### Key Components

#### Game Engine (`src/engine/`)
- **GameModel**: Central game state management
- **EffectEngine**: Unified effect resolution system
- **BattleResolver**: Combat logic and damage calculation
- **DataImporter**: CSV data import and parsing

#### Frontend Components
- **GameBoard**: Main game interface
- **CardComponent**: Individual card display
- **HandManager**: Player's hand management
- **FieldManager**: Field zones and creature display

### Adding New Cards

1. **Edit CSV**: Add new cards to `data/characters.csv`
2. **Update Schema**: Ensure all required fields are present
3. **Test**: Verify card works in-game
4. **Balance**: Adjust stats and costs as needed

### Card Data Format
```csv
Name,Variant,ATK,DEF,HP,Cost,Ultimate_Cost,Effect,Ultimate_Effect,Rarity,Faction
```

### Effect System
The game uses a structured effect system that supports:
- **Triggered Effects**: Activate on specific events
- **Activated Effects**: Require player activation
- **Passive Effects**: Always active
- **Continuous Effects**: Apply while conditions are met

## 🎨 Art and Assets

### Image System
- **Canonical store**: `public/images` is the single source of truth for character assets.
- **Docs sync**: run `npm run docs:images` (or `npm run build:docs`) to generate `docs/images` from `public/images` when publishing docs artifacts.
- **Remote URLs**: Cards use external image URLs
- **Attribution**: Source tracking and metadata
- **Fallbacks**: Graceful degradation for missing images
- **Manifest**: Centralized asset management

### Adding Art
1. **Find Images**: Source appropriate artwork
2. **Update CSV**: Add `artUrl`, `attribution`, and `sourceUrl` fields
3. **Test**: Verify images load correctly
4. **Comply**: Ensure proper licensing for public deployment

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Test Coverage
- **Game Engine**: Core mechanics and state management
- **Effect System**: Effect resolution and triggers
- **Combat System**: Damage calculation and battle logic
- **Data Import**: CSV parsing and validation
- **UI Components**: React component testing

## 📊 Balance and Design

### Power Budget
- **Cost Curve**: Lower cost cards should be less powerful
- **Rarity Tiers**: SSR > SR > R > C power progression
- **Synergy**: Cards should work well together within factions
- **Ultimate Balance**: High-impact abilities with appropriate costs

### Balance Guidelines
- **Creatures**: ATK/DEF ratio should be balanced
- **Spells**: Effects should match cost
- **Areas**: Should provide meaningful strategic advantages
- **Ultimates**: Should feel impactful but not game-breaking

## 🔧 Configuration

### Environment Variables
```env
NEXT_PUBLIC_IMAGE_BASE_URL=https://example.com/images
```

### Customization
- **Game Rules**: Modify in `src/engine/models/Game.ts`
- **Card Data**: Update in `data/characters.csv`
- **UI Styling**: Edit in `src/components/` and `src/styles/`
- **Game Phases**: Adjust in `src/engine/GameEngine.ts`

## 🚀 Deployment

### Build for Production
```bash
npm run build
npm run preview
```

### Vercel Deployment
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure environment variables
4. Deploy automatically

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

### Development Guidelines
1. **Follow TypeScript**: Use strict type checking
2. **Test Changes**: Write tests for new features
3. **Document Code**: Add JSDoc comments
4. **Style Guide**: Follow existing code style
5. **Game Balance**: Consider impact on game balance

### Pull Request Process
1. **Fork Repository**: Create your own fork
2. **Create Branch**: Work on feature branch
3. **Test Changes**: Ensure all tests pass
4. **Submit PR**: Detailed description of changes
5. **Review**: Address feedback and suggestions

## 📄 License

This project is for educational and demonstration purposes. Please ensure you have proper licensing for any artwork or assets used in public deployment.

## 🙏 Acknowledgments

- **Jujutsu Kaisen**: Original anime series and characters
- **Gege Akutami**: Creator of Jujutsu Kaisen
- **Dyad**: Development platform and tools
- **React Community**: For amazing libraries and tools
- **TCG Community**: For inspiration and game design insights

## 📞 Support

For issues, questions, or contributions:
- **GitHub Issues**: Report bugs and request features
- **Discussions**: Join community discussions
- **Documentation**: Check the wiki for detailed guides

---

**Built with ❤️ using Dyad, React, TypeScript, and Tailwind CSS**