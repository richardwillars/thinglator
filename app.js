'use strict';

var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var md5 = require('md5');
var _ = require('underscore');
var fs = require('fs');
var Validator = require('jsonschema').Validator;
var jsonValidator = new Validator();
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

mongoose.connect('mongodb://localhost/homebox');

var models = require('./models');
var drivers = [];

function doesDriverExist(driverId, type) {
  return new Promise(function(resolve, reject) {
    if (!drivers[driverId]) {
      return resolve(false);
    }
    if (drivers[driverId].getType() !== type) {
      return resolve(false);
    }
    resolve(true);
  });
}

class DriverSettings {
  constructor(driverId) {
    this.driverId = driverId;
  }

  get() {
    var self = this;
    return new Promise(function(resolve, reject) {
      models['driver'].findOne({
        _id: self.driverId
      }).exec().then(function(result) {
        resolve(result.settings);
      }).catch(function(e) {
        reject(e);
      });
    })

  }

  set(settings) {
    return models['driver'].update({
      _id: this.driverId
    }, {
      settings: settings
    }, {
      upsert: true,
      setDefaultsOnInsert: true
    }).exec();
  }
}

function loadDrivers() {
  var driversArr = [];
  fs.readdirSync(__dirname + '/node_modules').forEach(function(file) {
    if (file.match(/homebox-driver-/) !== null) {
      var name = file.replace('homebox-driver-', '');
      var Driver = require('homebox-driver-' + name);


      var interfaces = {
        http: {}
      };
      driversArr[name] = new Driver(new DriverSettings(name), interfaces);
    }
  });
  return driversArr;
}

function createDevice(type, driver, deviceSpecs) {
  var deviceSpecsObj = new models[type](deviceSpecs);

  return deviceSpecsObj.validate()
    .then(function(validationFailed) {
      if (validationFailed) {
        var e = new Error(validationFailed);
        e.type = 'Validation';
      }

      var deviceObj = new models['device']({
        _id: md5(type + driver + deviceSpecsObj.deviceId),
        type: type,
        driver: driver,
        specs: deviceSpecsObj
      });
      return deviceObj.save();
    });
}

function updateDevice(device, specs) {
  var deviceSpecsObj = new models[device.type](specs);

  return deviceSpecsObj.validate()
    .then(function(validationFailed) {
      if (validationFailed) {
        throw new Error(validationFailed);
      }
      device.specs = specs;
      return device.save();
    });
}

var drivers = loadDrivers();

app.get('/authenticate/:type/:driver', function(req, res, next) {
  doesDriverExist(req.params.driver, req.params.type)
    .then(function(foundDriver) {
      //if found, load it
      if (foundDriver === false) {
        var e = new Error('driver not found');
        e.type = 'NotFound';
        throw e;
      }
      return drivers[req.params.driver];
    })
    .then(function(driver) {
      //call the getAuthenticationProcess method on the driver
      return driver.getAuthenticationProcess();
    })
    .then(function(authenticationProcess) {
      for (var i in authenticationProcess) {
        //validate the json
        var jsonSchema = models.authenticationSchemas.requested[authenticationProcess[i].type];
        if (!jsonSchema) {
          var e = new Error('validation schema not found');
          e.type = 'Driver';
          throw e;
        }
        var validated = jsonValidator.validate(authenticationProcess[i], jsonSchema);
        if (validated.errors.length !== 0) {
          var e = new Error(validated);
          e.type = 'Driver';
          throw e;
        }
      }
      res.json(authenticationProcess);
    })
    .catch(function(e) {
      if (e.type) {
        if (e.type === 'Driver') {
          e.driver = req.params.driver;
        }
      }
      next(e);
    });
});

app.post('/authenticate/:type/:driver/:stepId', jsonParser, function(req, res, next) {
  var driver;
  doesDriverExist(req.params.driver, req.params.type)
    .then(function(foundDriver) {
      //if found, load it
      if (foundDriver === false) {
        var e = new Error('driver not found');
        e.type = 'NotFound';
        throw e;
      }
      return drivers[req.params.driver];
    })
    .then(function(driverObj) {
      driver = driverObj;
      //call the getAuthenticationProcess method on the driver
      return driver.getAuthenticationProcess();
    })
    .then(function(authenticationProcess) {
      var stepId = parseInt(req.params.stepId);
      var step = authenticationProcess[stepId];
      if (!step) {
        var e = new Error('authentication step not found');
        e.type = 'NotFound';
        throw e;
      }

      //validate the json that's been sent by comparing it against the schema
      var jsonSchema = models.authenticationSchemas.returned[step.type];
      var validated = jsonValidator.validate(req.body, jsonSchema);
      if (validated.errors.length !== 0) {
        var e = new Error(validated);
        e.type = 'BadRequest';
        throw e;
      }
      //all good - call the correct authentication step method on the driver
      return driver['setAuthenticationStep' + stepId](req.body);
    })
    .then(function() {
      res.json({});
    })
    .catch(function(e) {
      if (e.type) {
        if (e.type === 'Driver') {
          e.driver = req.params.driver;
        }
      }
      next(e);
    });
});

/*
GET discover/:type/:driver
-> GET discover/speaker/sonos
*/
app.get('/discover/:type/:driver', function(req, res, next) {
  //check that the driver exists and that it matches the specified type
  var foundDevices = [];
  var existingDevices = [];

  doesDriverExist(req.params.driver, req.params.type)
    .then(function(foundDriver) {
      //if found, load it
      if (foundDriver === false) {
        var e = new Error('driver not found');
        e.type = 'NotFound';
        throw e;
      }
      return drivers[req.params.driver];
    })
    .then(function(driver) {
      //call the discover method on the driver and wait for it to return devices
      return driver.discover();
    })
    .then(function(devices) {
      foundDevices = devices;
      //get a list of existing devices from the db
      return models['device'].find({
        type: req.params.type,
        driver: req.params.driver
      }).exec();
    })
    .then(function(existingDevicesArr) {
      existingDevices = existingDevicesArr;

      //loop through existingDevices and determine if they exist in the discovery list
      var toUpdate = [];
      _.filter(existingDevices, function(obj) {
        return _.find(foundDevices, function(obj2) {
          if (obj._id === md5(req.params.type + req.params.driver + obj2.deviceId)) {
            toUpdate.push({
              device: obj,
              specs: obj2
            });
            return true;
          }
          return false;
        });
      });
      //if they do exist in the discovery list, update them
      var promises = [];
      for (var i in toUpdate) {
        promises.push(updateDevice(toUpdate[i].device, toUpdate[i].specs));
      }
      return Promise.all(promises);
    })
    .then(function() {
      //loop through existingDevices and determine if they don't exist in the discovery list
      var noLongerExists = _.filter(existingDevices, function(obj) {
        return !_.find(foundDevices, function(obj2) {
          return obj._id === md5(req.params.type + req.params.driver + obj2.deviceId);
        });
      });
      //if they don't exist in the discovery list, delete them
      if (noLongerExists.length === 0) {
        return;
      }
      var noLongerExistsIds = _.pluck(noLongerExists, '_id');
      return models['device'].remove({
        _id: {
          $in: noLongerExistsIds
        }
      }).exec();
    })
    .then(function() {
      //loop through foundDevices and determine if they don't exist in the discovery list
      var newDevices = _.filter(foundDevices, function(obj) {
        return !_.find(existingDevices, function(obj2) {
          return obj2._id === md5(req.params.type + req.params.driver + obj.deviceId);
        });
      });
      //if there are any other devices in discovery list, create them
      var promises = [];
      for (var i in newDevices) {
        promises.push(createDevice(req.params.type, req.params.driver, newDevices[i]));
      }
      return Promise.all(promises);
    })
    .then(function() {
      //get the entire list of devices from the db
      return models['device'].find({
        type: req.params.type,
        driver: req.params.driver
      }).exec();
    })
    .then(function(devices) {
      res.json(devices);
    })
    .catch(function(e) {
      if (e.type) {
        if (e.type === 'Driver') {
          e.driver = req.params.driver;
        }
      }
      next(e);
    });
});


/*
GET devices
-> GET devices
*/
app.get('/devices/', function(req, res, next) {
  return models['device'].find().exec()
    .then(function(devices) {
      res.json(devices);
    })
    .catch(function(err) {
      next(err);
    });
});

/*
GET devices/:type
-> GET devices/speaker
*/
app.get('/devices/:type', function(req, res, next) {
  return models['device'].find({
      type: req.params.type
    }).exec()
    .then(function(devices) {
      res.json(devices);
    })
    .catch(function(err) {
      next(err);
    });
});

/*
GET devices/:type/:driver
-> GET devices/speaker/sonos
*/
app.get('/devices/:type/:driver', function(req, res, next) {
  return models['device'].find({
      type: req.params.type,
      driver: req.params.driver
    }).exec()
    .then(function(devices) {
      res.json(devices);
    })
    .catch(function(err) {
      next(err);
    });
});

/*
GET device/:_id
-> GET device/abc123
*/
app.get('/device/:deviceId', function(req, res, next) {
  return models['device'].findOne({
      _id: req.params.deviceId
    }).exec()
    .then(function(device) {
      res.json(device);
    })
    .catch(function(err) {
      next(err);
    });
});

/*
POST device/:_id/:command
-> POST device/abc123/on
*/
app.post('/device/:deviceId/:command', jsonParser, function(req, res, next) {
  var device;
  return models['device'].findOne({
      _id: req.params.deviceId
    }).exec()
    .then(function(deviceObj) {
      device = deviceObj;
      if (typeof device.specs.capabilities[req.params.command] === "undefined") {
        var e = new Error('capability not found');
        e.type = 'BadRequest';
        throw e;
      }
      if (device.specs.capabilities[req.params.command] === false) {
        var e = new Error('capability not supported');
        e.type = 'BadRequest';
        throw e;
      }
      return drivers[deviceObj.driver];
    })
    .then(function(driver) {
      var fnName = 'capability_' + req.params.command;

      //if a schema is specified, confirm that the request body matches it
      var jsonSchema = models[device.type].schema.paths['capabilities.' + req.params.command].options.requestSchema;
      if (jsonSchema) {
        var validated = jsonValidator.validate(req.body, jsonSchema);
        if (validated.errors.length !== 0) {
          var e = new Error(validated);
          e.type = 'BadRequest';
          throw e;
        }
      }
      return driver[fnName](device, req.body);
    })
    .then(function(commandResult) {
      //confirm that the action response matches the schema
      var jsonSchema = models[device.type].schema.paths['capabilities.' + req.params.command].options.responseSchema;
      var validated = jsonValidator.validate(commandResult, jsonSchema);
      if (validated.errors.length !== 0) {
        var e = new Error(validated);
        e.type = 'Driver';
        throw e;
      }
      res.json(commandResult);
    })
    .catch(function(err) {
      next(err);
    });
});

/*
GET drivers
*/
app.get('/drivers', function(req, res, next) {
  var devicesGroupedByDrivers = [];
  models['device'].aggregate([{
      $group: {
        _id: '$driver',
        type: {
          $first: '$type'
        },
        deviceCount: {
          $sum: 1
        }
      }
    }]).exec()
    .then(function(results) {
      devicesGroupedByDrivers = results;
      var driversWithStats = [];
      for (var i in drivers) {
        var obj = {
          _id: drivers[i].getName(),
          type: drivers[i].getType(),
          deviceCount: 0
        };
        var foundStats = _.findWhere(devicesGroupedByDrivers, {
          _id: drivers[i].getName()
        });
        if (foundStats) {
          obj.deviceCount = foundStats.deviceCount;
        }
        driversWithStats.push(obj);
      }
      res.json(driversWithStats);
    })
    .catch(function(err) {
      next(err);
    });
});

app.use(function(err, req, res, next) {
  switch (err.type) {
    case 'Driver':
      console.log(err);
      res.status(500);
      res.json({
        code: 500,
        type: err.type,
        driver: err.driver,
        message: err.message
      });
      break;
    case 'BadRequest':
      res.status(400);
      return res.json({
        code: 400,
        type: err.type,
        message: err.message
      });
      break;
    case 'NotFound':
      res.status(404);
      return res.json({
        code: 404,
        type: err.type,
        message: err.message
      });
      break;
    case 'Validation':
      res.status(400);
      return res.json({
        code: 400,
        type: err.type,
        message: err.message,
        errors: err.errors
      });
      break;
    case 'Connection':
      res.status(503);
      return res.json({
        code: 503,
        type: err.type,
        message: err.message
      });
      break;
    case 'Authentication':
      res.status(401);
      return res.json({
        code: 401,
        type: err.type,
        message: err.message
      });
      break;
    default:
      console.log(err);
      console.log(err.stack);
      res.status(500);
      res.json({
        type: 'Internal',
        code: 500,
        stack: err.stack
      });
  }

});

app.listen(3000, function() {
  console.log('Homebox listening on port 3000!');
});