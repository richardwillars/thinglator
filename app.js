var express = require('express');
var app = express();
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/homebox');

var Device = require('./models/device').Device;
var Speaker = require('./models/speaker').Speaker;

function doesDriverExist(driverId,type) {
	return new Promise(function(resolve,reject) {
		try {
		    var driver = require('./drivers/homebox-driver-'+driverId);
		    if(driver.type!==type) {
		    	return resolve(false);
		    }
		    resolve(true);
		}
		catch (ex) {
			resolve(false);
		}
	});
}

function loadDriver(driverId) {
	return new Promise(function(resolve,reject) {
		try {
		    var driver = require('./drivers/homebox-driver-'+driverId);
		    resolve(driver);
		}
		catch (ex) {
			resolve(null);
		}
	});
}

function createDevice(type,driver,deviceSpecs) {
	console.log('createDevice');
	var deviceSpecsObj = new Speaker(deviceSpecs);

    return deviceSpecsObj.validate()
    .then(function(validated) {
    	console.log(validated);
    	var deviceObj = new Device({
			type: type,
			driver: driver,
			specs: deviceSpecsObj
		});
    	return deviceObj.save();
    });
}

// GET discover/speaker/sonos
app.get('/discover/:type/:driver', function (req, res) {
  //check that the driver exists and that it matches the specified type
  var foundDevices = [];
  doesDriverExist(req.params.driver,req.params.type)
  	.then(function(foundDriver) {
  		//if found, load it
  		if(foundDriver===false) {
  			throw new Error(404,'driver not found');
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
  		return Device.find({ type: req.params.type, driver: req.params.driver }).exec();
  	})
  	.then(function(existingDevices) {
  		var promises = [];
  		for(var i in foundDevices) {
  			promises.push(createDevice(req.params.type,req.params.driver,foundDevices[i]));
  		}
  		return Promise.all(promises);
  	})
  	.then(function() {
  		//get a list of existing devices from the db
  		return Device.find({ type: req.params.type, driver: req.params.driver }).exec();
  	})
  	.then(function(devices) {
  		res.json(devices);
  	})
  	.catch(function(e) {
  		console.log(e);
  	});
  	
  //add new devices to the database
  //update existing devices in the database (where appropriate)
  //delete non-existant devices in the database (where appropriate)
  //return the list of devices (emulate calling GET /devices/:type/:driver)
});


/*
GET devices
-> GET devices
*/
app.get('/devices/', function (req, res) {
	return Device.find().exec()
	.then(function(devices) {
		res.json(devices);
	});
});

/*
GET devices/:type
-> GET devices/speaker
*/
app.get('/devices/:type', function (req, res) {
	return Device.find({ type: req.params.type }).exec()
	.then(function(devices) {
		res.json(devices);
	});
});

/*
GET devices/:type/:driver
-> GET devices/speaker/sonos
*/
app.get('/devices/:type/:driver', function (req, res) {
	return Device.find({ type: req.params.type, driver: req.params.driver }).exec()
	.then(function(devices) {
		res.json(devices);
	});
});

/*
GET device/:_id
-> GET device/abc123
*/


app.listen(3000, function () {
  console.log('homebox listening on port 3000!');
});