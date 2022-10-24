import NegaScoutProvider from '../../../../interfaces/NegaScoutProvider';
import PlayerBehaviorStrategy from '../../../../interfaces/PlayerBehaviorStrategy';
import Vertex from '../../../data.structures/graph/Vertex';
import Labyrinth from '../../../Labyrinth';
import Position2D from '../../../Position2D';

export default class PlayerNegaScoutBehavior
  implements NegaScoutProvider, PlayerBehaviorStrategy
{
  constructor(private maxDepth: number = 5) {}

  public negaScount(
    data: {
      move: Vertex<Position2D> | undefined;
      state: Labyrinth;
    },
    depth = 0,
    color = 1,
    alpha = -Infinity,
    beta = Infinity
  ): { move: Vertex<Position2D> | undefined; score: number } {
    const { move, state } = data;
    if (depth === this.maxDepth || state.getPlayer().isDead)
      return { move, score: this.getScore(state) * color };
    const nextStates = state.getPossibleStates(color === 1);
    let res = { move, score: -Infinity };
    let b = beta;
    for (let i = 0; i < nextStates.length; i++) {
      const state = nextStates[i];
      let result = this.negaScount(state, depth + 1, -color, -b, -alpha);
      result.score = -result.score;
      if (result.score > alpha && result.score < beta && i > 1) {
        result = this.negaScount(state, depth + 1, -color, -beta, -alpha);
        result.score = -result.score;
      }
      if (result.score > res.score) res = result;
      if (result.score > alpha) {
        alpha = result.score;
      }
      if (alpha >= beta)
        return { move: move || result.move, score: result.score };
      b = alpha + 1;
    }
    return { move: move || res.move, score: res.score };
  }

  private getScore(labyrinth: Labyrinth) {
    const playerVertex = labyrinth.getPlayer().getVertex();
    const lengthToGoal = labyrinth.getLength(playerVertex, labyrinth.goal);
    const enemies = labyrinth.getEnemies();
    const lengthToNearestEnemy = Math.min(
      ...enemies.map((enemy) =>
        labyrinth.getLength(enemy.getVertex(), playerVertex)
      )
    );

    if (labyrinth.getPlayer().isDead) return -Infinity;
    return (
      (lengthToNearestEnemy === Infinity ? 0 : lengthToNearestEnemy) -
      (lengthToGoal === Infinity ? 0 : lengthToGoal)
    );
  }

  public getNextVertex(labyrinth: Labyrinth): Vertex<Position2D> | undefined {
    return this.negaScount({ move: undefined, state: labyrinth }).move;
  }
}
