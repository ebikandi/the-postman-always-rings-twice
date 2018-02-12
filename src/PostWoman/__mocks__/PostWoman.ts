export const mockedGetParcelFromCarrier = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return {
    getParcelFromCarrier: mockedGetParcelFromCarrier,
  };
});

export default mock();
