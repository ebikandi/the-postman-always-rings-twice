import { EventEmitter } from 'events';
import Parcel, { mockedSend } from '../Parcel/Parcel';
import ParcelQueueManager, {
  mockedGetNextParcel,
  mockedQueue,
} from '../Queue/ParcelQueueManager';
import PostWoman from './PostWoman';

jest.mock('../Parcel/Parcel');
jest.mock('../Queue/ParcelQueueManager');
jest.useFakeTimers();

describe('PostWoman ', () => {
  afterEach(() => {
    Parcel.mockClear();
    mockedSend.mockClear();
    ParcelQueueManager.mockClear();
    mockedGetNextParcel.mockClear();
    mockedQueue.mockClear();
  });
  it('should send first parcel', done => {
    /**
     * @todo:  there is a race condition here due to the delay in send().
     * sometimes the test ends before letting the funtion to be called.
     */
    PostWoman.getParcelFromCarrier('code', 'employee', true);
    expect(mockedSend).toBeCalled();
    done();
  });
  it('should queue second parcel', done => {
    PostWoman.getParcelFromCarrier('code1', 'employee1', true);
    PostWoman.getParcelFromCarrier('code2', 'employee2', true);
    expect(mockedQueue).toBeCalled();
    done();
  });
});
