import Matrix from './Matrix';

export default class SquaredMatrix extends Matrix {
  public pushSize(): Matrix {
    this.pushRow();
    this.pushCol();
    return this;
  }

  public removeSize(i = this.arr.length - 1): Matrix {
    this.removeRow(i);
    this.removeCol(i);
    return this;
  }
}
