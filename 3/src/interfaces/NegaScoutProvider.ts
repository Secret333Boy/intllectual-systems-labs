import Vertex from '../models/data.structures/graph/Vertex';
import Labyrinth from '../models/Labyrinth';
import Position2D from '../models/Position2D';

export default interface NegaScoutProvider {
  negaScount: (
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
