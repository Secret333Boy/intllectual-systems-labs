import getCombinations from '../utils/getCombinations';
import AStarPathFinder from './data.structures/graph/strategies/AStarPathFinder';
import Enemy from './entities/enemy/Enemy';
import Graph from './data.structures/graph/Graph';
import Player from './entities/player/Player';
import Position2D from './Position2D';
import Vertex from './data.structures/graph/Vertex';
import RandomEnemyBehavior from './entities/enemy/strategies/RandomEnemyBehavior';
import FindPathEnemyBehavior from './entities/enemy/strategies/FindPathEnemyBehavior';
import LiPathFinder from './data.structures/graph/strategies/LiPathFinder';
export default class Labyrinth {
  static VIEW_SYMBOLS = {
    XX: '█',
    PP: 'P',
    AA: 'A',
    BB: 'B',
    ER: 'e',
    EF: 'E',
    BP: 'P',
    path: '▪',
    null: ' ',
  };

  protected graph: Graph;
  protected player: Player;
  protected enemies: Enemy[] = [];
  public goal: Vertex<Position2D>;

  constructor(
    protected arr: ('AA' | 'BB' | 'XX' | 'PP' | 'ER' | 'EF' | 'BP' | null)[][],
    options?: { isPlayerDead: boolean }
  ) {
    const { graph, player, enemies, b } = this.toGraph(true);
    this.graph = graph;
    this.player = player;
    if (options?.isPlayerDead) this.player.isDead = true;
    this.enemies = enemies;
    this.goal = b;
  }

  public getSolution(useAStar = true): Position2D[] {
    const { a, b, graph } = this.toGraph(useAStar);
    return graph.findPath(a, b).map((vertex) => vertex.payload.position);
  }

  public draw(): string {
    let res = '';
    res += Labyrinth.VIEW_SYMBOLS.XX.repeat(this.arr[0].length + 2) + '\n';
    for (let i = 0; i < this.arr.length; i++) {
      res += Labyrinth.VIEW_SYMBOLS.XX;
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
      res += Labyrinth.VIEW_SYMBOLS.XX + '\n';
    }
    res += Labyrinth.VIEW_SYMBOLS.XX.repeat(this.arr[0].length + 2) + '\n';
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
    this.player.makeMove();
    this.enemies.forEach((enemy) => enemy.makeMove());
    return this.player.isDead || this.isWin;
  }

  public getPossibleStates(playerMove: boolean): {
    move: Vertex<Position2D> | undefined;
    state: Labyrinth;
  }[] {
    if (this.isWin || this.player.isDead)
      return [{ move: undefined, state: this }];
    const res: { move: Vertex<Position2D> | undefined; state: Labyrinth }[] =
      [];
    if (playerMove) {
      const possibleMoves = this.player
        .getVertex()
        .getLinks()
        .filter((vertex) => !vertex.isOccupied());
      for (const possibleMove of possibleMoves) {
        const copyArr = this.arr
          .slice()
          .map((row) => row.slice())
          .map((row) =>
            row.map((item) =>
              ['EF', 'ER', 'PP', 'BP'].includes(item || '') ? null : item
            )
          );
        const { x: playerX, y: playerY } = possibleMove.payload.position.coords;
        copyArr[playerX][playerY] = 'PP';
        for (const enemy of this.enemies) {
          const { x, y } = enemy.getVertex().payload.position.coords;
          copyArr[x][y] = 'EF';
        }
        const { x: goalX, y: goalY } = this.goal.payload.position.coords;
        copyArr[goalX][goalY] =
          goalX === playerX && goalY === playerY ? 'BP' : 'BB';
        const labyrinth = new Labyrinth(copyArr);
        res.push({ move: possibleMove, state: labyrinth });
      }
    } else {
      const enemiesPossibleMoves = this.enemies.map((enemy) => {
        const possibleMoves = enemy
          .getPossibleMoves()
          .filter((vertex) => !vertex.hasEnemy() && vertex !== this.goal);
        if (possibleMoves.length === 0) possibleMoves.push(enemy.getVertex());
        return possibleMoves;
      });
      const possibleCombinations = getCombinations(enemiesPossibleMoves);
      for (const possibleCombination of possibleCombinations) {
        const copyArr = this.arr
          .slice()
          .map((row) => row.slice())
          .map((row) =>
            row.map((item) =>
              ['EF', 'ER', 'PP', 'BP'].includes(item || '') ? null : item
            )
          );
        const { x: playerX, y: playerY } =
          this.player.getVertex().payload.position.coords;
        copyArr[playerX][playerY] = 'PP';
        const { x: goalX, y: goalY } = this.goal.payload.position.coords;
        copyArr[goalX][goalY] =
          goalX === playerX && goalY === playerY ? 'BP' : 'BB';
        let isPlayerDead = false;
        for (let i = 0; i < this.enemies.length; i++) {
          const { x, y } = possibleCombination[i].payload.position.coords;
          if (x === playerX && y === playerY) {
            isPlayerDead = true;
            continue;
          }
          copyArr[x][y] = 'EF';
        }
        const labyrinth = new Labyrinth(copyArr, { isPlayerDead });
        res.push({ move: undefined, state: labyrinth });
      }
    }

    return res;
  }

  public getLength(vertex1: Vertex<Position2D>, vertex2: Vertex<Position2D>) {
    try {
      return this.graph.getLength(vertex1, vertex2, true);
    } catch (e) {
      return Infinity;
    }
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

        if (!a && item === 'AA') {
          const vertex = graph.createVertex(new Position2D(i, j));
          a = vertex;
        }
        if (!b && item === 'BB') {
          const vertex = graph.createVertex(new Position2D(i, j));
          b = vertex;
        }
        if (!p && item === 'PP') {
          const vertex = graph.createVertex(new Position2D(i, j));
          p = vertex;
        }

        if (!b && !p && item === 'BP') {
          const vertex = graph.createVertex(new Position2D(i, j));
          b = vertex;
          p = vertex;
        }
      }
    }
    const playerVertex = p || a;
    if (!playerVertex || !b) throw new Error('There is no A or B locations');

    const player = new Player(playerVertex, this);

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

  get isWin() {
    return (
      this.player
        .getVertex()
        .payload.position.getLengthTo(this.goal.payload.position) === 0
    );
  }
}
