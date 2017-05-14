const Validator = require('jsonschema').Validator;

const models = require('../models');
const driverUtils = require('../utils/driver');

const jsonValidator = new Validator();

const controller = {
    getAuthenticationProcess(driverId, type, drivers) {
        return driverUtils.doesDriverExist(driverId, type, drivers)
      .then((foundDriver) => {
        // if found, load it
          if (foundDriver === false) {
              const e = new Error('driver not found');
              e.type = 'NotFound';
              throw e;
          }
          return drivers[driverId];
      })
      .then(driver =>
        // call the getAuthenticationProcess method on the driver
           driver.getAuthenticationProcess())
      .then((authenticationProcess) => {
          for (const i in authenticationProcess) {
          // validate the json
              if (typeof models.authenticationSchemas.requested[authenticationProcess[i].type] === 'undefined') {
                  const e = new Error('validation schema not found');
                  e.type = 'Driver';
                  throw e;
              }
              const jsonSchema = models.authenticationSchemas.requested[authenticationProcess[i].type];

              const validated = jsonValidator.validate(authenticationProcess[i], jsonSchema);
              if (validated.errors.length !== 0) {
                  const e = new Error('the driver produced invalid json');
                  e.type = 'Validation';
                  e.errors = validated.errors;
                  throw e;
              }
          }
          return authenticationProcess;
      })
      .catch((e) => {
          if (e.type) {
              if (e.type === 'Driver') {
                  e.driver = driverId;
              }
          }
          throw e;
      });
    },


    authenticationStep(driverId, type, drivers, stepId, body) {
        const steppy = stepId; // for some reason access stepId further down the promises sets it to undefined.
        let driver;
        return driverUtils.doesDriverExist(driverId, type, drivers)
      .then((foundDriver) => {
        // if found, load it
          if (foundDriver === false) {
              const e = new Error('driver not found');
              e.type = 'NotFound';
              throw e;
          }
          return drivers[driverId];
      })
      .then((driverObj) => {
          driver = driverObj;
        // call the getAuthenticationProcess method on the driver
          return driver.getAuthenticationProcess();
      })
      .then((authenticationProcess) => {
          const stepId = parseInt(steppy, 10);
          const step = authenticationProcess[steppy];
          if (!step) {
              const e = new Error('authentication step not found');
              e.type = 'NotFound';
              throw e;
          }

        // validate the json that's been sent by comparing it against the schema
          const jsonSchema = models.authenticationSchemas.returned[step.type];
          const validated = jsonValidator.validate(body, jsonSchema);
          if (validated.errors.length !== 0) {
              const e = new Error('the body is invalid');
              e.type = 'Validation';
              e.errors = validated.errors;
          }
        // all good - call the correct authentication step method on the driver
          return driver[`setAuthenticationStep${stepId}`](body);
      })
      .then((result) => {
          const resultSchema = {
              $schema: 'http://json-schema.org/draft-04/schema#',
              type: 'object',
              properties: {
                  success: {
                      type: 'boolean'
                  },
                  message: {
                      type: 'string'
                  }
              },
              required: [
                  'success'
              ]
          };

          if (result.success === false) {
              resultSchema.required.push('message');
          }
          const validated = jsonValidator.validate(result, resultSchema);
          if (validated.errors.length !== 0) {
              const e = new Error('the driver produced invalid json');
              e.type = 'Driver';
              e.errors = validated.errors;
          }

          return result;
      })
      .catch((e) => {
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
