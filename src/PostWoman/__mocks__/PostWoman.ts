/**
 * Mocked objects to use them when mocking PostWoman in the tests
 */

export const mockedGetParcelFromCarrier = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return {
    getParcelFromCarrier: mockedGetParcelFromCarrier,
  };
});

export default mock();
