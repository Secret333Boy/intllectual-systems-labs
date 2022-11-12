import Position from '../../../interfaces/Position';
import Position2D from './Position2D';
import SquaredMatrix from '../matrix/SquaredMatrix';
import Vertex from './Vertex';
import PriorityQueue from '../queue/PriorityQueue';

export default class Graph<P extends Position = Position2D> {
  constructor(
    protected vertices: Vertex<P>[] = [],
    protected matrix: SquaredMatrix = new SquaredMatrix()
  ) {}

  public createVertex(position?: P): Vertex<P> {
    const vertex = new Vertex<P>(this, {
      position,
    });
    this.vertices.push(vertex);
    this.matrix.pushSize();
    return vertex;
  }

  public addVertex(vertex: Vertex<P>): void {
    vertex.clearLinks();
    this.vertices.push(vertex);
    this.matrix.pushSize();
  }

  public removeVertexAt(i: number): void {
    this.vertices.splice(i, 1);
    this.matrix.removeSize(i);
  }

  public removeVertex(vertex: Vertex<P>): void {
    const i = this.vertices.indexOf(vertex);
    this.removeVertexAt(i);
  }

  public linkVerticesAt(i: number, j: number, value = 1): void {
    this.vertices[i].setLink(this.vertices[j]);
    this.matrix.setElement(i, j, value);
  }

  public linkVertices(vertex1: Vertex<P>, vertex2: Vertex<P>, value = 1): void {
    const i = this.vertices.indexOf(vertex1);
    const j = this.vertices.indexOf(vertex2);

    this.linkVerticesAt(i, j, value);
  }

  public unlinkVerticesAt(i: number, j: number): void {
    this.vertices[i].deleteLink(this.vertices[j]);
    this.matrix.setElement(i, j, 0);
  }

  public unlinkVertices(vertex1: Vertex<P>, vertex2: Vertex<P>): void {
    const i = this.vertices.indexOf(vertex1);
    const j = this.vertices.indexOf(vertex2);

    this.unlinkVerticesAt(i, j);
  }

  public isLinked(vertex1: Vertex<P>, vertex2: Vertex<P>): boolean {
    const i = this.vertices.indexOf(vertex1);
    const j = this.vertices.indexOf(vertex2);

    return vertex1.isLinkedTo(vertex2) && this.matrix.getElement(i, j) !== 0;
  }

  public getLinkWeight(vertex1: Vertex<P>, vertex2: Vertex<P>): number {
    const i = this.vertices.indexOf(vertex1);
    const j = this.vertices.indexOf(vertex2);

    return this.matrix.getElement(i, j);
  }

  public getVertices(): Vertex<P>[] {
    return [...this.vertices];
  }

  public printConnections() {
    const map = new Map<Vertex<P>, number>();
    this.vertices.forEach((vertex, i) => {
      map.set(vertex, i);
    });

    for (const vertex of this.vertices) {
      const vertexNumber = <number>map.get(vertex);
      const links = vertex.getLinks();
      for (const link of links) {
        const linkNumber = <number>map.get(link);
        const value = this.matrix.getElement(vertexNumber, linkNumber);
        console.log(`$${vertexNumber + 1} -> $${linkNumber + 1}: ${value}`);
      }
    }
  }

  public dejkstra(vertex: Vertex<P>): Map<Vertex<P>, number> {
    for (const vertex of this.vertices) {
      vertex.payload.depth = Infinity;
      vertex.payload.isOpened = true;
    }

    vertex.payload.depth = 0;

    const priorityQueue = new PriorityQueue<Vertex<P>>(true);
    priorityQueue.push(vertex, 0);
    while (!priorityQueue.isEmpty()) {
      const nextVertex = <Vertex<P>>priorityQueue.pull();
      for (const link of nextVertex.getLinks()) {
        if (!link.payload.isOpened) continue;
        const value = this.getLinkWeight(nextVertex, link);
        if (
          link.payload.depth &&
          link.payload.depth > <number>nextVertex.payload.depth + value
        ) {
          link.payload.depth = <number>nextVertex.payload.depth + value;
          priorityQueue.push(link, value);
        }
      }

      nextVertex.payload.isOpened = false;
    }

    const result = new Map<Vertex<P>, number>();

    for (const vertex of this.vertices) {
      result.set(vertex, <number>vertex.payload.depth);
      vertex.payload.depth = undefined;
      vertex.payload.isOpened = undefined;
    }

    return result;
  }

  public prim() {
    //
  }
}
