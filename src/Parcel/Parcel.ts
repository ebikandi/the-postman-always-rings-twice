import { EventEmitter } from 'events';

// Time until to do the retry in ms
const DELAYS = [0, 100, 300, 1000];

export default class Parcel extends EventEmitter {
  private retries: number;
  private maxRetries: number;

  constructor(maxRetries: number = 3) {
    super();
    this.retries = 0;
    this.maxRetries = maxRetries >= 0 && maxRetries <= 3 ? maxRetries : 3;
  }

  public send(succesRate: number) {
    const successfullySent = Math.random() < succesRate;

    if (successfullySent) {
      this.emit('successfully-sent');
    } else {
      this.retries++;

      console.log(`condition: ${this.retries <= this.maxRetries}`);
      this.retries <= this.maxRetries
        ? this.waitAndRetry()
        : this.emit('dead-inbox');
    }
  }

  private waitAndRetry() {
    // TODO fix message
    // TODO who has to print the log??
    console.log('Retry!!');
    setTimeout(() => {
      this.emit('parcel-ready');
    }, DELAYS[this.retries]);
  }
}
