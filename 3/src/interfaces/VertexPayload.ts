import Position from './Position';
import Vertex from '../models/data.structures/graph/Vertex';
import Enemy from '../models/entities/enemy/Enemy';
import Player from '../models/entities/player/Player';

export default interface VertexPayload<P extends Position> {
  position: P;
  previousVertex?: Vertex<P>;
  depth?: number;
  closed?: boolean;
  g?: number;
  player?: Player;
  enemy?: Enemy<P>;
}
