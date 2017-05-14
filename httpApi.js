const bodyParser = require('body-parser');

const authenticateCtrl = require('./controllers/authenticate');
const deviceCtrl = require('./controllers/device');
const eventCtrl = require('./controllers/event');
const driverCtrl = require('./controllers/driver');

const jsonParser = bodyParser.json();

module.exports = (app, drivers) => {
    app.get('/', (req, res) => {
        res.json({
            Thinglator: 'Oh, hi!'
        });
    });

    app.get('/authenticate/:driver', (req, res, next) => {
        authenticateCtrl.getAuthenticationProcess(req.params.driver, drivers)
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    });

    app.post('/authenticate/:driver/:stepId', jsonParser, (req, res, next) => {
        authenticateCtrl.authenticationStep(req.params.driver, drivers, req.params.stepId, req.body)
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    });

  /*
  GET discover/:type/:driver
  -> GET discover/speaker/sonos
  */
    app.get('/discover/:driver', (req, res, next) => {
        driverCtrl.discover(req.params.driver, drivers)
        .then((results) => {
            res.json(results);
        }).catch((err) => {
            next(err);
        });
    });


  /*
  GET devices
  -> GET devices
  */
    app.get('/devices', (req, res, next) => {
        deviceCtrl.getAllDevices()
        .then((results) => {
            res.json(results);
        }).catch((err) => {
            next(err);
        });
    });

  /*
  GET devices/:type
  -> GET devices/speaker
  */
    app.get('/devices/type/:type', (req, res, next) => {
        deviceCtrl.getDevicesByType(req.params.type)
        .then((results) => {
            res.json(results);
        }).catch((err) => {
            next(err);
        });
    });

  /*
  GET devices/:type/:driver
  -> GET devices/speaker/sonos
  */
    app.get('/devices/driver/:driver', (req, res, next) => {
        deviceCtrl.getDevicesByTypeAndDriver(req.params.type, req.params.driver)
        .then((results) => {
            res.json(results);
        }).catch((err) => {
            next(err);
        });
    });

  /*
  GET device/:_id
  -> GET device/abc123
  */
    app.get('/device/:deviceId', (req, res, next) => {
        deviceCtrl.getDeviceById(req.params.deviceId)
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            next(err);
        });
    });

  /*
  POST device/:_id/:command
  -> POST device/abc123/on
  */
    app.post('/device/:deviceId/:command', jsonParser, (req, res, next) => {
        deviceCtrl.runCommand(req.params.deviceId, req.params.command, req.body, drivers)
        .then(() => {
            res.send();
        }).catch((err) => {
            next(err);
        });
    });

  /*
  GET drivers
  */
    app.get('/drivers', (req, res, next) => {
        driverCtrl.getDriversWithStats(drivers)
        .then((results) => {
            res.json(results);
        }).catch((err) => {
            next(err);
        });
    });


  /*
  GET event/:eventType
  -> GET event/device
  */
    app.get('/event/:eventType', (req, res, next) => {
        eventCtrl.getEventsByType(req.params.eventType, req.query.from)
        .then((results) => {
            res.json(results);
        }).catch((err) => {
            next(err);
        });
    });

    // Error handling middleware
    app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
        switch (err.type) {
        case 'Driver':
            console.error(err); // eslint-disable-line no-console
            res.status(500);
            return res.json({
                type: err.type,
                driver: err.driver,
                message: err.message
            });
        case 'BadRequest':
            res.status(400);
            return res.json({
                type: err.type,
                message: err.message
            });
        case 'NotFound':
            res.status(404);
            return res.json({
                type: err.type,
                message: err.message
            });
        case 'Validation':
            res.status(400);
            return res.json({
                type: err.type,
                message: err.message,
                errors: err.errors
            });
        case 'Connection':
            res.status(503);
            return res.json({
                code: 503,
                type: err.type,
                message: err.message
            });
        case 'Authentication':
            res.status(401);
            return res.json({
                type: err.type,
                message: err.message
            });
        default:
            console.error(err); // eslint-disable-line no-console
            res.status(500);
            return res.json({
                type: 'Internal'
            });
        }
    });

    return app;
};
