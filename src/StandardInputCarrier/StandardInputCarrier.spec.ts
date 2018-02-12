import { EventEmitter } from 'events';
import { mockedGetParcelFromCarrier } from '../PostWoman/PostWoman';
import StandardInputCarrier from './StandardInputCarrier';

/**
 * @todo TODO because of initializing the carrier, the test
 * process remains "on hold" even when there are no tests
 * left to run, so the process has to be stoped manually
 * pushing ctrl+C.
 */
jest.mock('../PostWoman/PostWoman');

const mockedLog = jest.fn();
(global.console as any) = {
  error: jest.fn(),
  info: jest.fn(),
  log: mockedLog,
  warn: jest.fn(),
};

describe('StandardInputCarrier ', () => {
  beforeEach(() => {
    StandardInputCarrier();
  });
  afterEach(() => {
    // PostWoman.mockClear();
    mockedGetParcelFromCarrier.mockClear();
    mockedLog.mockClear();
    process.stdin.emit('data', 'stop\n');
  });

  it('should call simple simulation when reading "sim" ', done => {
    process.stdin.emit('data', 'sim\n');
    expect(mockedLog).toBeCalledWith('** starting sim **');
    done();
  });
  it('should call verbose simulation when reading "sim" ', done => {
    process.stdin.emit('data', 'sim --v\n');
    expect(mockedLog).toBeCalledWith('** starting sim -verbose **');
    done();
  });
  it('should not start a sim if another one is running', done => {
    process.stdin.emit('data', 'sim\n');
    process.stdin.emit('data', 'sim\n');
    expect(mockedLog).toBeCalledWith('** A simulation is already running **');
    done();
  });
  it('should stop simulation when reading "stop" ', done => {
    process.stdin.emit('data', 'stop\n');
    expect(mockedLog).toBeCalledWith('** stoping sim **');
    done();
  });

  it.skip('should exit process when reading "exit" ', done => {
    /**
     * @todo fix test. process.exit exits from tests and stops
     * the tesing process, so the other tests remain unrun.
     */
    process.stdin.emit('data', 'exit\n');
    expect(mockedLog).toBeCalledWith('** exiting **');
    done();
  });

  it('should try to generate a Parcel when reading something else ', done => {
    process.stdin.emit('data', 'code1,employee1,1\n');
    expect(mockedGetParcelFromCarrier).toBeCalled();
    done();
  });
});
