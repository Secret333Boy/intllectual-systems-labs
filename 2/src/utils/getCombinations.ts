function getCombinations<T>(data: T[][], depth = 0): T[][] {
  const current = data[depth];
  if (!current) return [[]];
  const result: T[][] = [];
  for (let i = 0; i < current.length; i++) {
    const item = current[i];
    const nextCombinations = getCombinations(data, depth + 1);
    for (const nextPart of nextCombinations) result.push([item, ...nextPart]);
  }
  return result;
}

export default getCombinations;
