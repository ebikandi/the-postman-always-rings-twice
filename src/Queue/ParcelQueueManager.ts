import Parcel from '../Parcel/Parcel';
import Queue from './Queue';

export default class ParcelQueueManager {
  private premiumRetryQueue: Queue<Parcel>;
  private premiumNewQueue: Queue<Parcel>;
  private regularRetryQueue: Queue<Parcel>;
  private regularNewQueue: Queue<Parcel>;

  constructor() {
    this.premiumRetryQueue = new Queue<Parcel>();
    this.premiumNewQueue = new Queue<Parcel>();
    this.regularRetryQueue = new Queue<Parcel>();
    this.regularNewQueue = new Queue<Parcel>();
  }

  public queuesEmpty(): boolean {
    return (
      this.premiumRetryQueue.isEmpty() &&
      this.premiumNewQueue.isEmpty() &&
      this.regularRetryQueue.isEmpty() &&
      this.regularNewQueue.isEmpty()
    );
  }
}
