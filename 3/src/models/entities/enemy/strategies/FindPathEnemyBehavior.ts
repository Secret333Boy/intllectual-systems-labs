import EnemyBehaviorStrategy from '../../../../interfaces/EnemyBehaviorStrategy';
import Graph from '../../../data.structures/graph/Graph';
import Vertex from '../../../data.structures/graph/Vertex';
import Position2D from '../../../Position2D';
import Player from '../../player/Player';

export default class FindPathEnemyBehavior
  implements EnemyBehaviorStrategy<Position2D>
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
