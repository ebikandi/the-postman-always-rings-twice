export const mockedQueue = jest.fn();
export const mockedGetNextParcel = jest.fn();
export const mockedQueuesAreEmpty = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return {
    getNextParcel: mockedGetNextParcel,
    queue: mockedQueue,
    queuesAreEmpty: () => true,
  };
});

export default mock;
