import Parcel from '../Parcel/Parcel';
/**
 * A manager to manage the queues.
 */
export default class ParcelQueueManager {
  private premiumRetryQueue: Parcel[];
  private premiumNewQueue: Parcel[];
  private regularRetryQueue: Parcel[];
  private regularNewQueue: Parcel[];

  constructor() {
    this.premiumRetryQueue = [];
    this.premiumNewQueue = [];
    this.regularRetryQueue = [];
    this.regularNewQueue = [];
  }

  /**
   * Queues the parcel in the correspondent queue.
   *
   * @param parcel the parcel to be queued.
   * @param retried flag to check if it's premium or not.
   */
  public queue(parcel: Parcel, retried = false) {
    if (retried) {
      parcel.isPremium()
        ? this.premiumRetryQueue.push(parcel)
        : this.regularRetryQueue.push(parcel);
    } else {
      parcel.isPremium()
        ? this.premiumNewQueue.push(parcel)
        : this.regularNewQueue.push(parcel);
    }
  }

  /**
   * Gets the next parcel with the highest priority from the queues.
   * If it is not any, it will return undefined.
   *
   * @return The parcel with the highest priority or undefined if it's no parcel left.
   */
  public getNextParcel(): Parcel | undefined {
    /**
     * If there is any item in the queue, the shift() method will return the first one.
     * Otherwise, if the queue is empty, it will return undefined.
     */
    let nextParcel = this.premiumRetryQueue.shift();
    if (!!nextParcel) {
      return nextParcel;
    }

    nextParcel = this.premiumNewQueue.shift();
    if (!!nextParcel) {
      return nextParcel;
    }

    nextParcel = this.regularRetryQueue.shift();
    if (!!nextParcel) {
      return nextParcel;
    }

    nextParcel = this.regularNewQueue.shift();
    if (!!nextParcel) {
      return nextParcel;
    }
    return undefined;
  }

  /**
   * @returns A boolean if the queues are empty or not.
   */
  public queuesAreEmpty(): boolean {
    return (
      this.premiumRetryQueue.length === 0 &&
      this.premiumNewQueue.length === 0 &&
      this.regularRetryQueue.length === 0 &&
      this.regularNewQueue.length === 0
    );
  }
}
