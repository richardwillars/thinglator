var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var md5 = require('md5');
var _ = require('underscore');
var fs = require('fs');
var Validator = require('jsonschema').Validator;
var jsonValidator = new Validator();

mongoose.connect('mongodb://localhost/homebox');

var models = require('./models');


function doesDriverExist(driverId, type) {
  return new Promise(function(resolve, reject) {
    try {
      var driver = require('./drivers/homebox-driver-' + driverId);
      if (driver.type !== type) {
        return resolve(false);
      }
      resolve(true);
    } catch (ex) {
      resolve(false);
    }
  });
}

function loadDriver(driverId) {
  return new Promise(function(resolve, reject) {
    try {
      var driver = require('./drivers/homebox-driver-' + driverId);
      resolve(driver);
    } catch (ex) {
      resolve(null);
    }
  });
}

function createDevice(type, driver, deviceSpecs) {
  var deviceSpecsObj = new models[type](deviceSpecs);

  return deviceSpecsObj.validate()
    .then(function(validationFailed) {
      if (validationFailed) {
        throw new Error(validationFailed);
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

/*
GET discover/:type/:driver
-> GET discover/speaker/sonos
*/
app.get('/discover/:type/:driver', function(req, res) {
  //check that the driver exists and that it matches the specified type
  var foundDevices = [];
  var existingDevices = [];

  doesDriverExist(req.params.driver, req.params.type)
    .then(function(foundDriver) {
      //if found, load it
      if (foundDriver === false) {
        throw new Error(404, 'driver not found');
      }
      return loadDriver(req.params.driver);
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
      console.log(e);
    });
});


/*
GET devices
-> GET devices
*/
app.get('/devices/', function(req, res) {
  return models['device'].find().exec()
    .then(function(devices) {
      res.json(devices);
    });
});

/*
GET devices/:type
-> GET devices/speaker
*/
app.get('/devices/:type', function(req, res) {
  return models['device'].find({
      type: req.params.type
    }).exec()
    .then(function(devices) {
      res.json(devices);
    });
});

/*
GET devices/:type/:driver
-> GET devices/speaker/sonos
*/
app.get('/devices/:type/:driver', function(req, res) {
  return models['device'].find({
      type: req.params.type,
      driver: req.params.driver
    }).exec()
    .then(function(devices) {
      res.json(devices);
    });
});

/*
GET device/:_id
-> GET device/abc123
*/
app.get('/device/:deviceId', function(req, res) {
  return models['device'].findOne({
      _id: req.params.deviceId
    }).exec()
    .then(function(device) {
      res.json(device);
    });
});

/*
POST device/:_id/:command
-> POST device/abc123/on
*/
app.post('/device/:deviceId/:command', function(req, res) {
  var device;
  return models['device'].findOne({
      _id: req.params.deviceId
    }).exec()
    .then(function(deviceObj) {
      device = deviceObj;
      if(typeof device.specs.capabilities[req.params.command]==="undefined") {
        throw new Error('capability not found');
      }
      if(device.specs.capabilities[req.params.command]===false) {
        throw new Error('capability not supported');
      }
      return loadDriver(device.driver);
    })
    .then(function(driver) {
      var fnName = 'capability_'+req.params.command;
      return driver[fnName](device,req.body);
    })
    .then(function(commandResult) {
      var jsonSchema = models.speaker.schema.paths['capabilities.'+req.params.command].options.responseSchema;
      var validated = jsonValidator.validate(commandResult,jsonSchema);
      if(validated.errors.length!==0) {
        throw new Error(validated);
      }
      res.json(commandResult);
    })
    .catch(function(e) {
      console.log('error',e);
      res.send({});
    })
});

/*
GET drivers
*/
app.get('/drivers', function(req, res) {
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

      var promises = [];
      fs.readdirSync(__dirname + '/drivers').forEach(function(file) {
        if (file.match(/\.js$/) !== null && file !== 'index.js') {
          var name = file.replace('.js', '').replace('homebox-driver-', '');
          promises.push(loadDriver(name));
        }
      });
      return Promise.all(promises);
    }).then(function(drivers) {
      var driversWithStats = _.map(drivers, function(driver) {
        var obj = {
          _id: driver.name,
          type: driver.type,
          deviceCount: 0
        };
        var foundStats = _.findWhere(devicesGroupedByDrivers, {
          _id: driver.name
        });
        if (foundStats) {
          obj.deviceCount = foundStats.deviceCount;
        }
        return obj;
      });
      res.json(driversWithStats);
    });
});

app.listen(3000, function() {
  console.log('Homebox listening on port 3000!');
});