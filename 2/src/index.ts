import Labyrinth from './models/Labyrinth';
import readline from 'readline';

const labyrinth = new Labyrinth([
  //      0     1     2     3     4     5     6     7     8     9    - y
  /*0*/ [null, null, null, null, null, null, null, 'XX', null, null],
  /*1*/ [null, 'XX', null, 'AA', null, 'XX', null, null, 'EF', null],
  /*2*/ [null, 'XX', null, null, null, null, null, 'XX', null, null],
  /*3*/ [null, 'XX', null, null, 'XX', 'XX', null, 'XX', null, null],
  /*4*/ ['XX', null, 'XX', null, 'XX', 'XX', null, null, null, null],
  /*5*/ [null, null, 'XX', 'XX', null, null, null, null, null, null],
  /*6*/ [null, null, null, null, null, null, null, 'XX', 'XX', null],
  /*7*/ [null, 'XX', null, 'XX', 'XX', 'XX', 'XX', 'XX', 'BB', null],
  /*8*/ [null, null, null, null, null, 'XX', null, 'XX', 'XX', null],
  /*9*/ [null, null, 'XX', null, null, null, null, null, null, null],
  /*x*/
]);

// //      0     1     2     3     4     5     6     7     8     9    - y
  // /*0*/ [null, null, null, null, null, null, null, 'XX', null, null],
  // /*1*/ [null, 'XX', null, 'AA', null, 'XX', null, null, 'EF', null],
  // /*2*/ [null, 'XX', null, null, null, null, null, 'XX', null, null],
  // /*3*/ [null, 'XX', null, null, 'XX', 'XX', null, 'XX', null, null],
  // /*4*/ ['XX', null, 'XX', null, 'XX', 'XX', null, null, null, null],
  // /*5*/ [null, null, 'XX', 'XX', null, null, null, null, null, null],
  // /*6*/ [null, null, null, null, null, null, null, 'XX', 'XX', null],
  // /*7*/ [null, 'XX', null, 'XX', 'XX', 'XX', 'XX', 'XX', 'BB', null],
  // /*8*/ [null, null, null, null, null, 'XX', null, 'XX', 'XX', null],
  // /*9*/ [null, null, 'XX', null, null, null, null, null, null, null],
// /*x*/

// labyrinth.generateEnemies(1, true);
// labyrinth.generateEnemies(1);

const readInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const start = () => {
  readline.cursorTo(process.stdout, 0, 0);
  readline.clearScreenDown(process.stdout);
  console.log(labyrinth.draw());
};

readInterface.on('line', () => {
  const finished = labyrinth.nextStep();

  if (finished) {
    readInterface.close();
  }

  start();
});

start();
///////////////////////////////
// labyrinth.getPossibleStates(false).forEach(({ state }) => {
//   console.log(state.draw());
// });
