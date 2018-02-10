import Parcel from '../Parcel/Parcel';
import ParcelQueueManager from '../Queue/ParcelQueueManager';

const getSuccessRate = () => 1 - (Math.random() * (0.21 - 0.05) + 0.05);

let successRate: number = getSuccessRate();

const postWomanAvailable = () => successRate >= 0.85;

let initialized: boolean = false;

const inbox: any = {};

const parcelQueues = new ParcelQueueManager();

const initializeSuccessRateCheck = () => {
  if (!initialized) {
    initialized = true;
    setInterval(() => {
      successRate = getSuccessRate();
      console.log('RATE: ', successRate);
    }, 1000);
  }
};

const sendParcel = (parcel: Parcel) => {
  initializeSuccessRateCheck();
  if (parcelQueues.queuesEmpty() && postWomanAvailable()) {
    parcel.send(successRate);
  } else {
    parcelQueues.enqueue(parcel.getCode());
  }
};

const PostWoman = { sendParcel };

export default PostWoman;
