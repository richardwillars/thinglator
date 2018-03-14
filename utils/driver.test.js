const chalk = require("chalk");
const constants = require("../constants");
const driverModule = require("./driver");

describe("utils/driver", () => {
  describe("load", () => {
    it("should load any drivers found in node_modules and connect them to the required comms interfaces", async () => {
      const fs = {
        readdirSync: jest
          .fn()
          .mockReturnValue([
            "thinglator-driver-foo",
            "thinglator-driver-bar",
            "something else"
          ])
      };
      const driversCollection = {
        findOne: jest
          .fn()
          .mockReturnValue({ settings: { foo: "bar", boo: "hoo" } }),
        update: jest.fn()
      };
      const devices = [{ foo: "bar", boo: "moo" }];
      const devicesCollection = {
        find: jest
          .fn()
          .mockReturnValueOnce(devices)
          .mockReturnValueOnce([])
      };
      const eventCreators = {};
      const eventEmitter = {};
      const schemas = {
        deviceTypes: {
          light: {
            events: {
              properties: {
                [constants.events.LIGHT_STATE]: {
                  constant: constants.events.LIGHT_STATE
                },
                [constants.events.BREATHE_LIGHT_EFFECT]: {
                  constant: constants.events.BREATHE_LIGHT_EFFECT
                }
              }
            }
          }
        }
      };

      const initialisedDriver = {
        initDevices: jest.fn()
      };

      const firstReturnedDriverModule = {
        interface: "http",
        driverType: "light",
        driverId: "foo",
        initialise: jest.fn().mockReturnValue(initialisedDriver)
      };
      const secondReturnedDriverModule = {
        interface: "http",
        driverType: "light",
        driverId: "bar",
        initialise: jest.fn().mockReturnValue(initialisedDriver)
      };
      const loadModule = jest
        .fn()
        .mockReturnValueOnce(firstReturnedDriverModule)
        .mockReturnValueOnce(secondReturnedDriverModule);

      const interfaceObj = {
        methodsAvailableToDriver: {}
      };
      const interfaces = {
        getActiveCommsById: jest.fn().mockReturnValue(interfaceObj)
      };

      const driver = driverModule(
        fs,
        chalk,
        driversCollection,
        devicesCollection,
        constants,
        eventCreators,
        eventEmitter,
        schemas,
        loadModule
      );

      const drivers = await driver.load(interfaces);

      expect(loadModule).toHaveBeenCalledTimes(2);
      expect(loadModule).toHaveBeenCalledWith("thinglator-driver-foo");
      expect(loadModule).toHaveBeenCalledWith("thinglator-driver-bar");

      expect(drivers).toEqual({
        "thinglator-driver-foo": {
          api: initialisedDriver,
          comms: "http",
          driverType: "light",
          driverId: "foo"
        },
        "thinglator-driver-bar": {
          api: initialisedDriver,
          comms: "http",
          driverType: "light",
          driverId: "bar"
        }
      });

      expect(initialisedDriver.initDevices).toHaveBeenCalledTimes(2);
      expect(initialisedDriver.initDevices).toHaveBeenCalledWith(devices);
      expect(initialisedDriver.initDevices).toHaveBeenCalledWith([]);

      expect(firstReturnedDriverModule.initialise).toHaveBeenCalledTimes(1);
      expect(firstReturnedDriverModule.initialise.mock.calls[0][2]).toEqual(
        interfaceObj.methodsAvailableToDriver
      );
      expect(firstReturnedDriverModule.initialise.mock.calls[0][3]).toEqual({
        BREATHE_LIGHT_EFFECT: "BREATHE_LIGHT_EFFECT",
        LIGHT_STATE: "LIGHT_STATE"
      });
      expect(firstReturnedDriverModule.initialise.mock.calls[0][5]).toEqual(
        eventEmitter
      );
    });
  });

  describe("doesDriverExist", () => {
    it("should return a promise that resolves to true if the driver is found in the list", async () => {
      const fs = {};
      const driversCollection = {};
      const devicesCollection = {};
      const eventCreators = {};
      const eventEmitter = {};
      const schemas = {};
      const loadModule = () => {};

      const driver = driverModule(
        fs,
        chalk,
        driversCollection,
        devicesCollection,
        constants,
        eventCreators,
        eventEmitter,
        schemas,
        loadModule
      );

      const driverId = "foo";
      const drivers = { boo: {}, hoo: {}, foo: {}, moo: {} };
      const result = await driver.doesDriverExist(driverId, drivers);
      expect(result).toEqual(true);
    });

    it("should return a promise that resolves to false if the driver is not found in the list", async () => {
      const fs = {};
      const driversCollection = {};
      const devicesCollection = {};
      const eventCreators = {};
      const eventEmitter = {};
      const schemas = {};
      const loadModule = () => {};

      const driver = driverModule(
        fs,
        chalk,
        driversCollection,
        devicesCollection,
        constants,
        eventCreators,
        eventEmitter,
        schemas,
        loadModule
      );

      const driverId = "foo";
      const drivers = { boo: {}, hoo: {}, moo: {} };
      const result = await driver.doesDriverExist(driverId, drivers);
      expect(result).toEqual(false);
    });
  });

  describe("updateDriverSettings", () => {
    it("should update the settings if they already exist for the specified driver", async () => {
      const fs = {};
      const driversCollection = {
        findOne: jest
          .fn()
          .mockReturnValue({ settings: { foo: "bar", boo: "hoo" } }),
        update: jest.fn()
      };
      const devicesCollection = {};
      const eventCreators = {};
      const eventEmitter = {};
      const schemas = {};
      const loadModule = () => {};

      const driver = driverModule(
        fs,
        chalk,
        driversCollection,
        devicesCollection,
        constants,
        eventCreators,
        eventEmitter,
        schemas,
        loadModule
      );

      const settings = { foo: "moo" };

      const result = await driver.updateDriverSettings("driver1", settings);
      expect(driversCollection.findOne).toHaveBeenCalledTimes(1);
      expect(driversCollection.findOne).toHaveBeenCalledWith({
        driverId: "driver1"
      });
      expect(driversCollection.update).toHaveBeenCalledTimes(1);
      expect(driversCollection.update).toHaveBeenCalledWith({
        settings: {
          foo: "moo",
          boo: "hoo"
        }
      });
      expect(result).toEqual({ foo: "moo", boo: "hoo" });
    });

    it("should create the settings if they don't exist for the specified driver", async () => {
      const fs = {};
      const driversCollection = {
        findOne: jest.fn().mockReturnValue(null),
        insert: jest.fn()
      };
      const devicesCollection = {};
      const eventCreators = {};
      const eventEmitter = {};
      const schemas = {};
      const loadModule = () => {};

      const driver = driverModule(
        fs,
        chalk,
        driversCollection,
        devicesCollection,
        constants,
        eventCreators,
        eventEmitter,
        schemas,
        loadModule
      );

      const settings = { foo: "moo" };

      const result = await driver.updateDriverSettings("driver1", settings);
      expect(driversCollection.findOne).toHaveBeenCalledTimes(1);
      expect(driversCollection.findOne).toHaveBeenCalledWith({
        driverId: "driver1"
      });
      expect(driversCollection.insert).toHaveBeenCalledTimes(1);
      expect(driversCollection.insert).toHaveBeenCalledWith({
        driverId: "driver1",
        settings: {
          foo: "moo"
        }
      });
      expect(result).toEqual({ foo: "moo" });
    });
  });

  describe("getDriverSettings", () => {
    it("should return the settings for the specified driver", async () => {
      const fs = {};
      const driversCollection = {
        findOne: jest.fn().mockReturnValue({ settings: { foo: "bar" } })
      };
      const devicesCollection = {};
      const eventCreators = {};
      const eventEmitter = {};
      const schemas = {};
      const loadModule = () => {};

      const driver = driverModule(
        fs,
        chalk,
        driversCollection,
        devicesCollection,
        constants,
        eventCreators,
        eventEmitter,
        schemas,
        loadModule
      );

      const result = await driver.getDriverSettings("driver1");
      expect(driversCollection.findOne).toHaveBeenCalledTimes(1);
      expect(driversCollection.findOne).toHaveBeenCalledWith({
        driverId: "driver1"
      });
      expect(result).toEqual({ foo: "bar" });
    });

    it("should return an empty object if the driver is not found", async () => {
      const fs = {};
      const driversCollection = {
        findOne: jest.fn().mockReturnValue(null)
      };
      const devicesCollection = {};
      const eventCreators = {};
      const eventEmitter = {};
      const schemas = {};
      const loadModule = () => {};

      const driver = driverModule(
        fs,
        chalk,
        driversCollection,
        devicesCollection,
        constants,
        eventCreators,
        eventEmitter,
        schemas,
        loadModule
      );

      const result = await driver.getDriverSettings("driver1");
      expect(result).toEqual({});
    });
  });
});
