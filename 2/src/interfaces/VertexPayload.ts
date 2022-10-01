import Position from './Position';
import Vertex from '../models/Vertex';
import Enemy from '../models/Enemy';
import Player from '../models/Player';

export default interface VertexPayload<P extends Position> {
  position: P;
  previousVertex?: Vertex<P>;
  depth?: number;
  closed?: boolean;
  g?: number;
  player?: Player<P>;
  enemy?: Enemy<P>;
}
