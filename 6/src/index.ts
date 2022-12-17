import runNelderMid from './runNelderMid';

const f = (x1: number, x2: number, x3: number) =>
  -4 * x1 * x2 ** 2 * x3 +
  2 * x1 ** 2 * x2 * x3 ** 2 -
  3 * x1 * x2 * x3 +
  7 * x1 ** 2 * x2 ** 2;

const initialVertex = [2, 1, 1];

const t = 1;
const e = 0.01;

const a = 1;
const b = 0.5;
const c = 2;

console.log(runNelderMid({ f, initialVertex, t, e, a, b, c }));
