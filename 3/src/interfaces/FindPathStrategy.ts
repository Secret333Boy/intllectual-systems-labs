import Graph from '../models/data.structures/graph/Graph';
import Vertex from '../models/data.structures/graph/Vertex';
import Position from './Position';

export default interface FindPathStrategy<P extends Position> {
  findPath: (
    vertex1: Vertex<P>,
    vertex2: Vertex<P>,
    avoid?: (vertex: Vertex<P>) => boolean
  ) => Vertex<P>[];
  setGraph: (graph: Graph<P>) => void;
}
