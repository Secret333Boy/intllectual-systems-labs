import AStarPathFinder from './AStarPathFinder';
import Graph from './Graph';
import LiPathFinder from './LiPathFinder';
import Position2D from './Position2D';
import Vertex from './Vertex';

export default class Labyrinth {
  static VIEW_SYMBOLS = {
    xx: '█',
    AA: 'A',
    BB: 'B',
    path: '▪',
    null: ' ',
  };

  protected arr: ('AA' | 'BB' | 'xx' | null)[][];

  constructor(arr: ('AA' | 'BB' | 'xx' | null)[][]) {
    this.arr = arr;
  }

  public getSolution(useAStar = true): Position2D[] {
    const findPathStrategy = useAStar
      ? new AStarPathFinder<Position2D>()
      : new LiPathFinder<Position2D>();
    const graph = new Graph(findPathStrategy);
    let a: Vertex<Position2D> | undefined;
    let b: Vertex<Position2D> | undefined;
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = 0; j < this.arr[i].length; j++) {
        const item = this.arr[i][j];
        if (item === 'xx') continue;

        const vertex = graph.createVertex(new Position2D(i, j));
        if (item === 'AA') {
          a = vertex;
          continue;
        }
        if (item === 'BB') b = vertex;
      }
    }

    if (!a || !b) throw new Error('There is no A or B locations');
    const vertices = graph.getVertices();
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = 0; j < this.arr[i].length; j++) {
        const item = this.arr[i][j];
        if (item === 'xx') continue;
        const vertex1 = vertices.filter(
          (vertex) =>
            vertex.payload.position.coords.x === i &&
            vertex.payload.position.coords.y === j
        )[0];
        const possibleCoords = [
          { x: i + 1, y: j + 1 },
          { x: i + 1, y: j - 1 },
          { x: i - 1, y: j + 1 },
          { x: i - 1, y: j - 1 },
          { x: i + 1, y: j },
          { x: i - 1, y: j },
          { x: i, y: j + 1 },
          { x: i, y: j - 1 },
        ];

        for (const possibleCoord of possibleCoords) {
          if (
            possibleCoord.x < 0 ||
            possibleCoord.y < 0 ||
            possibleCoord.x > this.arr.length - 1
          )
            continue;
          const possibleItem = this.arr[possibleCoord.x][possibleCoord.y];
          if (possibleItem === 'xx' || possibleItem === undefined) continue;
          const vertex2 = vertices.filter(
            (vertex) =>
              vertex.payload.position.coords.x === possibleCoord.x &&
              vertex.payload.position.coords.y === possibleCoord.y
          )[0];
          vertex1.linkTo(vertex2);
        }
      }
    }
    return graph.findPath(a, b).map((vertex) => vertex.payload.position);
  }

  public draw(): string {
    let res = '';
    for (const row of this.arr) {
      for (const item of row) {
        res += Labyrinth.VIEW_SYMBOLS[item === null ? 'null' : item];
      }
      res += '\n';
    }
    return res;
  }

  public drawWithSolution(useAStar = true): string {
    const solution = this.getSolution(useAStar);
    const drawnSplitted = this.draw()
      .split('\n')
      .map((row) => row.split(''));

    for (const position of solution) {
      if (
        drawnSplitted[position.coords.x][position.coords.y] ===
        Labyrinth.VIEW_SYMBOLS.null
      )
        drawnSplitted[position.coords.x][position.coords.y] =
          Labyrinth.VIEW_SYMBOLS.path;
    }

    return drawnSplitted.map((row) => row.join('')).join('\n');
  }
}
