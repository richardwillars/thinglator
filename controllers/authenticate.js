const getAuthenticationProcess = async (driverId, drivers, driverUtils, models, jsonValidator) => {
  try {
    const foundDriver = await driverUtils.doesDriverExist(driverId, drivers);

    // if found, load it
    if (foundDriver === false) {
      const e = new Error('driver not found');
      e.type = 'NotFound';
      throw e;
    }
    const driver = drivers[driverId];

    // call the getAuthenticationProcess method on the driver
    const authenticationProcess = await driver.api.authentication_getSteps();

    authenticationProcess.forEach((authenticationStep) => {
      // validate the json
      if (typeof models.authenticationSchemas.requested[authenticationStep.type] === 'undefined') {
        const e = new Error(`${authenticationStep.type} validation schema not found`);
        e.type = 'Driver';
        throw e;
      }
      const jsonSchema = models.authenticationSchemas.requested[authenticationStep.type];

      const validated = jsonValidator.validate(authenticationStep, jsonSchema);
      if (validated.errors.length !== 0) {
        const e = new Error('the driver produced invalid authentication steps');
        e.type = 'Validation';
        e.errors = validated.errors;
        throw e;
      }
    });
    return authenticationProcess;
  } catch (e) {
    if (e.type) {
      if (e.type === 'Driver') {
        e.driver = driverId;
      }
    }
    throw e;
  }
};


const authenticationStep = async (driverId, driverList, stepId, body, driverUtils, models, jsonValidator) => {
  try {
    const foundDriver = await driverUtils.doesDriverExist(driverId, driverList);

    // if found, load it
    if (foundDriver === false) {
      const e = new Error('driver not found');
      e.type = 'NotFound';
      throw e;
    }
    const driver = driverList[driverId];

    // call the getAuthenticationProcess method on the driver
    const authenticationProcess = await driver.api.authentication_getSteps();

    const step = authenticationProcess[parseInt(stepId, 10)];
    if (typeof step === 'undefined') {
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
      throw e;
    }
    // all good - call the correct authentication step method on the driver
    const result = await driver.api[`authentication_step${stepId}`](body);

    const resultSchema = {
      $schema: 'http://json-schema.org/draft-04/schema#',
      type: 'object',
      properties: {
        success: {
          type: 'boolean',
        },
        message: {
          type: 'string',
        },
      },
      required: [
        'success',
      ],
    };

    if (result.success === false) {
      resultSchema.required.push('message');
    }
    const validated2 = jsonValidator.validate(result, resultSchema);
    if (validated2.errors.length !== 0) {
      const e = new Error('the driver produced invalid json');
      e.type = 'Driver';
      e.errors = validated2.errors;
      throw e;
    }

    return result;
  } catch (e) {
    if (e.type) {
      if (e.type === 'Driver') {
        e.driver = driverId;
      }
    }
    throw e;
  }
};

module.exports = (jsonValidator, models, driverUtils, driverList) => ({
  getAuthenticationProcess: driverId => getAuthenticationProcess(driverId, driverList, driverUtils, models, jsonValidator),
  authenticationStep: (driverId, stepId, body) => authenticationStep(driverId, driverList, stepId, body, driverUtils, models, jsonValidator),
});
