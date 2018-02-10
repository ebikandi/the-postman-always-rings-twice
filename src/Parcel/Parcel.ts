import { EventEmitter } from 'events';
import ParcelEvents from './ParcelEvents';

// Time until to do the retry in ms
const DELAYS = [0, 100, 300, 1000];

export default class Parcel {
  private retries: number;
  private maxRetries: number;

  private code: string;
  private employee: string;
  private premium: boolean;
  private emitter: EventEmitter;

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

  public send(succesRate: number) {
    const successfullySent = Math.random() < succesRate;

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
