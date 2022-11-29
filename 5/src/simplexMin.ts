export const simplexMin = (matrix: number[][]) => {
  while (matrix[0].some((item, i) => i !== 0 && item > 0)) {
    let decisiveRow: number | undefined, decisiveColumn: number | undefined;
    for (let j = 1; j < matrix[0].length; j++) {
      if (
        matrix[0][j] > 0 &&
        (!decisiveColumn || matrix[0][j] > matrix[0][decisiveColumn])
      ) {
        decisiveColumn = j;
      }
    }

    if (!decisiveColumn) return -Infinity;

    let minCoef: number | undefined;
    for (let i = 1; i < matrix.length; i++) {
      const coef = matrix[i][0] / matrix[i][decisiveColumn];
      if (coef > 0 && (!minCoef || coef < minCoef)) {
        minCoef = coef;
        decisiveRow = i;
      }
    }

    if (!decisiveRow) return -Infinity;

    const decisiveElement = matrix[decisiveRow][decisiveColumn];
    const newMatrix: number[][] = [];
    for (let i = 0; i < matrix.length; i++) {
      const newRow: number[] = [];
      for (let j = 0; j < matrix[i].length; j++) {
        const el = matrix[i][j];
        if (i === decisiveRow && j === decisiveColumn) {
          newRow.push(1 / el);
          continue;
        }

        if (i === decisiveRow) {
          newRow.push(el / decisiveElement);
          continue;
        }

        if (j === decisiveColumn) {
          newRow.push(-el / decisiveElement);
          continue;
        }

        newRow.push(
          el -
            (matrix[i][decisiveColumn] * matrix[decisiveRow][j]) /
              decisiveElement
        );
      }
      newMatrix.push(newRow);
    }

    matrix = newMatrix;
  }

  return matrix[0][0];
};
