import getCombinations from '../utils/getCombinations';
import AStarPathFinder from './AStarPathFinder';
import Enemy from './Enemy';
import FindPathEnemyBehavior from './FindPathEnemyBehavior';
import Graph from './Graph';
import LiPathFinder from './LiPathFinder';
import Player from './Player';
import PlayerMinimaxBehavior from './PlayerMinimaxBehavior';
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
  protected player: Player;
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
        const playerCords = this.player.getVertex().payload.position.coords;
        if (
          !this.player.isDead &&
          playerCords?.x === i &&
          playerCords?.y === j
        ) {
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

  public nextStep(): boolean {
    // this.player.makeMove();
    this.enemies.forEach((enemy) => enemy.makeMove());
    return !this.player.isDead;
  }

  // private getEnemyLengthToPlayer(enemy: Enemy) {
  //   return enemy
  //     .getVertex()
  //     .payload.position.getLengthTo(this.player.getVertex().payload.position);
  // }

  public getPossibleStates(playerMove: boolean): {
    move: Vertex<Position2D> | undefined;
    state: Labyrinth;
  }[] {
    const res: { move: Vertex<Position2D> | undefined; state: Labyrinth }[] =
      [];
    if (playerMove) {
      const possibleMoves = this.player
        .getVertex()
        .getLinks()
        .filter((vertex) => !vertex.isOccupied());
      for (const possibleMove of possibleMoves) {
        const copyArr = this.arr.slice().map((row) => row.slice());
        const { x, y } = possibleMove.payload.position.coords;
        copyArr[x][y] = 'PP';
        for (const enemy of this.enemies) {
          const { x, y } = enemy.getVertex().payload.position.coords;
          copyArr[x][y] = 'EF';
        }
        const labyrinth = new Labyrinth(copyArr);
        res.push({ move: possibleMove, state: labyrinth });
      }
    } else {
      const enemiesPossibleMoves = this.enemies.map((enemy) =>
        enemy.getPossibleMoves().filter((vertex) => !vertex.isOccupied())
      );
      const possibleCombinations = getCombinations(enemiesPossibleMoves);
      for (const possibleCombination of possibleCombinations) {
        const copyArr = this.arr.slice().map((row) => row.slice());
        const { x, y } = this.player.getVertex().payload.position.coords;
        copyArr[x][y] = 'PP';
        for (let i = 0; i < this.enemies.length; i++) {
          const { x, y } = possibleCombination[i].payload.position.coords;
          copyArr[x][y] = 'EF';
        }
        const labyrinth = new Labyrinth(copyArr);
        res.push({ move: undefined, state: labyrinth });
      }
    }

    return res;
  }

  public toGraph(useAStar = true): {
    a: Vertex<Position2D>;
    b: Vertex<Position2D>;
    graph: Graph<Position2D>;
    player: Player;
    enemies: Enemy<Position2D>[];
  } {
    const findPathStrategy = useAStar
      ? new AStarPathFinder<Position2D>()
      : new LiPathFinder<Position2D>();
    const graph = new Graph(findPathStrategy);
    let a: Vertex<Position2D> | undefined;
    let b: Vertex<Position2D> | undefined;
    let p: Vertex<Position2D> | undefined;
    const enemies: Enemy[] = [];
    for (let i = 0; i < this.arr.length; i++) {
      for (let j = 0; j < this.arr[i].length; j++) {
        const item = this.arr[i][j];

        if (item === 'AA') {
          const vertex = graph.createVertex(new Position2D(i, j));
          a = vertex;
        }
        if (item === 'BB') {
          const vertex = graph.createVertex(new Position2D(i, j));
          b = vertex;
        }
        if (item === 'PP') {
          const vertex = graph.createVertex(new Position2D(i, j));
          p = vertex;
        }
      }
    }
    const playerVertex = p || a;
    if (!playerVertex || !b) throw new Error('There is no A or B locations');

    const player = new Player(
      playerVertex,
      new PlayerMinimaxBehavior(b, 3),
      this
    );

    for (let i = 0; i < this.arr.length; i++) {
      for (let j = 0; j < this.arr[i].length; j++) {
        const item = this.arr[i][j];
        if (item === 'XX') continue;

        const vertex = graph.createVertex(new Position2D(i, j));
        if (item === 'EF') {
          enemies.push(
            new Enemy(new FindPathEnemyBehavior(graph, <Player>player), vertex)
          );
          this.arr[i][j] = null;
        }
        if (item === 'ER') {
          enemies.push(new Enemy(new RandomEnemyBehavior(), vertex));
          this.arr[i][j] = null;
        }
      }
    }

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
    return { a: playerVertex, b, graph, player, enemies };
  }

  public getPlayer(): Player {
    return this.player;
  }

  public getEnemies(): Enemy<Position2D>[] {
    return this.enemies;
  }
}
