const VARIANT = 17;

export default class RabinCarpProvider {
  constructor(
    private hash = (str: string) => {
      const m = str.length;
      const q = VARIANT;
      const x = q - 1;
      let res = 0;
      for (let i = 0; i < m; i++) {
        res += str.charCodeAt(i) * x ** (m - i);
      }
      return res % q;
    }
  ) {}

  public execRabinCarp(str: string, substr: string) {
    const subStrHash = this.hash(substr);
    const n = str.length;
    const m = substr.length;

    for (let i = 0; i < n - m + 1; i++) {
      const possibleStr = str.substring(i, i + m);
      const hash = this.hash(possibleStr);
      if (hash === subStrHash && possibleStr === substr) return i;
    }

    return null;
  }
}
