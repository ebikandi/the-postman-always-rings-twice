/**
 * Singleton orchestrator to get the parcels. Main functions:
 *  -Initialize the SuccessRateCheck
 *  -Listen to ParcelEvents, propmp the message and act correspondent to them.
 *  -Get the parcels from the carrier.
 *  -Send them.
 *  -Put or get them from the queues
 */

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

/**
 * Initizalizes the SuccessRateCheck. If it is to low, it will subscribe
 * to the AVAILABLE event.
 * Note that a low rate can be given more than once in row. So everytime it
 * happens, we remove the listener and create a nre one.
 */
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

/**
 * If the PostWoman is available and it is free, request the next parcel
 * to the queueManager. If it gets any parcel from the queue, it will try to send it.
 */
const processNextParcel = async () => {
  if (postWomanAvailable() && isProcessing === false) {
    const parcel = queueManager.getNextParcel();
    if (!!parcel) {
      isProcessing = true;
      await parcel.send(successRate);
    }
  }
};

/**
 * Subscribe to the events.
 */
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
      /**
       * @todo should p be deleted to ease the garbage collector free memory?
       */
      // delete p;
      isProcessing = false;
      processNextParcel();
    })
    .on(ParcelEvents.READY, (p: Parcel) => sendOrQueue(p));
};

/**
 * Sends or queues the parcel.
 *  -If the PostWoman is available and if it is already processing a parcel, queue it.
 *  - If it's not processing anything and there are no previous parcels waiting, send it.
 *  - Else, queue the parcel and get the next one with the highest priority.
 */
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

/**
 * Initialize the rateCheck and the subscription to the events.
 * This will only be perfomed once (in the first time the moudle is imported).
 */
(function initialize() {
  initializeSuccessRateCheck();
  subscribeToParcelEvents();
  console.log('Initialized PostWoman');
})();

/**
 * Method to let the carrier send parcels to the PostWoman.
 * It will queue or send it after receiving it.
 * @param code Code of the parcel
 * @param employee Employee who is going to get the parcel
 * @param premium Flag to set if it has a premium subscription or not.
 */
const getParcelFromCarrier = (
  code: string,
  employee: string,
  premium: boolean
) => {
  const parcel = new Parcel(code, employee, premium, emitter);
  sendOrQueue(parcel);
};

/**
 * Only export this function. As the modules are Singletons by definition there
 * will only be one PostWoman instantiated, and the single possible call will be to
 * get a parcel the carrier.
 */
export default { getParcelFromCarrier };
