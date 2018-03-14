const add = (a, b) => a + b;

const pairingMode = async availableInterfaces => {
  const activeComms = availableInterfaces.getActiveComms();
  const promises = Object.keys(activeComms).map(commId =>
    activeComms[commId].pairingMode()
  );
  const deviceCount = await Promise.all(promises);
  return {
    devicesPaired: deviceCount.reduce(add, 0)
  };
};

module.exports = availableInterfaces => ({
  pairingMode: () => pairingMode(availableInterfaces)
});
