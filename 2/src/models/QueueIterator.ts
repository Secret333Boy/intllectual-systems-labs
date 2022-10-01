import Queue from './Queue';

export default class QueueIterator<T> implements Iterator<T, T> {
  private array: T[];
  private i = 0;
  constructor(queue: Queue<T>) {
    this.array = queue.toArray();
  }

  public next() {
    const result = {
      value: this.array[this.i],
      done: this.i === this.array.length,
    };
    this.i++;
    return result;
  }
}
