import FindPathStrategy from '../interfaces/FindPathStrategy';
import Position from '../interfaces/Position';
import Graph from './Graph';
import PriorityQueue from './PriorityQueue';
import Vertex from './Vertex';

export default class AStarPathFinder<P extends Position>
  implements FindPathStrategy<P>
{
  constructor(protected graph?: Graph<P>) {}

  public findPath(vertex1: Vertex<P>, vertex2: Vertex<P>): Vertex<P>[] {
    if (!this.graph) throw new Error('Graph is not specified');
    if (!vertex1.payload.position)
      throw new Error('Vertex1 has invalid position');
    if (!vertex2.payload.position)
      throw new Error('Vertex2 has invalid position');
    const priorityQueue = new PriorityQueue<Vertex<P>>(true);
    vertex1.payload.g = 0;
    priorityQueue.push(vertex1, this.getH(vertex1, vertex2));
    let found = false;
    while (!priorityQueue.isEmpty()) {
      const vertex = priorityQueue.pull();
      if (!vertex)
        throw new Error(
          'priorityQueue.isEmpty() returned false, but priorityQueue.pull() - undefined'
        );
      if (vertex === vertex2) {
        found = true;
        break;
      }
      if (!vertex.payload.g) vertex.payload.g = 0;
      vertex.payload.closed = true;
      const children = vertex.getLinks();
      for (const child of children) {
        const g =
          vertex.payload.g +
          vertex.payload.position.getLengthTo(child.payload.position);
        if (!child.payload.closed && g < (child.payload.g || Infinity)) {
          child.payload.previousVertex = vertex;
          const h = this.getH(child, vertex2);
          child.payload.g = g;
          priorityQueue.push(child, g + h);
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

    for (const vertex of this.graph.getVertices()) {
      vertex.payload.closed = undefined;
      vertex.payload.g = undefined;
      vertex.payload.previousVertex = undefined;
    }
    return path;
  }

  public setGraph(graph: Graph<P>): void {
    this.graph = graph;
  }

  protected getH(vertex: Vertex<P>, vertexEnd: Vertex<P>): number {
    const position1 = vertex.payload.position;
    const position2 = vertexEnd.payload.position;
    return position1.getLengthTo(position2);
  }
}
