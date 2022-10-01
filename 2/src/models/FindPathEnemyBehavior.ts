import EnemyBehaviorStrategy from '../interfaces/EnemyBehaviorStrategy';
import Position from '../interfaces/Position';
import Graph from './Graph';
import Player from './Player';
import Vertex from './Vertex';

export default class FindPathEnemyBehavior<P extends Position>
  implements EnemyBehaviorStrategy<P>
{
  constructor(private graph: Graph<P>, private player: Player<P>) {}

  public getNextVertex(vertex: Vertex<P>) {
    const path = this.graph.findPath(vertex, this.player.getVertex());
    if (path.length === 0) return;
    return path[0];
  }
}
