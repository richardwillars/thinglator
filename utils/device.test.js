const deviceModule = require("./device");

describe("utils/device", () => {
  describe("createDevice", () => {
    it("should create a device in the database", async () => {
      const md5 = jest.fn().mockReturnValue("md5Id");
      const devicesCollection = {
        insert: jest.fn()
      };
      const schemas = {
        deviceTypes: {
          light: {
            commands: { foo: "bar" },
            events: { moo: "boo" }
          }
        }
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [] })
      };

      const deviceUtils = deviceModule(
        md5,
        devicesCollection,
        schemas,
        jsonValidator
      );

      await deviceUtils.createDevice("light", "driverId", {
        foo: "bar",
        commands: {},
        events: {},
        originalId: "originalId",
        name: "foo"
      });
      expect(jsonValidator.validate).toHaveBeenCalledTimes(1);
      expect(jsonValidator.validate).toHaveBeenCalledWith(
        {
          commands: {},
          events: {},
          foo: "bar",
          name: "foo",
          originalId: "originalId"
        },
        {
          properties: { commands: { foo: "bar" }, events: { moo: "boo" } },
          required: ["commands", "events"],
          type: "object"
        }
      );

      expect(devicesCollection.insert).toHaveBeenCalledTimes(1);
      expect(devicesCollection.insert).toHaveBeenCalledWith({
        additionalInfo: {},
        commands: {},
        deviceId: "md5Id",
        driverId: "driverId",
        events: {},
        name: "foo",
        originalId: "originalId",
        type: "light"
      });
    });

    it("should catch validation errors and throw them", async () => {
      const md5 = jest.fn().mockReturnValue("md5Id");
      const devicesCollection = {
        insert: jest.fn()
      };
      const schemas = {
        deviceTypes: {
          light: {
            commands: { foo: "bar" },
            events: { moo: "boo" }
          }
        }
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: ["some error"] })
      };

      const deviceUtils = deviceModule(
        md5,
        devicesCollection,
        schemas,
        jsonValidator
      );
      try {
        await deviceUtils.createDevice("light", "driverId", {
          foo: "bar",
          commands: {},
          events: {},
          originalId: "originalId",
          name: "foo"
        });
      } catch (e) {
        expect(e.message).toEqual(
          "the spec of the device is not a valid light"
        );
      }
      expect(devicesCollection.insert).toHaveBeenCalledTimes(0);
    });
  });

  describe("updateDevice", () => {
    it("should update a device in the database", async () => {
      const md5 = jest.fn().mockReturnValue("md5Id");
      const devicesCollection = {
        update: jest.fn()
      };
      const schemas = {
        deviceTypes: {
          light: {
            commands: { foo: "bar" },
            events: { moo: "boo" }
          }
        }
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: [] })
      };

      const deviceUtils = deviceModule(
        md5,
        devicesCollection,
        schemas,
        jsonValidator
      );

      const device = {
        type: "light"
      };
      const specs = {
        commands: {},
        events: {},
        name: "foo"
      };

      await deviceUtils.updateDevice(device, specs);
      expect(jsonValidator.validate).toHaveBeenCalledTimes(1);
      expect(jsonValidator.validate).toHaveBeenCalledWith(specs, {
        type: "object",
        properties: {
          commands: schemas.deviceTypes.light.commands,
          events: schemas.deviceTypes.light.events
        },
        required: ["commands", "events"]
      });

      expect(devicesCollection.update).toHaveBeenCalledTimes(1);
      expect(devicesCollection.update).toHaveBeenCalledWith({
        ...device,
        commands: specs.commands,
        events: specs.events,
        name: specs.name
      });
    });

    it("should catch validation errors and throw them", async () => {
      const md5 = jest.fn().mockReturnValue("md5Id");
      const devicesCollection = {
        update: jest.fn()
      };
      const schemas = {
        deviceTypes: {
          light: {
            commands: { foo: "bar" },
            events: { moo: "boo" }
          }
        }
      };
      const jsonValidator = {
        validate: jest.fn().mockReturnValue({ errors: ["some error"] })
      };

      const deviceUtils = deviceModule(
        md5,
        devicesCollection,
        schemas,
        jsonValidator
      );

      const device = {
        type: "light"
      };
      const specs = {
        commands: {},
        events: {},
        name: "foo"
      };
      try {
        await deviceUtils.updateDevice(device, specs);
      } catch (e) {
        expect(e.message).toEqual(
          "the spec of the device is not a valid light"
        );
      }
      expect(devicesCollection.update).toHaveBeenCalledTimes(0);
    });
  });
});
