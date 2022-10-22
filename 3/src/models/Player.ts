import MinimaxProvider from '../interfaces/MinimaxProvider';
import Movable from '../interfaces/Movable';
import Labyrinth from './Labyrinth';
import PlayerMinimaxAlphaBetaBehavior from './PlayerMinimaxAlphaBetaBehavior';
import PlayerMinimaxBehavior from './PlayerMinimaxBehavior';
import Position2D from './Position2D';
import Vertex from './Vertex';

export default class Player implements Movable {
  public isDead = false;

  private playerMinimaxBehavior: MinimaxProvider;

  constructor(
    private vertex: Vertex<Position2D>,
    private labyrinth: Labyrinth,
    useOptimizedMinimax = true
  ) {
    vertex.payload.player = this;
    this.playerMinimaxBehavior = useOptimizedMinimax
      ? new PlayerMinimaxAlphaBetaBehavior()
      : new PlayerMinimaxBehavior();
  }

  public makeMove() {
    const { move } = this.playerMinimaxBehavior.minimax({
      move: undefined,
      state: this.labyrinth,
    });
    if (!move) return;

    move.payload.player = this;
    this.vertex.payload.player = undefined;
    this.vertex = move;
  }

  public makeUnsafeMove(vertex: Vertex<Position2D>) {
    this.vertex.payload.player = undefined;
    vertex.payload.player = this;
    this.vertex = vertex;
  }

  public getVertex() {
    return this.vertex;
  }
}
