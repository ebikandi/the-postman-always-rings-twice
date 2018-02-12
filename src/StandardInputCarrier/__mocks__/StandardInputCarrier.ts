const mockedSimulation = jest.fn();

const mock = jest.fn().mockImplementation(() => {
  return { simulation: mockedSimulation };
});

export default mock;
