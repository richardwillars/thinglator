module.exports = async (interfaceObj, interfaceConfig, eventEmitter) => {
  const initialisedInterface = interfaceObj.initialise(interfaceConfig);

  return {
    getType: () => 'http',

    disconnect: async () => {
      await initialisedInterface.disconnect();
    },

    methodsAvailableToDriver: {
      execute: params => initialisedInterface.execute(params),
    },
  };
};
