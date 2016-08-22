var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var authenticateCtrl = require('./controllers/authenticate');
var deviceCtrl = require('./controllers/device');
var eventCtrl = require('./controllers/event');
var driverCtrl = require('./controllers/driver');

module.exports = function(app, drivers) {

  app.get('/authenticate/:type/:driver', function(req, res, next) {
    authenticateCtrl.getAuthenticationProcess(req.params.driver, req.params.type, drivers).then(function(result) {
      res.json(result);
    }).catch(function(e) {
      next(e);
    });
  });

  app.post('/authenticate/:type/:driver/:stepId', jsonParser, function(req, res, next) {
    authenticateCtrl.authenticationStep(req.params.driver, req.params.type, drivers, req.params.stepId, req.body).then(function(result) {
      res.json(result);
    }).catch(function(e) {
      next(e);
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
  app.get('/devices/', function(req, res, next) {
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
}