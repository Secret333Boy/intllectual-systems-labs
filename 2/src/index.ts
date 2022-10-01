import Labyrinth from './models/Labyrinth';

const labyrinth = new Labyrinth([
  //      0     1     2     3    4     5     6     - y
  /*0*/ ['AA', null, null, 'XX', null, null, null],
  /*1*/ [null, null, null, null, null, null, null],
  /*2*/ [null, null, null, 'XX', null, null, null],
  /*3*/ [null, 'XX', 'XX', 'XX', null, null, null],
  /*4*/ [null, 'XX', 'BB', null, null, null, null],
  /*x*/
]);

labyrinth.generateEnemies(2);

console.log(labyrinth.draw());
