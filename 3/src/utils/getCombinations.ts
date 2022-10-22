function getCombinations<T>(data: T[][], depth = 0): T[][] {
  const current = data[depth];
  if (!current) return [[]];
  const result: T[][] = [];
  for (const element of current) {
    const item = element;
    const nextCombinations = getCombinations(data, depth + 1);
    for (const nextPart of nextCombinations) result.push([item, ...nextPart]);
  }
  return result;
}

export default getCombinations;
