const driverModule = require("./driver");

describe("controllers/driver", () => {
  describe("getDriversWithStats", () => {
    it("should return a list of drivers with info about the comms and number of devices", async () => {
      const devices = [
        {
          driverId: "foo",
          id: 1
        },
        {
          driverId: "bar",
          id: 2
        },
        {
          driverId: "foo",
          id: 3
        },
        {
          driverId: "bar",
          id: 4
        },
        {
          driverId: "moo",
          id: 5
        }
      ];
      const devicesCollection = {
        find: jest.fn().mockReturnValue(devices)
      };
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {
        foo: {
          driverId: "foo",
          driverType: "light",
          comms: "http"
        },
        bar: {
          driverId: "bar",
          driverType: "speaker",
          comms: "zwave"
        }
      };
      const jsonValidator = {};
      const schemas = {};
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const result = await driver.getDriversWithStats();
      expect(result).toEqual([
        { comms: "http", deviceCount: 2, driverId: "foo", type: "light" },
        { comms: "zwave", deviceCount: 2, driverId: "bar", type: "speaker" },
        { comms: null, deviceCount: 1, driverId: "moo", type: null }
      ]);
    });
  });

  describe("discover", () => {
    it("should do something", async () => {});
  });

  describe("getEventDescriptions", () => {
    it("should return a list of all event descriptions grouped by device type", async () => {
      const devicesCollection = {};
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {};
      const jsonValidator = {};
      const schemas = {
        deviceTypes: {
          light: {
            events: [{ foo: "bar" }, { boo: "moo" }]
          },
          speaker: {
            events: [{ bar: "foo" }]
          }
        }
      };
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const result = await driver.getEventDescriptions(schemas);
      expect(result).toEqual({
        light: schemas.deviceTypes.light.events,
        speaker: schemas.deviceTypes.speaker.events
      });
    });
  });

  describe("getCommands", () => {
    it("should return a list of all commands grouped by device type", async () => {
      const devicesCollection = {};
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {};
      const jsonValidator = {};
      const schemas = {
        deviceTypes: {
          light: {
            commands: [{ foo: "bar" }, { boo: "moo" }]
          },
          speaker: {
            commands: [{ bar: "foo" }]
          }
        }
      };
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const result = await driver.getCommands(schemas);
      expect(result).toEqual({
        light: schemas.deviceTypes.light.commands,
        speaker: schemas.deviceTypes.speaker.commands
      });
    });
  });

  describe("getAllDevices", () => {
    it("should return a list of all devices", async () => {
      const deviceList = [{ foo: "bar" }, { boo: "moo" }];
      const devicesCollection = {
        find: jest.fn().mockReturnValue(deviceList)
      };
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {};
      const jsonValidator = {};
      const schemas = {};
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const result = await driver.getAllDevices();
      expect(result).toEqual(deviceList);
    });
  });

  describe("getDevicesByType", () => {
    it("should return a list of all devices belonging to a certain driver type", async () => {
      const deviceList = [{ foo: "bar" }, { boo: "moo" }];
      const devicesCollection = {
        find: jest.fn().mockReturnValue(deviceList)
      };
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {};
      const jsonValidator = {};
      const schemas = {};
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const result = await driver.getDevicesByType("light");
      expect(result).toEqual(deviceList);
      expect(devicesCollection.find).toHaveBeenCalledWith({ type: "light" });
    });
  });

  describe("getDevicesByDriver", () => {
    it("should return a list of all devices belonging to a certain driver", async () => {
      const deviceList = [{ foo: "bar" }, { boo: "moo" }];
      const devicesCollection = {
        find: jest.fn().mockReturnValue(deviceList)
      };
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {};
      const jsonValidator = {};
      const schemas = {};
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const result = await driver.getDevicesByDriver("foo");
      expect(result).toEqual(deviceList);
      expect(devicesCollection.find).toHaveBeenCalledWith({ driverId: "foo" });
    });
  });

  describe("getDeviceById", () => {
    it("should return a device that matches the specified device id", async () => {
      const foundDevice = { foo: "bar" };
      const devicesCollection = {
        findOne: jest.fn().mockReturnValue(foundDevice)
      };
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {};
      const jsonValidator = {};
      const schemas = {};
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const result = await driver.getDeviceById("abc123");
      expect(result).toEqual(foundDevice);
      expect(devicesCollection.findOne).toHaveBeenCalledWith({
        deviceId: "abc123"
      });
    });

    it("should throw an error if the specified device id can't be found", async () => {
      const devicesCollection = {
        findOne: jest.fn().mockReturnValue(null)
      };
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {};
      const jsonValidator = {};
      const schemas = {};
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      try {
        await driver.getDeviceById("abc123");
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual("device not found");
      }
    });
  });

  describe("getDeviceTypes", () => {
    xit("should return a list of device types and their schemas", async () => {
      // code needs rewriting
    });
  });

  describe("runCommand", () => {
    it("should run a command for the specified device on the device's driver", async () => {
      const device = {
        id: "foo",
        driverId: "foo",
        commands: {
          on: true
        }
      };
      const devicesCollection = {
        findOne: jest.fn().mockReturnValue(device)
      };
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {
        foo: {
          driverId: "foo",
          driverType: "light",
          comms: "http",
          api: {
            command_on: jest.fn().mockReturnValue("response")
          }
        },
        bar: {
          driverId: "bar",
          driverType: "speaker",
          comms: "zwave"
        }
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [] })
      };
      const schemas = {
        deviceTypes: {
          light: {
            commands: {
              properties: {
                on: {
                  requestSchema: {
                    requestSchema: "foooo"
                  }
                }
              }
            }
          }
        }
      };
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const deviceId = "abc123";
      const command = "on";
      const body = { foo: "bar" };
      const result = await driver.runCommand(deviceId, command, body);
      expect(result).toEqual("response");
      expect(devicesCollection.findOne).toHaveBeenCalledWith({
        deviceId: "abc123"
      });
      expect(jsonValidator.validate).toHaveBeenCalledWith(
        body,
        schemas.deviceTypes.light.commands.properties.on.requestSchema
      );
      expect(driverList.foo.api.command_on).toHaveBeenCalledWith(device, body);
    });

    it("should throw an error when the device is not found", async () => {
      const devicesCollection = {
        findOne: jest.fn().mockReturnValue(null)
      };
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {
        foo: {
          driverId: "foo",
          driverType: "light",
          comms: "http",
          api: {}
        },
        bar: {
          driverId: "bar",
          driverType: "speaker",
          comms: "zwave"
        }
      };
      const jsonValidator = {};
      const schemas = {
        deviceTypes: {
          light: {
            commands: {
              properties: {
                on: {
                  requestSchema: {
                    requestSchema: "foooo"
                  }
                }
              }
            }
          }
        }
      };
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const deviceId = "abc123";
      const command = "on";
      const body = { foo: "bar" };
      try {
        await driver.runCommand(deviceId, command, body);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual("device not found");
      }
    });

    it("should throw an error when the command is not found", async () => {
      const device = {
        commands: {
          off: true
        }
      };
      const devicesCollection = {
        findOne: jest.fn().mockReturnValue(device)
      };
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {
        foo: {
          driverId: "foo",
          driverType: "light",
          comms: "http",
          api: {}
        },
        bar: {
          driverId: "bar",
          driverType: "speaker",
          comms: "zwave"
        }
      };
      const jsonValidator = {};
      const schemas = {
        deviceTypes: {
          light: {
            commands: {
              properties: {
                on: {
                  requestSchema: {
                    requestSchema: "foooo"
                  }
                }
              }
            }
          }
        }
      };
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const deviceId = "abc123";
      const command = "on";
      const body = { foo: "bar" };
      try {
        await driver.runCommand(deviceId, command, body);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual("command not found");
      }
    });

    it("should throw an error when the command is not supported", async () => {
      const device = {
        commands: {
          on: false
        }
      };
      const devicesCollection = {
        findOne: jest.fn().mockReturnValue(device)
      };
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {
        foo: {
          driverId: "foo",
          driverType: "light",
          comms: "http",
          api: {}
        },
        bar: {
          driverId: "bar",
          driverType: "speaker",
          comms: "zwave"
        }
      };
      const jsonValidator = {};
      const schemas = {
        deviceTypes: {
          light: {
            commands: {
              properties: {
                on: {
                  requestSchema: {
                    requestSchema: "foooo"
                  }
                }
              }
            }
          }
        }
      };
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const deviceId = "abc123";
      const command = "on";
      const body = { foo: "bar" };
      try {
        await driver.runCommand(deviceId, command, body);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual("command not supported");
      }
    });

    it("should throw an error when the body does not match the json schema", async () => {
      const device = {
        id: "foo",
        driverId: "foo",
        commands: {
          on: true
        }
      };
      const devicesCollection = {
        findOne: jest.fn().mockReturnValue(device)
      };
      const eventsCollection = {};
      const md5 = () => {};
      const driverUtils = {};
      const deviceUtils = {};
      const driverList = {
        foo: {
          driverId: "foo",
          driverType: "light",
          comms: "http",
          api: {}
        },
        bar: {
          driverId: "bar",
          driverType: "speaker",
          comms: "zwave"
        }
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: ["error!"] })
      };
      const schemas = {
        deviceTypes: {
          light: {
            commands: {
              properties: {
                on: {
                  requestSchema: {
                    requestSchema: "foooo"
                  }
                }
              }
            }
          }
        }
      };
      const driver = driverModule(
        devicesCollection,
        eventsCollection,
        md5,
        driverUtils,
        deviceUtils,
        driverList,
        jsonValidator,
        schemas
      );

      const deviceId = "abc123";
      const command = "on";
      const body = { foo: "bar" };
      try {
        await driver.runCommand(deviceId, command, body);
        expect(true).toEqual(false);
      } catch (err) {
        expect(err.message).toEqual("the supplied json is invalid");
      }
    });
  });
});
