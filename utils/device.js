module.exports = (md5, devicesCollection, schemas, jsonValidator) => ({
  createDevice: async (type, driverId, deviceSpecs) => {
    const schema = schemas.deviceTypes[type];
    const deviceSchema = {
      type: "object",
      properties: {
        commands: schema.commands,
        events: schema.events
      },
      required: ["commands", "events"]
    };
    const validated = jsonValidator.validate(deviceSpecs, deviceSchema);
    if (validated.errors.length !== 0) {
      const e = new Error(`the spec of the device is not a valid ${type}`);
      e.type = "Validation";
      e.errors = validated.errors;
      throw e;
    }

    const deviceObj = {
      deviceId: md5(`${type}${driverId}${deviceSpecs.originalId}`),
      type,
      driverId,
      commands: deviceSpecs.commands,
      events: deviceSpecs.events,
      originalId: deviceSpecs.originalId,
      name: deviceSpecs.name
    };
    return devicesCollection.insert(deviceObj);
  },

  updateDevice: async (device, specs) => {
    const schema = schemas.deviceTypes[device.type];
    const deviceSchema = {
      type: "object",
      properties: {
        commands: schema.commands,
        events: schema.events
      },
      required: ["commands", "events"]
    };

    const validated = jsonValidator.validate(specs, deviceSchema);
    if (validated.errors.length !== 0) {
      const e = new Error(
        `the spec of the device is not a valid ${device.type}`
      );
      e.type = "Validation";
      e.errors = validated.errors;
      throw e;
    }
    device.commands = specs.commands;
    device.events = specs.events;
    device.name = specs.name;
    devicesCollection.update(device);
  }
});
