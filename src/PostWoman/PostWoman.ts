import Parcel from '../Parcel/Parcel';
import QueueManager from '../Queue/QueueManager';

export default class PostWoman {
  private inbox: any;
  // TODO study if all this queues can be somewhere else
  private premiumRetryQueue: QueueManager<Parcel>;
  private premiumNewQueue: QueueManager<Parcel>;
  private regularRetryQueue: QueueManager<Parcel>;
  private regularNewQueue: QueueManager<Parcel>;
  private isBusy: boolean;
  private successRate: number;

  constructor() {
    this.initializeProps();
    setInterval(() => this.setSuccessRate(), 1000);
  }

  public receivePackage(code: string, employee: string, premium: boolean) {
    if (this.queuesEmpty() && this.postWomanAvailable()) {
      // Parcel.send
    } else {
      // Enqueue parcel
    }
  }

  private queuesEmpty(): boolean {
    return (
      this.premiumRetryQueue.isEmpty() &&
      this.premiumNewQueue.isEmpty() &&
      this.regularRetryQueue.isEmpty() &&
      this.regularNewQueue.isEmpty()
    );
  }

  private postWomanAvailable(): boolean {
    return this.successRate >= 0.85;
  }

  private initializeProps() {
    this.inbox = {};
    this.premiumRetryQueue = new QueueManager<Parcel>();
    this.premiumNewQueue = new QueueManager<Parcel>();
    this.regularRetryQueue = new QueueManager<Parcel>();
    this.regularNewQueue = new QueueManager<Parcel>();
    this.isBusy = false;
    this.setSuccessRate();
  }

  private setSuccessRate() {
    const failRate = Math.random() * (0.21 - 0.05) + 0.05;
    this.successRate = 1 - failRate;
    // console.log(`Rate: ${this.successRate}`);
  }
}
