const errorHandler = err => {
  switch (err.type) {
    case "Driver":
      console.error("Driver Error", err); // eslint-disable-line no-console
      return {
        code: 500,
        type: err.type,
        driver: err.driver,
        message: err.message
      };
    case "BadRequest":
      return {
        code: 400,
        type: err.type,
        message: err.message
      };
    case "NotFound":
      return {
        code: 404,
        type: err.type,
        message: err.message
      };
    case "Validation":
      return {
        code: 400,
        type: err.type,
        message: err.message,
        errors: err.errors
      };
    case "Connection":
      return {
        code: 503,
        type: err.type,
        message: err.message
      };
    case "Authentication":
      return {
        code: 401,
        type: err.type,
        message: err.message
      };
    default:
      console.error(err); // eslint-disable-line no-console
      return {
        type: "Internal",
        code: 500
      };
  }
};

const initialise = (
  ioLib,
  authenticateCtrl,
  eventCtrl,
  driverCtrl,
  interfaceCtrl,
  eventUtils,
  httpServer,
  drivers,
  constants
) => {
  const io = ioLib(httpServer);
  eventUtils.eventEmitter.on(constants.DEVICE_EVENT, event => {
    io.emit("newEvent", event);
  });
  io.on("connection", socket => {
    socket.on("getAuthenticationProcess", async (driver, cb) => {
      try {
        const result = await authenticateCtrl.getAuthenticationProcess(
          driver,
          drivers
        );
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("authenticationStep", async (driver, stepId, body, cb) => {
      try {
        const result = await authenticateCtrl.authenticationStep(
          driver,
          stepId,
          body
        );
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("discoverDevices", async (driver, cb) => {
      try {
        const result = await driverCtrl.discover(driver, drivers);
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("getDevices", async cb => {
      try {
        const result = await driverCtrl.getAllDevices();
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("getDevicesByType", async (type, cb) => {
      try {
        const result = await driverCtrl.getDevicesByType(type);
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("getDevicesByDriver", async (driver, cb) => {
      try {
        const result = await driverCtrl.getDevicesByDriver(driver);
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("getDeviceById", async (deviceId, cb) => {
      try {
        const result = await driverCtrl.getDeviceById(deviceId);
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("runCommand", async (deviceId, command, body, cb) => {
      try {
        await driverCtrl.runCommand(deviceId, command, body, drivers);
        cb();
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("getDrivers", async cb => {
      try {
        const result = await driverCtrl.getDriversWithStats(drivers);
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("getEventsByType", async (eventType, from, cb) => {
      try {
        const result = await eventCtrl.getEventsByType(eventType, from);
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("getLatestCommandEvents", async cb => {
      try {
        const result = await eventCtrl.getLatestCommandEvents();
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("getCommands", async cb => {
      try {
        const result = await driverCtrl.getCommands();
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("getEventDescriptions", async cb => {
      try {
        const result = await driverCtrl.getEventDescriptions();
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("getDeviceTypes", async cb => {
      try {
        const result = await driverCtrl.getDeviceTypes();
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });

    socket.on("pairingMode", async cb => {
      try {
        const result = await interfaceCtrl.pairingMode();
        cb(result);
      } catch (err) {
        cb(errorHandler(err));
      }
    });
  });
  return io;
};

module.exports = {
  initialise,
  errorHandler
};
