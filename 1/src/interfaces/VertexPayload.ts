import Position from './Position';
import Vertex from '../models/Vertex';

export default interface VertexPayload<P extends Position> {
  position: P;
  previousVertex?: Vertex<P>;
  depth?: number;
  closed?: boolean;
  g?: number;
}
