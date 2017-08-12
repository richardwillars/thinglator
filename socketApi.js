const ioLib = require('socket.io');

const authenticateCtrl = require('./controllers/authenticate');
const deviceCtrl = require('./controllers/device');
const eventCtrl = require('./controllers/event');
const driverCtrl = require('./controllers/driver');
const eventUtils = require('./utils/event');


const errorHandler = (err) => {
    switch (err.type) {
    case 'Driver':
        console.log('Driver Error', err); // eslint-disable-line no-console
        return {
            code: 500,
            type: err.type,
            driver: err.driver,
            message: err.message
        };
    case 'BadRequest':
        return {
            code: 400,
            type: err.type,
            message: err.message
        };
    case 'NotFound':
        return {
            code: 404,
            type: err.type,
            message: err.message
        };
    case 'Validation':
        return {
            code: 400,
            type: err.type,
            message: err.message,
            errors: err.errors
        };
    case 'Connection':
        return {
            code: 503,
            type: err.type,
            message: err.message
        };
    case 'Authentication':
        return {
            code: 401,
            type: err.type,
            message: err.message
        };
    default:
        console.error(err); // eslint-disable-line no-console
        return {
            type: 'Internal',
            code: 500,
            stack: err.stack
        };
    }
};

const socketApi = (httpServer, drivers) => {
    const io = ioLib(httpServer);
    eventUtils.getEventEmitter().on('newEvent', (event) => {
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
            authenticateCtrl.authenticationStep(driver, drivers, stepId, body).then((result) => {
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
            deviceCtrl.getAllDevices().then((results) => {
                cb(results);
            }).catch((err) => {
                cb(errorHandler(err));
            });
        });

        socket.on('getDevicesByType', (type, cb) => {
            deviceCtrl.getDevicesByType(type).then((results) => {
                cb(results);
            }).catch((err) => {
                cb(errorHandler(err));
            });
        });

        socket.on('getDevicesByTypeAndDriver', (type, driver, cb) => {
            deviceCtrl.getDevicesByTypeAndDriver(type, driver).then((results) => {
                cb(results);
            }).catch((err) => {
                cb(errorHandler(err));
            });
        });

        socket.on('getDeviceById', (deviceId, cb) => {
            deviceCtrl.getDeviceById(deviceId).then((result) => {
                cb(result);
            }).catch((err) => {
                cb(errorHandler(err));
            });
        });

        socket.on('runCommand', (deviceId, command, body, cb) => {
            deviceCtrl.runCommand(deviceId, command, body, drivers).then(() => {
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
            deviceCtrl.getDeviceTypes().then((results) => {
                cb(results);
            }).catch((err) => {
                cb(errorHandler(err));
            });
        });
    });
    return io;
};

module.exports = {
    socketApi,
    errorHandler
};
