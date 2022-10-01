import Position2D from '../models/Position2D';
import Vertex from '../models/Vertex';
import Position from './Position';

export default interface EnemyBehaviorStrategy<
  P extends Position = Position2D
> {
  getNextVertex: (vertex: Vertex<P>) => Vertex<P> | undefined;
}
