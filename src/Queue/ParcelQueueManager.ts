import Parcel from '../Parcel/Parcel';

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

  public enqueue(parcel: Parcel, retried = false) {
    if (retried) {
      parcel.isPremium
        ? this.premiumRetryQueue.push(parcel)
        : this.regularRetryQueue.push(parcel);
    } else {
      parcel.isPremium
        ? this.premiumNewQueue.push(parcel)
        : this.regularNewQueue.push(parcel);
    }
  }

  public getNextParcel(): Parcel | undefined {
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
}
