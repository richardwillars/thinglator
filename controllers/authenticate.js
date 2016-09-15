var models = require('../models');
var driverUtils = require('../utils/driver');
var Validator = require('jsonschema').Validator;
var jsonValidator = new Validator();

var controller = {
  getAuthenticationProcess: function(driverId, type, drivers) {
    return driverUtils.doesDriverExist(driverId, type, drivers)
      .then(function(foundDriver) {
        //if found, load it
        if (foundDriver === false) {
          var e = new Error('driver not found');
          e.type = 'NotFound';
          throw e;
        }
        return drivers[driverId];
      })
      .then(function(driver) {
        //call the getAuthenticationProcess method on the driver
        return driver.getAuthenticationProcess();
      })
      .then(function(authenticationProcess) {
        for (var i in authenticationProcess) {
          //validate the json
          if(typeof models.authenticationSchemas.requested[authenticationProcess[i].type] === "undefined") {
            var e = new Error('validation schema not found');
            e.type = 'Driver';
            throw e;
          }
          var jsonSchema = models.authenticationSchemas.requested[authenticationProcess[i].type];

          var validated = jsonValidator.validate(authenticationProcess[i], jsonSchema);
          if (validated.errors.length !== 0) {
            var e = new Error('the driver produced invalid json');
            e.type = 'Validation';
            e.errors = validated.errors;
            throw e;
          }
        }
        return authenticationProcess;
      })
      .catch(function(e) {
        if (e.type) {
          if (e.type === 'Driver') {
            e.driver = driverId;
          }
        }
        throw e;
      });
  },


  authenticationStep: function(driverId, type, drivers, stepId, body) {
    var steppy = stepId; //for some reason access stepId further down the promises sets it to undefined.
    var driver;
    return driverUtils.doesDriverExist(driverId, type, drivers)
      .then(function(foundDriver) {
        //if found, load it
        if (foundDriver === false) {
          var e = new Error('driver not found');
          e.type = 'NotFound';
          throw e;
        }
        return drivers[driverId];
      })
      .then(function(driverObj) {
        driver = driverObj;
        //call the getAuthenticationProcess method on the driver
        return driver.getAuthenticationProcess();
      })
      .then(function(authenticationProcess) {
        var stepId = parseInt(steppy);
        var step = authenticationProcess[steppy];
        if (!step) {
          var e = new Error('authentication step not found');
          e.type = 'NotFound';
          throw e;
        }

        //validate the json that's been sent by comparing it against the schema
        var jsonSchema = models.authenticationSchemas.returned[step.type];
        var validated = jsonValidator.validate(body, jsonSchema);
        if (validated.errors.length !== 0) {
          var e = new Error(validated);
          e.type = 'BadRequest';
          throw e;
        }
        //all good - call the correct authentication step method on the driver
        return driver['setAuthenticationStep' + stepId](body);
      })
      .then(function(result) {
        var resultSchema = {
          "$schema": "http://json-schema.org/draft-04/schema#",
          "type": "object",
          "properties": {
            "success": {
              "type": "boolean"
            },
            "message": {
              "type": "string"
            }
          },
          "required": [
            "success"
          ]
        };

        if (result.success === false) {
          resultSchema.required.push("message");
        }
        var validated = jsonValidator.validate(result, resultSchema);
        if (validated.errors.length !== 0) {
          var e = new Error(validated);
          e.type = 'BadRequest';
          throw e;
        }

        return result;
      })
      .catch(function(e) {
        if (e.type) {
          if (e.type === 'Driver') {
            e.driver = driverId;
          }
        }
        throw e;
      });
  }
};

module.exports = controller;