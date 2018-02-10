import { EventEmitter } from 'events';
import Parcel from './Parcel';

// TODO fix tests
describe('Parcel', () => {
  let parcel: Parcel;
  const emitter = new EventEmitter();
  const code = 'code';
  const employee = 'employee';
  const premium = false;
  describe('sending the parcel', () => {
    it('should succeed with a 100% success rate', done => {
      parcel = new Parcel(code, employee, premium, emitter);
      emitter.on('successfully-sent', () => {
        expect(true).toBeTruthy();
        done();
      });
      parcel.send(1);
    });

    it('should fail with a 0% success rate', done => {
      parcel = new Parcel(code, employee, premium, emitter, 0);
      emitter.on('dead-inbox', () => {
        expect(true).toBeTruthy();
        done();
      });
      parcel.send(0);
    });

    it('should retry with a 0% success rate', done => {
      parcel = new Parcel(code, employee, premium, emitter, 1);
      emitter.on('parcel-ready', () => {
        expect(true).toBeTruthy();
        done();
      });
      parcel.send(0);
    });

    it('should retry with a 0% success rate and then fail', done => {
      let retried = false;
      parcel = new Parcel(code, employee, premium, emitter, 1);

      emitter.on('parcel-ready', () => {
        retried = true;
        parcel.send(0);
      });

      emitter.on('dead-inbox', () => {
        expect(retried).toBeTruthy();
        done();
      });
      parcel.send(0);
    });
  });
});
