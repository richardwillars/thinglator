module.exports = async (interfaceObj, interfaceConfig /* eventEmitter */) => {
  const initialisedInterface = interfaceObj.initialise(interfaceConfig);

  return {
    getType: () => "http",

    disconnect: async () => {
      await initialisedInterface.disconnect();
    },

    pairingMode: () => Promise.resolve(0),

    methodsAvailableToDriver: {
      execute: params => initialisedInterface.execute(params)
    }
  };
};
