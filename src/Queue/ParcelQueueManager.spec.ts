import Parcel from '../Parcel/Parcel';
import ParcelQueueManager from './ParcelQueueManager';

describe('ParcelQueueManager', () => {
  const queueManager: ParcelQueueManager = new ParcelQueueManager();

  it('constructor should initialize the queues as empty queues', () => {
    expect(queueManager.queuesAreEmpty()).toBeTruthy();
  });

  it('getNextParcel should return undefined when the queues are empty', () => {
    expect(queueManager.getNextParcel()).toBeUndefined();
  });

  it('getNextParcel should return parcel if there is any', () => {
    const p = new Parcel('code', 'employee', true, undefined);
    queueManager.queue(p);
    expect(queueManager.getNextParcel()).toBe(p);
  });

  it('queuesAreEmpty should return false if there is any parcel', () => {
    const p = new Parcel('code', 'employee', true, undefined);
    queueManager.queue(p);
    expect(queueManager.queuesAreEmpty()).toBeFalsy();
  });
});
