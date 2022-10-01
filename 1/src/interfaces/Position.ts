export default interface Position {
  coords: {
    [key: string]: number | undefined;
  };

  getLengthTo: (position: Position) => number;
}
