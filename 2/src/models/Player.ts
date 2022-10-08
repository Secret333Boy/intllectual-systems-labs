import Movable from '../interfaces/Movable';
import Labyrinth from './Labyrinth';
import PlayerMinimaxBehavior from './PlayerMinimaxBehavior';
import Position2D from './Position2D';
import Vertex from './Vertex';

export default class Player implements Movable {
  public isDead = false;

  constructor(
    private vertex: Vertex<Position2D>,
    private playerMinimaxBehavior: PlayerMinimaxBehavior,
    private labyrinth: Labyrinth
  ) {
    vertex.payload.player = this;
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
