import Labyrinth from '../models/Labyrinth';
import Position2D from '../models/Position2D';
import Vertex from '../models/Vertex';

export default interface MinimaxProvider {
  minimax: (
    data: {
      move: Vertex<Position2D> | undefined;
      state: Labyrinth;
    },
    depth?: number,
    isMax?: boolean,
    alpha?: number,
    beta?: number
  ) => { move: Vertex<Position2D> | undefined; score: number };
}
