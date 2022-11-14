import Graph from './models/data.structures/graph/Graph';

export default () => {
  const graph = new Graph();
  const info =
    '15=1, 21=1, 23=3, 24=3, 31=3, 36=2, 41=5, 43=3, 56=5, 57=6, 58=3, 62=1, 63=3, 67=2, 65=2, 73=3, 76=1, 78=2, 83=2, 84=2, 87=4';

  const singleConnections: { a: number; b: number; v: number }[] = [];

  info
    .split(', ')
    .map((item) => item.split('='))
    .forEach((item) => {
      const a = +item[0][0];
      const b = +item[0][1];
      const v = +item[1];

      const foundAB = singleConnections.find(
        (item) => item.a === a && item.b === b
      );
      const foundBA = singleConnections.find(
        (item) => item.a === b && item.b === a
      );

      if (foundAB) foundAB.v = Math.min(v, foundAB.v);
      else if (foundBA) foundBA.v = Math.min(v, foundBA.v);
      else singleConnections.push({ a, b, v });
    });

  const connections = [];
  for (const connection of singleConnections) {
    connections.push(connection);
    connections.push({ a: connection.b, b: connection.a, v: connection.v });
  }

  const vertices = connections
    .reduce<number[]>((acc, item) => {
      if (!acc.includes(item.a)) acc.push(item.a);
      if (!acc.includes(item.b)) acc.push(item.b);
      return acc;
    }, [])
    .map(() => graph.createVertex());

  connections.forEach((item) => {
    const vertexA = vertices[item.a - 1];
    const vertexB = vertices[item.b - 1];
    const value = item.v;
    vertexA.linkTo(vertexB, value);
  });

  console.log('Connections: ');
  graph.printConnections();
  console.log('------');

  const res = graph.prim();
  console.log('Prim result: ');
  res.printConnections();
};
