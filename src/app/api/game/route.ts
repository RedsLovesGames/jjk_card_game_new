import { NextRequest, NextResponse } from 'next/server';
import { GameEngine } from '@/engine/GameEngine';

// In-memory game storage for development
const games = new Map<string, GameEngine>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, gameId, ...data } = body;

    switch (action) {
      case 'create_game':
        const game = GameEngine.createNewGame(data.player1Name, data.player2Name);
        games.set(game.getId(), game);
        return NextResponse.json({ gameId: game.getId() });

      case 'start_game':
        const startGame = games.get(gameId);
        if (startGame) {
          startGame.startGame();
          return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });

      case 'next_phase':
        const nextPhaseGame = games.get(gameId);
        if (nextPhaseGame) {
          nextPhaseGame.nextPhase();
          return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });

      case 'play_card':
        const playCardGame = games.get(gameId);
        if (playCardGame) {
          const success = playCardGame.playCard(data.playerId, data.cardId);
          return NextResponse.json({ success });
        }
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });

      case 'use_ultimate':
        const useUltimateGame = games.get(gameId);
        if (useUltimateGame) {
          const success = useUltimateGame.useUltimate(data.playerId, data.cardId);
          return NextResponse.json({ success });
        }
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });

      case 'switch_position':
        const switchPositionGame = games.get(gameId);
        if (switchPositionGame) {
          const success = switchPositionGame.switchPosition(data.playerId, data.cardId);
          return NextResponse.json({ success });
        }
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });

      case 'resolve_combat':
        const resolveCombatGame = games.get(gameId);
        if (resolveCombatGame) {
          const result = resolveCombatGame.resolveCombat(data.attackerInstanceId, data.defenderInstanceId);
          return NextResponse.json({ result });
        }
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });

      case 'get_game_state':
        const getGameStateGame = games.get(gameId);
        if (getGameStateGame) {
          return NextResponse.json(getGameStateGame.getGameState());
        }
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });

      case 'get_battle_log':
        const getBattleLogGame = games.get(gameId);
        if (getBattleLogGame) {
          return NextResponse.json({ battleLog: getBattleLogGame.getBattleLog() });
        }
        return NextResponse.json({ error: 'Game not found' }, { status: 404 });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Game API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const gameId = searchParams.get('gameId');

  if (gameId) {
    const game = games.get(gameId);
    if (game) {
      return NextResponse.json(game.getGameState());
    }
    return NextResponse.json({ error: 'Game not found' }, { status: 404 });
  }

  return NextResponse.json({ games: Array.from(games.keys()) });
}