import { simplexMin } from './simplexMin';

//17
console.log('17:');
const matrix1 = [
  [-2, 4, -5, 0],
  [-1, 5, -3, 6],
  [3, 0, 5, -1],
  [2, -3, 7, 0],
];
console.log(simplexMin(matrix1));

//15
console.log('15:');
const matrix2 = [
  [-2, 4, -5, 2],
  [1, 5, -3, 6],
  [3, 0, 5, -1],
  [2, 3, 7, 0],
];
console.log(simplexMin(matrix2));

//from lecture
console.log('from lecture:');
const matrix3 = [
  [2, 2, 3],
  [5, 2, 1],
  [3, 2, 0],
  [3, 3, 2],
];
console.log(simplexMin(matrix3));
