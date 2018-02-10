import { EventEmitter } from 'events';
import Parcel from '../Parcel/Parcel';
import ParcelEvents from '../Parcel/ParcelEvents';
import ParcelQueueManager from '../Queue/ParcelQueueManager';

const getSuccessRate = () => 1 - (Math.random() * (0.21 - 0.05) + 0.05);

let successRate: number = getSuccessRate();

const postWomanAvailable = () => successRate >= 0.85;

let initialized: boolean = false;

const parcelQueues = new ParcelQueueManager();

const emitter = new EventEmitter();

const initializeSuccessRateCheck = () => {
  setInterval(() => {
    successRate = getSuccessRate();
    // console.log('RATE: ', successRate);
    if (successRate < 0.85) {
      // TODO format message with debug()
      console.error(
        `${new Date().toISOString()} [CRITICAL] postwoman not available`
      );
    }
  }, 1000);
};

const processNextParcel = () => {
  const parcel = parcelQueues.getNextParcel();
  if (!!parcel) {
    parcel.send(successRate);
  }
};

const subscribeToParcelEvents = () => {
  emitter
    .on(ParcelEvents.success, (p: Parcel) => {
      console.info(
        `${new Date().toISOString()} [INFO] Parcel ${p.getCode()} successfully delivered to ${p.getEmployee()}. Retries: ${p.getRetries()}`
      );
      processNextParcel();
    })
    .on(ParcelEvents.retry, (p: Parcel) => {
      console.warn(
        `${new Date().toISOString()} [WARN] Parcel ${p.getCode()} failed to be delivered to to ${p.getEmployee()}. Retries: ${p.getRetries()}`
      );
      processNextParcel();
    })
    .on(ParcelEvents.dead, (p: Parcel) => {
      console.error(
        `${new Date().toISOString()} [ERROR] Parcel ${p.getCode()} won't be delivered to to ${p.getEmployee()}. Retries: ${p.getRetries()}`
      );
      processNextParcel();
    })
    .on(ParcelEvents.ready, (p: Parcel) => parcelQueues.enqueue(p));
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
};

export default { getParcelFromCarrier };
