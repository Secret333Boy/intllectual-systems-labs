import Node from './Node';
import QueueIterator from './QueueIterator';

export default class Queue<T> {
  protected firstNode?: Node<T>;
  protected lastNode?: Node<T>;

  public static from<T>(obj: Iterable<T>): Queue<T> {
    const queue = new Queue<T>();
    for (const data of obj) {
      queue.push(data);
    }
    return queue;
  }

  public push(data: T): void {
    const node = new Node(data);
    if (!this.firstNode || !this.lastNode) {
      this.firstNode = node;
      this.lastNode = node;
      return;
    }

    this.lastNode.next = node;
    this.lastNode = node;
  }

  public pushMany(...data: T[]): void {
    for (const item of data) {
      this.push(item);
    }
  }

  public pushFrom(obj: Iterable<T>): void {
    for (const item of obj) {
      this.push(item);
    }
  }

  public pull(): T | undefined {
    const buf = this.firstNode?.data;
    this.firstNode = this.firstNode?.next;
    return buf;
  }

  public isEmpty(): boolean {
    return !this.firstNode;
  }

  public toArray(): T[] {
    const result: T[] = [];
    let current = this.firstNode;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  public [Symbol.iterator](): Iterator<T, T> {
    return new QueueIterator(this);
  }
}
