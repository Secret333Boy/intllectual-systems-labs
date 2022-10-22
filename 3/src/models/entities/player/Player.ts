import Movable from '../../../interfaces/Movable';
import PlayerBehaviorStrategy from '../../../interfaces/PlayerBehaviorStrategy';
import Vertex from '../../data.structures/graph/Vertex';
import Labyrinth from '../../Labyrinth';
import Position2D from '../../Position2D';
import PlayerNegamaxAlphaBetaBehavior from './strategies/PlayerNegamaxAlphaBetaBehavior';
import PlayerNegamaxBehavior from './strategies/PlayerNegamaxBehavior';

export default class Player implements Movable {
  public isDead = false;

  private playerMinimaxBehavior: PlayerBehaviorStrategy;

  constructor(
    private vertex: Vertex<Position2D>,
    private labyrinth: Labyrinth,
    useOptimizedNegamax = true
  ) {
    vertex.payload.player = this;
    this.playerMinimaxBehavior = useOptimizedNegamax
      ? new PlayerNegamaxAlphaBetaBehavior()
      : new PlayerNegamaxBehavior();
  }

  public makeMove() {
    const move = this.playerMinimaxBehavior.getNextVertex(this.labyrinth);
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
