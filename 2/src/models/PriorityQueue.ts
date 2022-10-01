import Queue from './Queue';
import Node from './Node';

export default class PriorityQueue<T> extends Queue<T> {
  constructor(private asc = false) {
    super();
  }

  public push(data: T, priority = 0): void {
    const node = new Node(data, priority);
    if (!this.firstNode || !this.lastNode) {
      this.firstNode = node;
      this.lastNode = node;
      return;
    }

    if (
      this.asc
        ? this.firstNode.priority > node.priority
        : this.firstNode.priority < node.priority
    ) {
      node.next = this.firstNode;
      this.firstNode = node;
      return;
    }

    let current = this.firstNode;
    while (
      current.next &&
      (this.asc
        ? priority > current.next.priority
        : priority < current.next.priority)
    ) {
      current = current.next;
    }

    if (!current.next) {
      this.lastNode.next = node;
      this.lastNode = node;
      return;
    }

    node.next = current.next;
    current.next = node;
  }
}
