import EnemyBehaviorStrategy from '../interfaces/EnemyBehaviorStrategy';
import Position from '../interfaces/Position';
import Position2D from './Position2D';
import Vertex from './Vertex';

export default class RandomEnemyBehavior<P extends Position = Position2D>
  implements EnemyBehaviorStrategy<P>
{
  public getNextVertex(vertex: Vertex<P>): Vertex<P> {
    const links = vertex.getLinks();
    const index = Math.round(Math.random() * (links.length - 1));
    return links[index];
  }
}
