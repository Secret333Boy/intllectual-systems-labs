import Labyrinth from './Labyrinth';
import Position2D from './Position2D';
import Vertex from './Vertex';

export default class PlayerMinimaxBehavior {
  constructor(private goal: Vertex<Position2D>, private maxDepth: number) {}

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
      const results = nextStates.map((nextState) =>
        this.minimax(nextState, depth + 1, false)
      );
      const maxResult = results.reduce((acc, value) =>
        acc.score > value.score ? acc : value
      );
      return maxResult;
    }
    const results = nextStates.map((nextState) =>
      this.minimax(nextState, depth + 1, true)
    );
    const minResult = results.reduce((acc, value) =>
      acc.score < value.score ? acc : value
    );
    return minResult;
  }

  private getScore(labyrinth: Labyrinth) {
    const lengthToGoal = labyrinth
      .getPlayer()
      .getVertex()
      .payload.position.getLengthTo(this.goal.payload.position);
    const lengthToNearestEnemy = Math.min(
      ...labyrinth
        .getEnemies()
        .map((enemy) =>
          enemy
            .getVertex()
            .payload.position.getLengthTo(
              labyrinth.getPlayer().getVertex().payload.position
            )
        )
    );
    return lengthToNearestEnemy - lengthToGoal;
  }
}
