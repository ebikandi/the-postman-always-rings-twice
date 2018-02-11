import { EventEmitter } from 'events';
import Parcel, { mockedSend } from '../Parcel/Parcel';
import ParcelQueueManager, {
  mockedGetNextParcel,
  mockedQueue,
} from '../Queue/ParcelQueueManager';
import PostWoman from './PostWoman';

jest.mock('../Parcel/Parcel');
jest.mock('../Queue/ParcelQueueManager');

describe('PostWoman ', () => {
  afterEach(() => {
    Parcel.mockClear();
    mockedSend.mockClear();
    ParcelQueueManager.mockClear();
    mockedGetNextParcel.mockClear();
    mockedQueue.mockClear();
  });
  it('should send first parcel', () => {
    PostWoman.getParcelFromCarrier('code', 'employee', true);
    expect(mockedSend).toBeCalled();
  });
  it('should queue second parcel', () => {
    PostWoman.getParcelFromCarrier('code1', 'employee1', true);
    PostWoman.getParcelFromCarrier('code2', 'employee2', true);
    expect(mockedQueue).toBeCalled();
  });
});
