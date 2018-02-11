import { EventEmitter } from 'events';
import Parcel from '../Parcel/Parcel';
import ParcelEvents from '../Parcel/ParcelEvents';
import ParcelQueueManager from '../Queue/ParcelQueueManager';
import PostWomanEvents from './PostWomanEvents';

const MIN_AVAILABILITY_RATE = 0.85;

const getSuccessRate = () => 1.0 - (Math.random() * (0.21 - 0.05) + 0.05);

let successRate: number = getSuccessRate();

const postWomanAvailable = () => successRate >= MIN_AVAILABILITY_RATE;

const queueManager = new ParcelQueueManager();

const emitter = new EventEmitter();

const initializeSuccessRateCheck = () => {
  setInterval(() => {
    successRate = getSuccessRate();
    if (postWomanAvailable()) {
      emitter.emit(PostWomanEvents.AVAILABLE);
    } else {
      emitter.removeListener(PostWomanEvents.AVAILABLE, processNextParcel);
      emitter.once(PostWomanEvents.AVAILABLE, processNextParcel);
      console.error(
        `${new Date().toISOString()} [CRITICAL] postwoman not available`
      );
    }
  }, 1000);
};

let isProcessing = false;

const processNextParcel = async () => {
  if (postWomanAvailable() && isProcessing === false) {
    const parcel = queueManager.getNextParcel();
    if (!!parcel) {
      isProcessing = true;
      await parcel.send(successRate);
    }
  }
};

const subscribeToParcelEvents = () => {
  emitter
    .on(ParcelEvents.SUCCESS, (p: Parcel) => {
      console.info(
        `${new Date().toISOString()} [INFO] Parcel ${p.getCode()} successfully delivered to ${p.getEmployee()}. Retries: ${p.getRetries()}`
      );
      isProcessing = false;
      processNextParcel();
    })
    .on(ParcelEvents.RETRY, (p: Parcel) => {
      console.warn(
        `${new Date().toISOString()} [WARN] Parcel ${p.getCode()} failed to be delivered to ${p.getEmployee()}. Retries: ${p.getRetries()}`
      );
      isProcessing = false;
      processNextParcel();
    })
    .on(ParcelEvents.DEAD, (p: Parcel) => {
      console.error(
        `${new Date().toISOString()} [ERROR] Parcel ${p.getCode()} won't be delivered to ${p.getEmployee()}. Retries: ${p.getRetries()}`
      );
      isProcessing = false;
      processNextParcel();
    })
    .on(ParcelEvents.READY, (p: Parcel) => sendOrQueue(p));
};

const sendOrQueue = async (parcel: Parcel) => {
  if (postWomanAvailable() === false || isProcessing === true) {
    queueManager.queue(parcel);
  } else if (isProcessing === false && queueManager.queuesAreEmpty()) {
    isProcessing = true;
    await parcel.send(successRate);
  } else {
    queueManager.queue(parcel);
    processNextParcel();
  }
};

(function initialize() {
  initializeSuccessRateCheck();
  subscribeToParcelEvents();
  console.log('Initialized PostWoman');
})();

const getParcelFromCarrier = (
  code: string,
  employee: string,
  premium: boolean
) => {
  const parcel = new Parcel(code, employee, premium, emitter);
  sendOrQueue(parcel);
};

export default { getParcelFromCarrier };
