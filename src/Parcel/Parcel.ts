import { EventEmitter } from 'events';

// Time until to do the retry in ms
const DELAYS = [0, 100, 300, 1000];
const MAX_RETRIES = 3;

export default class Parcel extends EventEmitter {
  private retries: number;

  constructor() {
    super();
    this.retries = 0;
  }

  public send(succesRate: number) {
    const successfullySent = Math.random() <= succesRate;
    if (successfullySent) {
      this.emit('successfully-sent');
    } else {
      this.retries++;
      this.retries <= MAX_RETRIES
        ? setTimeout(
            () => this.emit('parcel-ready', this),
            DELAYS[this.retries]
          )
        : this.emit('dead-inbox');
    }
  }
}
