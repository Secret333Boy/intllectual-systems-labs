export default class Matrix {
  constructor(protected arr: number[][] = []) {}

  public getElement(i: number, j: number): number {
    return this.arr[i][j];
  }

  public setElement(i: number, j: number, value: number) {
    this.arr[i][j] = value;
  }

  protected pushRow(): Matrix {
    const lastRow = this.arr[this.arr.length - 1];
    this.arr.push([]);
    if (!lastRow) return this;
    for (let i = 0; i < lastRow.length; i++) {
      this.arr[this.arr.length - 1].push(0);
    }
    return this;
  }

  protected pushCol(): Matrix {
    for (const row of this.arr) {
      row.push(0);
    }
    return this;
  }

  protected removeRow(i: number): Matrix {
    this.arr.splice(i, 1);
    return this;
  }

  protected removeCol(i: number): Matrix {
    for (const row of this.arr) {
      row.splice(i);
    }
    return this;
  }

  public getArr(): number[][] {
    const arr: number[][] = [];
    for (const row of this.arr) {
      arr.push([...row]);
    }
    return arr;
  }
}
