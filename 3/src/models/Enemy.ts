import BehaviorStrategy from '../interfaces/BehaviorStrategy';
import Movable from '../interfaces/Movable';
import Position from '../interfaces/Position';
import Position2D from './Position2D';
import RandomEnemyBehavior from './RandomEnemyBehavior';
import Vertex from './Vertex';

export default class Enemy<P extends Position = Position2D> implements Movable {
  constructor(
    private behaviorStrategy: BehaviorStrategy<P>,
    private vertex: Vertex<P>
  ) {
    this.vertex.payload.enemy = this;
  }

  public makeMove() {
    const nextVertex = this.behaviorStrategy.getNextVertex(this.vertex);
    if (!nextVertex) return;
    if (nextVertex.payload.player) nextVertex.payload.player.isDead = true;
    nextVertex.payload.enemy = this;
    this.vertex.payload.enemy = undefined;
    this.vertex = nextVertex;
  }

  public makeUnsafeMove(vertex: Vertex<P>) {
    vertex.payload.enemy = this;
    this.vertex.payload.enemy = undefined;
    this.vertex = vertex;
  }

  public getPossibleMoves() {
    return this.vertex.getLinks();
  }

  public getVertex() {
    return this.vertex;
  }

  public hasRandomBehavior() {
    return this.behaviorStrategy instanceof RandomEnemyBehavior;
  }
}
