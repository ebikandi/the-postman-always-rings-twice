import ParcelQueueManager from './ParcelQueueManager';

describe('ParcelQueueManager', () => {
  const queueManager: ParcelQueueManager = new ParcelQueueManager();

  it('constructor should initialize the queues as empty queues', () => {
    expect(queueManager.queuesAreEmpty()).toBeTruthy();
  });

  it('getNextParcel should return undefined when the queues are empty', () => {
    expect(queueManager.getNextParcel()).toBeUndefined();
  });
});
