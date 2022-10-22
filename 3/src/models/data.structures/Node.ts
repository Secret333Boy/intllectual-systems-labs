export default class Node<T> {
  constructor(
    public data: T,
    public priority: number = 0,
    public next?: Node<T>,
    public prev?: Node<T>
  ) {}
}
