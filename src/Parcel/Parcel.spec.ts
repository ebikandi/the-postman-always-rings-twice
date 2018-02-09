import { EventEmitter } from 'events';
import Parcel from './Parcel';

describe('Parcel', () => {
  let parcel: Parcel;

  describe('sending the parcel', () => {
    it('should succeed with a 100% success rate', done => {
      parcel = new Parcel();
      parcel.on('successfully-sent', () => {
        expect(true).toBeTruthy();
        done();
      });
      parcel.send(1);
    });

    it('should fail with a 0% success rate', done => {
      parcel = new Parcel(0);
      parcel.on('dead-inbox', () => {
        expect(true).toBeTruthy();
        done();
      });
      parcel.send(0);
    });

    it('should retry with a 0% success rate', done => {
      parcel = new Parcel(1);
      parcel.on('parcel-ready', () => {
        expect(true).toBeTruthy();
        done();
      });
      parcel.send(0);
    });

    it('should retry with a 0% success rate and then fail', done => {
      let retried = false;
      parcel = new Parcel(1);

      parcel.on('parcel-ready', () => {
        retried = true;
        parcel.send(0);
      });

      parcel.on('dead-inbox', () => {
        expect(retried).toBeTruthy();
        done();
      });
      parcel.send(0);
    });
  });
});
