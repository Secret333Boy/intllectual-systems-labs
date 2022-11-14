import RabinCarpProvider from './models/RabinCarpProvider';

export default (
  exampleStr = 'Lorem sssipsum bla bla bla',
  exampleSubStr = 'em sssip'
) => {
  const rabinCarpProvider = new RabinCarpProvider();
  console.log(rabinCarpProvider.execRabinCarp(exampleStr, exampleSubStr));
};
