import Graph from './models/data.structures/graph/Graph';
import RabinCarpProvider from './models/RabinCarpProvider';

/**
 * Rabin Carp
 */
// const exampleStr = 'Lorem sssipsum bla bla bla';
// const exampleSubStr = 'em sssip';
// const rabinCarpProvider = new RabinCarpProvider();
// console.log(rabinCarpProvider.execRabinCarp(exampleStr, exampleSubStr));

/**
 * Dejkstra
 */
// const graph = new Graph();

// const connections = [
//   { a: 1, b: 5, v: 1 },
//   { a: 1, b: 2, v: 1 },
//   { a: 1, b: 4, v: 5 },
//   { a: 2, b: 3, v: 3 },
//   { a: 2, b: 4, v: 3 },
//   { a: 3, b: 1, v: 3 },
//   { a: 3, b: 6, v: 2 },
//   { a: 4, b: 3, v: 3 },
//   { a: 5, b: 6, v: 5 },
//   { a: 5, b: 7, v: 6 },
//   { a: 5, b: 8, v: 3 },
//   { a: 6, b: 2, v: 1 },
//   { a: 6, b: 3, v: 3 },
//   { a: 6, b: 7, v: 2 },
//   { a: 6, b: 5, v: 2 },
//   { a: 7, b: 3, v: 3 },
//   { a: 7, b: 6, v: 1 },
//   { a: 7, b: 8, v: 2 },
//   { a: 8, b: 3, v: 2 },
//   { a: 8, b: 4, v: 2 },
//   { a: 8, b: 7, v: 4 },
// ];

// const vertices = connections
//   .reduce<number[]>((acc, item) => {
//     if (!acc.includes(item.a)) acc.push(item.a);
//     if (!acc.includes(item.b)) acc.push(item.b);
//     return acc;
//   }, [])
//   .map(() => graph.createVertex());

// connections.forEach((item) => {
//   const vertexA = vertices[item.a - 1];
//   const vertexB = vertices[item.b - 1];
//   const value = item.v;
//   vertexA.linkTo(vertexB, value);
// });

// console.log(connections);

// console.log('Connections: ');
// graph.printConnections();
// console.log('------');
// const initialVertex = vertices[2];
// const res = graph.dejkstra(initialVertex);
// console.log('Distances: ');
// const initialNumber = vertices.indexOf(initialVertex);

// for (const [vertex, value] of res) {
//   const vertexNumber = vertices.indexOf(vertex);
//   console.log(`$${initialNumber + 1} -> $${vertexNumber + 1}: ${value}`);
// }

/**
 * Prim
 */
// const graph = new Graph();
