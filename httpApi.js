var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var authenticateCtrl = require('./controllers/authenticate');
var deviceCtrl = require('./controllers/device');
var eventCtrl = require('./controllers/event');
var driverCtrl = require('./controllers/driver');

module.exports = function(app, drivers) {

  //Error handling middleware
  app.use(function(err, req, res, next) {
    switch (err.type) {
      case 'Driver':
        console.log('Driver Error', err);
        res.status(500);
        return res.json({
          code: 500,
          type: err.type,
          driver: err.driver,
          message: err.message
        });
      case 'BadRequest':
        res.status(400);
        return res.json({
          code: 400,
          type: err.type,
          message: err.message
        });
      case 'NotFound':
        res.status(404);
        return res.json({
          code: 404,
          type: err.type,
          message: err.message
        });
      case 'Validation':
        res.status(400);
        return res.json({
          code: 400,
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
          code: 401,
          type: err.type,
          message: err.message
        });
      default:
        console.log(err);
        console.log(err.stack);
        res.status(500);
        return res.json({
          type: 'Internal',
          code: 500,
          stack: err.stack
        });
    }

  });

  app.get('/', function(req, res, next) {
    res.json({
      'Homebox': 'Oh, hi!'
    });
  });

  app.get('/authenticate/:type/:driver', function(req, res, next) {
    authenticateCtrl.getAuthenticationProcess(req.params.driver, req.params.type, drivers).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      next(err);
    });
  });

  app.post('/authenticate/:type/:driver/:stepId', jsonParser, function(req, res, next) {
    authenticateCtrl.authenticationStep(req.params.driver, req.params.type, drivers, req.params.stepId, req.body).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      next(err);
    });
  });

  /*
  GET discover/:type/:driver
  -> GET discover/speaker/sonos
  */
  app.get('/discover/:type/:driver', function(req, res, next) {
    driverCtrl.discover(req.params.driver, req.params.type, drivers).then(function(results) {
      res.json(results);
    }).catch(function(err) {
      next(err);
    })
  });


  /*
  GET devices
  -> GET devices
  */
  app.get('/devices', function(req, res, next) {
    deviceCtrl.getAllDevices().then(function(results) {
      res.json(results);
    }).catch(function(err) {
      next(err);
    });
  });

  /*
  GET devices/:type
  -> GET devices/speaker
  */
  app.get('/devices/:type', function(req, res, next) {
    deviceCtrl.getDevicesByType(req.params.type).then(function(results) {
      res.json(results);
    }).catch(function(err) {
      next(err);
    });
  });

  /*
  GET devices/:type/:driver
  -> GET devices/speaker/sonos
  */
  app.get('/devices/:type/:driver', function(req, res, next) {
    deviceCtrl.getDevicesByTypeAndDriver(req.params.type, req.params.driver).then(function(results) {
      res.json(results);
    }).catch(function(err) {
      next(err);
    });
  });

  /*
  GET device/:_id
  -> GET device/abc123
  */
  app.get('/device/:deviceId', function(req, res, next) {
    deviceCtrl.getDeviceById(req.params.deviceId).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      next(err);
    });
  });

  /*
  POST device/:_id/:command
  -> POST device/abc123/on
  */
  app.post('/device/:deviceId/:command', jsonParser, function(req, res, next) {
    deviceCtrl.runCommand(req.params.deviceId, req.params.command, req.body, drivers).then(function(result) {
      res.json(result);
    }).catch(function(err) {
      next(err);
    });
  });

  /*
  GET drivers
  */
  app.get('/drivers', function(req, res, next) {
    driverCtrl.getDriversWithStats(drivers).then(function(results) {
      res.json(results);
    }).catch(function(err) {
      next(err);
    });
  });


  /*
  GET event/:eventType
  -> GET event/device
  */
  app.get('/event/:eventType', function(req, res, next) {
    eventCtrl.getEventsByType(req.params.eventType, req.query.from).then(function(results) {
      res.json(results);
    }).catch(function(err) {
      next(err);
    });
  });

  return app;
}