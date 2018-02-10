import { EventEmitter } from 'events';
import Parcel from '../Parcel/Parcel';
import ParcelEvents from '../Parcel/ParcelEvents';
import ParcelQueueManager from '../Queue/ParcelQueueManager';

const MIN_AVAILABILITY_RATE = 0.85;

const POSTWOMAN_READY_EVENT = 'postwoman-ready';

const getSuccessRate = () => 1 - (Math.random() * (0.21 - 0.05) + 0.05);

let successRate: number = getSuccessRate();

const postWomanAvailable = () => successRate >= 0.85;

let initialized: boolean = false;

const parcelQueues = new ParcelQueueManager();

const emitter = new EventEmitter();

const initializeSuccessRateCheck = () => {
  setInterval(() => {
    successRate = getSuccessRate();
    if (successRate >= MIN_AVAILABILITY_RATE) {
      emitter.emit(POSTWOMAN_READY_EVENT);
    }
  }, 1000);
};

const processNextParcel = () => {
  if (successRate >= MIN_AVAILABILITY_RATE) {
    const parcel = parcelQueues.getNextParcel();
    if (!!parcel) {
      parcel.send(successRate);
    }
  } else {
    emitter.once(POSTWOMAN_READY_EVENT, processNextParcel);
    console.error(
      `${new Date().toISOString()} [CRITICAL] postwoman not available`
    );
  }
};

const subscribeToParcelEvents = () => {
  emitter
    .on(ParcelEvents.SUCCESS, (p: Parcel) => {
      console.info(
        `${new Date().toISOString()} [INFO] Parcel ${p.getCode()} successfully delivered to ${p.getEmployee()}. Retries: ${p.getRetries()}`
      );
      processNextParcel();
    })
    .on(ParcelEvents.RETRY, (p: Parcel) => {
      console.warn(
        `${new Date().toISOString()} [WARN] Parcel ${p.getCode()} failed to be delivered to to ${p.getEmployee()}. Retries: ${p.getRetries()}`
      );
    })
    .on(ParcelEvents.DEAD, (p: Parcel) => {
      console.error(
        `${new Date().toISOString()} [ERROR] Parcel ${p.getCode()} won't be delivered to ${p.getEmployee()}. Retries: ${p.getRetries()}`
      );
      processNextParcel();
    })
    .on(ParcelEvents.READY, (p: Parcel) => {
      parcelQueues.enqueue(p);
      processNextParcel();
    });
};

const initializeIfNeeded = () => {
  if (!initialized) {
    initialized = true;
    initializeSuccessRateCheck();
    subscribeToParcelEvents();
  }
};

const getParcelFromCarrier = (
  code: string,
  employee: string,
  premium: boolean
) => {
  const parcel = new Parcel(code, employee, premium, emitter);
  initializeIfNeeded();
  parcelQueues.enqueue(parcel);
  processNextParcel();
};

export default { getParcelFromCarrier };
