module.exports = async (interfaceObj, interfaceConfig /* eventEmitter */) => {
  const initialisedInterface = await interfaceObj.initialise(interfaceConfig);
  return {
    getType: () => "http",

    disconnect: async () => {
      await initialisedInterface.disconnect();
    },

    pairingMode: () => Promise.resolve(0),
    removeDevice: deviceId => initialisedInterface.removeDevice(deviceId),
    methodsAvailableToDriver: {
      execute: params => initialisedInterface.execute(params)
    }
  };
};
