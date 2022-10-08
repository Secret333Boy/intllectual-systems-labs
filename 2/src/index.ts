import Labyrinth from './models/Labyrinth';
import readline from 'readline';
import getCombinations from './utils/getCombinations';

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

const readInterface = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true,
});

const start = () => {
  // readline.cursorTo(process.stdout, 0, 0);
  // readline.clearScreenDown(process.stdout);
  console.log(labyrinth.draw());
};

readInterface.on('line', () => {
  const finished = !labyrinth.nextStep();

  if (finished) {
    readInterface.close();
  }

  start();
});

start();
// console.log(labyrinth.drawWithSolution());

// const a = [[0, 1, 2], [], [5]];

// console.log(getCombinations(a));
