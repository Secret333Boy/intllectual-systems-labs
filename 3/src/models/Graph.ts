import FindPathStrategy from '../interfaces/FindPathStrategy';
import Position from '../interfaces/Position';
import AStarPathFinder from './AStarPathFinder';
import Position2D from './Position2D';
import SquaredMatrix from './SquaredMatrix';
import Vertex from './Vertex';

export default class Graph<P extends Position = Position2D> {
  protected findPathStrategy: FindPathStrategy<P>;
  constructor(
    findPathStrategy?: FindPathStrategy<P>,
    protected vertices: Vertex<P>[] = [],
    protected matrix: SquaredMatrix = new SquaredMatrix()
  ) {
    this.findPathStrategy = findPathStrategy || new AStarPathFinder();
    this.findPathStrategy.setGraph(this);
  }

  public createVertex(position: P): Vertex<P> {
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

  public setFindPathStrategy(findPathStrategy: FindPathStrategy<P>) {
    this.findPathStrategy = findPathStrategy;
    this.findPathStrategy.setGraph(this);
  }

  public findPath(
    vertex1: Vertex<P>,
    vertex2: Vertex<P>,
    avoid?: (vertex: Vertex<P>) => boolean
  ) {
    return this.findPathStrategy.findPath(vertex1, vertex2, avoid);
  }

  public getLength(
    vertex1: Vertex<P>,
    vertex2: Vertex<P>,
    useRound = false,
    avoid?: (vertex: Vertex<P>) => boolean
  ) {
    if (vertex1 === vertex2) return 0;
    const path = this.findPathStrategy.findPath(vertex1, vertex2, avoid);
    if (path.length === 2) {
      const result = path[0].payload.position.getLengthTo(
        path[1].payload.position
      );
      return useRound ? Math.round(result) : result;
    }
    let res = 0;

    for (let i = 0; i < path.length - 2; i++) {
      const lengthToNextVertex = path[i].payload.position.getLengthTo(
        path[i + 1].payload.position
      );
      res += useRound ? Math.round(lengthToNextVertex) : lengthToNextVertex;
    }

    return res;
  }

  public getVertices(): Vertex<P>[] {
    return [...this.vertices];
  }
}
