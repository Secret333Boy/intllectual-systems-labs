import AStarPathFinder from './AStarPathFinder';
import Enemy from './Enemy';
import FindPathEnemyBehavior from './FindPathEnemyBehavior';
import Graph from './Graph';
import LiPathFinder from './LiPathFinder';
import Player from './Player';
import Position2D from './Position2D';
import RandomEnemyBehavior from './RandomEnemyBehavior';
import Vertex from './Vertex';

export default class Labyrinth {
  static VIEW_SYMBOLS = {
    XX: '█',
    PP: 'P',
    AA: 'A',
    BB: 'B',
    ER: 'e',
    EF: 'E',
    path: '▪',
    null: ' ',
  };

  protected graph: Graph;
  protected player?: Player;
  protected enemies: Enemy[] = [];

  constructor(
    protected arr: ('AA' | 'BB' | 'XX' | 'PP' | 'ER' | 'EF' | null)[][]
  ) {
    const { graph, player, enemies } = this.toGraph();
    this.graph = graph;
    this.player = player;
    this.enemies = enemies;
  }

  public getSolution(useAStar = true): Position2D[] {
    const { a, b, graph } = this.toGraph(useAStar);
    return graph.findPath(a, b).map((vertex) => vertex.payload.position);
  }

  public draw(): string {
    let res = '';
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = 0; j < this.arr[i].length; j++) {
        const playerCords = this.player?.getVertex().payload.position.coords;
        if (playerCords?.x === i && playerCords?.y === j) {
          res += Labyrinth.VIEW_SYMBOLS.PP;
          continue;
        }
        const foundEnemyHere = this.enemies.find((enemy) => {
          const coord = enemy.getVertex().payload.position.coords;
          return coord.x === i && coord.y === j;
        });
        if (foundEnemyHere) {
          res +=
            Labyrinth.VIEW_SYMBOLS[
              foundEnemyHere.hasRandomBehavior() ? 'ER' : 'EF'
            ];
          continue;
        }
        res += Labyrinth.VIEW_SYMBOLS[this.arr[i][j] ?? 'null'];
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

  public generateEnemies(
    count: number,
    useRandomBehavior = false
  ): Enemy<Position2D>[] {
    if (!this.player) throw new Error('There is no player');
    const enemies: Enemy[] = [];
    const behaviorStrategy = useRandomBehavior
      ? new RandomEnemyBehavior()
      : new FindPathEnemyBehavior(this.graph, this.player);
    const possibleVertices = this.graph
      .getVertices()
      .filter((vertex) => !vertex.isOccupied());
    if (possibleVertices.length < count)
      throw new Error('There is no enough place for so many enemies');
    for (let i = 0; i < count; i++) {
      const vertexIndex = Math.round(
        Math.random() * (possibleVertices.length - 1)
      );
      const vertex = possibleVertices[vertexIndex];
      const enemy = new Enemy(behaviorStrategy, vertex);
      enemies.push(enemy);
      possibleVertices.splice(vertexIndex, 1);
    }
    this.enemies.push(...enemies);
    return enemies;
  }

  public toGraph(useAStar = true): {
    a: Vertex<Position2D>;
    b: Vertex<Position2D>;
    graph: Graph<Position2D>;
    player: Player<Position2D> | undefined;
    enemies: Enemy<Position2D>[];
  } {
    const findPathStrategy = useAStar
      ? new AStarPathFinder<Position2D>()
      : new LiPathFinder<Position2D>();
    const graph = new Graph(findPathStrategy);
    let a: Vertex<Position2D> | undefined;
    let b: Vertex<Position2D> | undefined;
    let player: Player | undefined;
    const enemies: Enemy[] = [];
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = 0; j < this.arr[i].length; j++) {
        const item = this.arr[i][j];
        if (item === 'XX') continue;

        const vertex = graph.createVertex(new Position2D(i, j));
        if (item === 'AA') {
          a = vertex;
          player = new Player(a);
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
        if (item === 'XX') continue;
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
          if (possibleItem === 'XX' || possibleItem === undefined) continue;
          const vertex2 = vertices.filter(
            (vertex) =>
              vertex.payload.position.coords.x === possibleCoord.x &&
              vertex.payload.position.coords.y === possibleCoord.y
          )[0];
          vertex1.linkTo(vertex2);
        }
      }
    }
    return { a, b, graph, player, enemies };
  }
}
