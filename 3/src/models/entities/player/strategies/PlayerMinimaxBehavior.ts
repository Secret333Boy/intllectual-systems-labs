import MinimaxProvider from '../../../../interfaces/MinimaxProvider';
import Vertex from '../../../data.structures/graph/Vertex';
import Labyrinth from '../../../Labyrinth';
import Position2D from '../../../Position2D';

export default class PlayerMinimaxBehavior implements MinimaxProvider {
  constructor(private maxDepth: number = 5) {}

  public minimax(
    data: {
      move: Vertex<Position2D> | undefined;
      state: Labyrinth;
    },
    depth = 0,
    isMax = true
  ): { move: Vertex<Position2D> | undefined; score: number } {
    const { move, state } = data;
    if (depth === this.maxDepth) return { move, score: this.getScore(state) };
    const nextStates = state.getPossibleStates(isMax);
    if (isMax) {
      let maxResult = { move, score: -Infinity };
      for (const state of nextStates) {
        const result = this.minimax(state, depth + 1, false);
        if (result.score > maxResult.score) maxResult = result;
      }
      return { move: move || maxResult.move, score: maxResult.score };
    }

    let minResult = { move, score: Infinity };
    for (const state of nextStates) {
      const result = this.minimax(state, depth + 1, true);
      if (result.score < minResult.score) minResult = result;
    }

    return { move, score: minResult.score };
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
}
