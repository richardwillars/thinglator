const errorHandler = (err) => {
  switch (err.type) {
    case 'Driver':
      console.log('Driver Error', err); // eslint-disable-line no-console
      return {
        code: 500,
        type: err.type,
        driver: err.driver,
        message: err.message,
      };
    case 'BadRequest':
      return {
        code: 400,
        type: err.type,
        message: err.message,
      };
    case 'NotFound':
      return {
        code: 404,
        type: err.type,
        message: err.message,
      };
    case 'Validation':
      return {
        code: 400,
        type: err.type,
        message: err.message,
        errors: err.errors,
      };
    case 'Connection':
      return {
        code: 503,
        type: err.type,
        message: err.message,
      };
    case 'Authentication':
      return {
        code: 401,
        type: err.type,
        message: err.message,
      };
    default:
      console.error(err); // eslint-disable-line no-console
      return {
        type: 'Internal',
        code: 500,
        stack: err.stack,
      };
  }
};

const initialise = (ioLib, authenticateCtrl, eventCtrl, driverCtrl, eventUtils, httpServer, drivers, constants) => {
  const io = ioLib(httpServer);
  eventUtils.eventEmitter.on(constants.DEVICE_EVENT, (event) => {
    io.emit('newEvent', event);
  });
  io.on('connection', (socket) => {
    socket.on('getAuthenticationProcess', (driver, cb) => {
      authenticateCtrl.getAuthenticationProcess(driver, drivers).then((result) => {
        cb(result);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('authenticationStep', (driver, stepId, body, cb) => {
      authenticateCtrl.authenticationStep(driver, stepId, body).then((result) => {
        cb(result);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('discoverDevices', (driver, cb) => {
      driverCtrl.discover(driver, drivers).then((results) => {
        cb(results);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('getDevices', (cb) => {
      driverCtrl.getAllDevices().then((results) => {
        cb(results);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('getDevicesByType', (type, cb) => {
      driverCtrl.getDevicesByType(type).then((results) => {
        cb(results);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('getDevicesByDriver', (driver, cb) => {
      driverCtrl.getDevicesByDriver(driver).then((results) => {
        cb(results);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('getDeviceById', (deviceId, cb) => {
      driverCtrl.getDeviceById(deviceId).then((result) => {
        cb(result);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('runCommand', (deviceId, command, body, cb) => {
      driverCtrl.runCommand(deviceId, command, body, drivers).then(() => {
        cb();
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('getDrivers', (cb) => {
      driverCtrl.getDriversWithStats(drivers).then((results) => {
        cb(results);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('getEventsByType', (eventType, from, cb) => {
      eventCtrl.getEventsByType(eventType, from).then((results) => {
        cb(results);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('getLatestCommandEvents', (cb) => {
      eventCtrl.getLatestCommandEvents().then((results) => {
        cb(results);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('getCommandDescriptions', (cb) => {
      driverCtrl.getCommandDescriptions().then((results) => {
        cb(results);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('getEventDescriptions', (cb) => {
      driverCtrl.getEventDescriptions().then((results) => {
        cb(results);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });

    socket.on('getDeviceTypes', (cb) => {
      driverCtrl.getDeviceTypes().then((results) => {
        cb(results);
      }).catch((err) => {
        cb(errorHandler(err));
      });
    });
  });
  return io;
};

module.exports = {
  initialise,
  errorHandler,
};
