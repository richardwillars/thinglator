const httpCommsModule = require('./http');

describe('comms/http', () => {
  it('should initialise the interface and return the available methods', async () => {
    const interfaceObj = {
      initialise: jest.fn(),
    };
    const interfaceConfig = {
      foo: 'bar',
    };
    await httpCommsModule(interfaceObj, interfaceConfig);
    expect(interfaceObj.initialise).toHaveBeenCalledTimes(1);
    expect(interfaceObj.initialise).toHaveBeenCalledWith(interfaceConfig);
  });

  it('should return the type of the comms interface', async () => {
    const interfaceObj = {
      initialise: jest.fn(),
    };
    const interfaceConfig = {
      foo: 'bar',
    };
    const httpComms = await httpCommsModule(interfaceObj, interfaceConfig);
    expect(httpComms.getType()).toEqual('http');
  });

  it('should disconnect from the comms interface', async () => {
    const initialisedInterface = {
      disconnect: jest.fn(),
    };
    const interfaceObj = {
      initialise: jest.fn().mockReturnValue(initialisedInterface),
    };
    const interfaceConfig = {
      foo: 'bar',
    };
    const httpComms = await httpCommsModule(interfaceObj, interfaceConfig);
    await httpComms.disconnect();
    expect(initialisedInterface.disconnect).toHaveBeenCalledTimes(1);
  });

  it('should return a list of methods to make available to drivers that require the http comms', async () => {
    const initialisedInterface = {
      execute: () => {},
    };
    const interfaceObj = {
      initialise: jest.fn().mockReturnValue(initialisedInterface),
    };
    const interfaceConfig = {
      foo: 'bar',
    };
    const httpComms = await httpCommsModule(interfaceObj, interfaceConfig);
    expect(typeof httpComms.methodsAvailableToDriver.execute).toEqual('function');
  });
});
