import Labyrinth from './models/Labyrinth';

const labyrinth = new Labyrinth([
  //      0     1     2     3    4     5     6     - y
  /*0*/ ['AA', null, null, 'xx', null, null, null],
  /*1*/ [null, null, null, null, null, null, null],
  /*2*/ [null, null, null, 'xx', null, null, null],
  /*3*/ [null, 'xx', 'xx', 'xx', null, null, null],
  /*4*/ [null, 'xx', 'BB', 'xx', null, null, null],
  /*x*/
]);

console.log(labyrinth.drawWithSolution(false));
