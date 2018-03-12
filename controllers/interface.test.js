const interfaceModule = require("./interface");

describe("controllers/interface", () => {
  describe("pairingMode", () => {
    it("should enter pairing mode on each comms interface and return the total number of devices paired", async () => {
      const activeComms = {
        http: {
          pairingMode: jest.fn().mockReturnValue(0)
        },
        zwave: {
          pairingMode: jest.fn().mockReturnValue(2)
        },
        zigbee: {
          pairingMode: jest.fn().mockReturnValue(1)
        }
      };
      const availableInterfaces = {
        getActiveComms: jest.fn().mockReturnValue(activeComms)
      };
      const interfaceObj = interfaceModule(availableInterfaces);
      const result = await interfaceObj.pairingMode();
      expect(result).toEqual({ devicesPaired: 3 });
      expect(activeComms.http.pairingMode).toHaveBeenCalledTimes(1);
      expect(activeComms.zwave.pairingMode).toHaveBeenCalledTimes(1);
    });
  });
});
