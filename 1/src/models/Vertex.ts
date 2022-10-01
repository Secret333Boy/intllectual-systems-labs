import Position from '../interfaces/Position';
import Graph from './Graph';
import VertexPayload from '../interfaces/VertexPayload';

export default class Vertex<P extends Position> {
  protected links: Set<Vertex<P>>;
  constructor(private graph: Graph<P>, public payload: VertexPayload<P>) {
    this.links = new Set();
  }

  public setLink(vertex: Vertex<P>) {
    this.links.add(vertex);
  }

  public linkTo(vertex: Vertex<P>, value = 1): Vertex<P> {
    this.setLink(vertex);
    this.graph.linkVertices(this, vertex, value);
    return this;
  }

  public deleteLink(vertex: Vertex<P>) {
    this.links.delete(vertex);
  }

  public unlinkFrom(vertex: Vertex<P>): Vertex<P> {
    this.deleteLink(vertex);
    this.graph.unlinkVertices(this, vertex);
    return this;
  }

  public clearLinks(): Vertex<P> {
    this.links.clear();
    return this;
  }

  public isLinkedTo(vertex: Vertex<P>): boolean {
    return this.links.has(vertex);
  }

  public getLinks(): Vertex<P>[] {
    return Array.from(this.links.values());
  }
}
