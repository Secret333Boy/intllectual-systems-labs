import Labyrinth from '../models/Labyrinth';
import Position2D from '../models/Position2D';
import Vertex from '../models/Vertex';

export default interface NegamaxProvider {
  negamax: (
    data: {
      move: Vertex<Position2D> | undefined;
      state: Labyrinth;
    },
    depth?: number,
    color?: number,
    alpha?: number,
    beta?: number
  ) => { move: Vertex<Position2D> | undefined; score: number };
}
