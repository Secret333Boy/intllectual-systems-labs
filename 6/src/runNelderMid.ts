export interface NelderMidArgs {
  f: (...numbers: number[]) => number;
  initialVertex: number[];
  t: number;
  e: number;
  a: number;
  b: number;
  c: number;
}

export default ({ f, initialVertex, t, e, a, b, c }: NelderMidArgs) => {
  const n = f.length;

  if (n !== initialVertex.length)
    throw new Error('Initial vertex has not the same dimension as f');

  const d1 = (t / (n * Math.sqrt(2))) * (Math.sqrt(n + 1) + n - 1);
  const d2 = (t / (n * Math.sqrt(2))) * (Math.sqrt(n + 1) - 1);

  const regularSimplex = [initialVertex];
  for (let i = 1; i < n + 1; i++) {
    const newVertex = [];
    for (let j = 0; j < n; j++) {
      newVertex.push(initialVertex[j] + (j === i - 1 ? d1 : d2));
    }
    regularSimplex.push(newVertex);
  }

  const fres = regularSimplex
    .map((vertex) => ({ f: f(...vertex), x: vertex }))
    .sort((a, b) => a.f - b.f);

  let h = fres[fres.length - 1];
  const g = fres[fres.length - 2];
  const l = fres[0];

  const xc: number[] = [];

  for (let i = 0; i < n; i++) {
    xc.push(
      fres.reduce((acc, item) => (item === h ? acc : acc + item.x[i]), 0) / n
    );
  }

  let xr = h.x.map((xh, i) => (1 + a) * xc[i] - a * xh);
  let fr = f(...xr);

  const xhIndex = regularSimplex.indexOf(h.x);
  if (fr < l.f) {
    const xe = xr.map((item, i) => (1 - c) * xc[i] + c * item);
    const fe = f(...xe);
    if (fe < fr) {
      regularSimplex[xhIndex] = xe;
    } else {
      regularSimplex[xhIndex] = xr;
    }
  } else if (fr < g.f) {
    regularSimplex[xhIndex] = xr;
  } else {
    if (fr < h.f) {
      regularSimplex[xhIndex] = xr;
      const buf = h;
      h = { f: fr, x: xr };
      fr = buf.f;
      xr = buf.x;
    }

    const xs = h.x.map((xh, i) => b * xh + (1 - b) * xc[i]);
    const fs = f(...xs);

    if (fs < h.f) {
      regularSimplex[xhIndex] = xs;
    } else {
      for (let i = 0; i < regularSimplex.length; i++) {
        regularSimplex[i] = regularSimplex[i].map(
          (xi, i) => l.x[i] + (xi - l.x[i]) / 2
        );
      }
    }
  }
  return regularSimplex.map((item) => f(...item)).sort((a, b) => a - b)[0];
};
