import Movable from '../interfaces/Movable';
import Position from '../interfaces/Position';
import Position2D from './Position2D';
import Vertex from './Vertex';

export default class Player<P extends Position = Position2D>
  implements Movable
{
  constructor(private vertex: Vertex<P>) {
    vertex.payload.player = this;
  }

  public makeMove() {
    return;
  }

  public getVertex() {
    return this.vertex;
  }
}
