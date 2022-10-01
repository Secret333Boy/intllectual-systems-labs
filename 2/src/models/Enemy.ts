import EnemyBehaviorStrategy from '../interfaces/EnemyBehaviorStrategy';
import Movable from '../interfaces/Movable';
import Position from '../interfaces/Position';
import Position2D from './Position2D';
import RandomEnemyBehavior from './RandomEnemyBehavior';
import Vertex from './Vertex';

export default class Enemy<P extends Position = Position2D> implements Movable {
  constructor(
    private behaviorStrategy: EnemyBehaviorStrategy<P>,
    private vertex: Vertex<P>
  ) {
    this.vertex.payload.enemy = this;
  }

  public makeMove() {
    const nextVertex = this.behaviorStrategy.getNextVertex(this.vertex);
    if (!nextVertex) {
      return;
    }

    nextVertex.payload.enemy = this;
    this.vertex.payload.enemy = undefined;
    this.vertex = nextVertex;
  }

  public getVertex() {
    return this.vertex;
  }

  public hasRandomBehavior() {
    return this.behaviorStrategy instanceof RandomEnemyBehavior;
  }
}
