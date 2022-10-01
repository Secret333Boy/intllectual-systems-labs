import FindPathStrategy from '../interfaces/FindPathStrategy';
import Position from '../interfaces/Position';
import Graph from './Graph';
import Queue from './Queue';
import Vertex from './Vertex';

export default class LiPathFinder<P extends Position>
  implements FindPathStrategy<P>
{
  constructor(protected graph?: Graph<P>) {}

  public findPath(vertex1: Vertex<P>, vertex2: Vertex<P>): Vertex<P>[] {
    if (!this.graph) throw new Error('Graph is not specified');
    const queue = new Queue<Vertex<P>>();
    vertex1.payload.depth = 0;
    queue.push(vertex1);
    let found = false;
    while (!queue.isEmpty()) {
      const vertex = queue.pull();
      if (!vertex)
        throw new Error(
          'queue.isEmpty() returned false, but queue.pull() - undefined'
        );
      if (vertex === vertex2) {
        found = true;
        break;
      }
      vertex.payload.closed = true;
      const children = vertex.getLinks();
      for (const child of children) {
        const childDepth =
          (vertex.payload.depth || 0) + this.getC(vertex, child);
        if (
          !child.payload.closed &&
          childDepth <= (child.payload.depth || Infinity)
        ) {
          child.payload.depth = childDepth;
          child.payload.previousVertex = vertex;
          queue.push(child);
        }
      }
    }
    if (!found) throw new Error('Path not found');

    const path: Vertex<P>[] = [];
    let previousVertex: Vertex<P> | undefined = vertex2;
    while (previousVertex) {
      path.unshift(previousVertex);
      previousVertex = previousVertex.payload.previousVertex;
    }
    return path;
  }

  public setGraph(graph: Graph<P>): void {
    this.graph = graph;
  }

  protected getC(vertex: Vertex<P>, vertexEnd: Vertex<P>): number {
    const vertexPosition = vertex.payload.position;
    const vertexEndPosition = vertexEnd.payload.position;
    return vertexPosition.getLengthTo(vertexEndPosition);
  }
}
