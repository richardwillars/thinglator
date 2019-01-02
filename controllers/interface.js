const add = (a, b) => a + b;

let activePairingMode = null;

const pairingMode = async availableInterfaces => {
  if (activePairingMode === null) {
    const activeComms = availableInterfaces.getActiveComms();
    activePairingMode = Object.keys(activeComms).map(commId =>
      activeComms[commId].pairingMode()
    );
  }
  const deviceCount = await Promise.all(activePairingMode);
  activePairingMode = null;
  return {
    devicesPaired: deviceCount.reduce(add, 0)
  };
};

module.exports = availableInterfaces => ({
  pairingMode: () => pairingMode(availableInterfaces)
});
