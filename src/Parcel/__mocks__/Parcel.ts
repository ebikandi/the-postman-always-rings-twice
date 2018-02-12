/**
 * Object to use when mocking the Parcel in the tests
 */

export const mockedSend = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return {
    getCode: jest.fn(),
    getEmployee: jest.fn(),
    getRetries: jest.fn(),
    isPremium: jest.fn(),
    send: mockedSend,
    waitAndRetry: jest.fn(),
  };
});

export default mock;
