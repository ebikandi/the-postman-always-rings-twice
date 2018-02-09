import { EventEmitter } from 'events';

export default class QueueManager<T> extends EventEmitter {
  private length: number;
  private queue: T[];

  constructor() {
    super();
    this.queue = [];
    this.length = 0;
  }
  public enqueue(item: T) {
    this.length = this.queue.push(item);
    this.emit('item-queued');
  }

  public getFirstItem(): T {
    const item = this.queue.shift() as T;
    this.length--;
    return item;
  }

  public itemCount(): number {
    return this.length;
  }

  public isEmpty(): boolean {
    return this.length === 0;
  }
}
