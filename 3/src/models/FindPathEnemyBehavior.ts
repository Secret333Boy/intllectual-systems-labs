import BehaviorStrategy from '../interfaces/EnemyBehaviorStrategy';
import Graph from './Graph';
import Player from './Player';
import Position2D from './Position2D';
import Vertex from './Vertex';

export default class FindPathEnemyBehavior
  implements BehaviorStrategy<Position2D>
{
  constructor(private graph: Graph<Position2D>, private player: Player) {}

  public getNextVertex(vertex: Vertex<Position2D>) {
    try {
      const path = this.graph.findPath(
        vertex,
        this.player.getVertex(),
        (vertex) => vertex.hasEnemy()
      );
      if (path.length < 2) return;
      return path[1];
    } catch (e) {
      return;
    }
  }
}
