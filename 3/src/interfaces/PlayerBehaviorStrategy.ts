import Labyrinth from '../models/Labyrinth';
import Position2D from '../models/Position2D';
import Vertex from '../models/Vertex';
import Position from './Position';

export default interface PlayerBehaviorStrategy<
  P extends Position = Position2D
> {
  getNextVertex: (labyrinth: Labyrinth) => Vertex<P> | undefined;
}
