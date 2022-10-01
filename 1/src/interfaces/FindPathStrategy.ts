import Graph from '../models/Graph';
import Vertex from '../models/Vertex';
import Position from './Position';

export default interface FindPathStrategy<P extends Position> {
  findPath: (vertex1: Vertex<P>, vertex2: Vertex<P>) => Vertex<P>[];
  setGraph: (graph: Graph<P>) => void;
}
