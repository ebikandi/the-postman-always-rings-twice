import { EventEmitter } from 'events';
import PostWoman from '../PostWoman/PostWoman';
import ParcelEvents from './ParcelEvents';

// Time until to do the retry in ms
const DELAYS = [0, 100, 300, 1000];

const delay = () => {
  const p = new Promise(res =>
    setTimeout(() => {
      return res();
    }, 1000)
  );
  return p;
};

export default class Parcel {
  private retries: number;
  private maxRetries: number;

  private code: string;
  private employee: string;
  private premium: boolean;
  private emitter: EventEmitter;

  // TODO to many parameters in the constructor
  constructor(
    code: string,
    employee: string,
    premium: boolean,
    emitter: EventEmitter,
    maxRetries: number = 3
  ) {
    this.code = code;
    this.employee = employee;
    this.premium = premium;
    this.retries = 0;
    this.emitter = emitter;
    this.maxRetries = maxRetries >= 0 && maxRetries <= 3 ? maxRetries : 3;
  }

  public getCode(): string {
    return this.code;
  }

  public getEmployee(): string {
    return this.employee;
  }

  public isPremium(): boolean {
    return this.premium;
  }

  public getRetries(): number {
    return this.retries;
  }

  public async send(succesRate: number) {
    const successfullySent = Math.random() < succesRate;
    await delay(); // Simulate some delay to force queueing some parcels
    if (successfullySent) {
      this.emitter.emit(ParcelEvents.SUCCESS, this);
    } else {
      this.retries < this.maxRetries
        ? this.waitAndRetry()
        : this.emitter.emit(ParcelEvents.DEAD, this);
    }
  }

  private waitAndRetry() {
    this.emitter.emit(ParcelEvents.RETRY, this);
    this.retries++;
    setTimeout(() => {
      this.emitter.emit(ParcelEvents.READY, this);
    }, DELAYS[this.retries]);
  }
}
