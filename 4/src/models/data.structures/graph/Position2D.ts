import Position from '../../../interfaces/Position';

export default class Position2D implements Position {
  public coords: { x: number; y: number };

  constructor(x: number, y: number) {
    this.coords = { x, y };
  }

  public getLengthTo(position: Position) {
    if (
      typeof position.coords.x != 'number' ||
      typeof position.coords.y != 'number'
    )
      throw new Error('Position has inappropriate interface');
    return Math.sqrt(
      (this.coords.x - position.coords.x) ** 2 +
        (this.coords.y - position.coords.y) ** 2
    );
  }
}
