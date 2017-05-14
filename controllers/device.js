const Validator = require('jsonschema').Validator;

const models = require('../models');

const jsonValidator = new Validator();

const controller = {
    getAllDevices() {
        return models.device.Model.find().lean().exec()
        .then(devices => devices);
    },
    getDevicesByType(type) {
        return models.device.Model.find({
            type
        }).lean().exec()
        .then(devices => devices);
    },
    getDevicesByTypeAndDriver(type, driverId) {
        return models.device.Model.find({
            type,
            driver: driverId
        }).lean().exec()
        .then(devices => devices);
    },
    getDeviceById(deviceId) {
        return models.device.Model.findOne({
            _id: deviceId
        }).lean().exec().then((device) => {
            if (!device) {
                const e = new Error('device not found');
                e.type = 'NotFound';
                throw e;
            }
            return device;
        });
    },
    runCommand(deviceId, command, body, drivers) {
        let device;
        let driverObj;
        return models.device.Model.findOne({
            _id: deviceId
        }).lean().exec()
        .then((deviceObj) => {
            device = deviceObj;
            if (!deviceObj) {
                const e = new Error('device not found');
                e.type = 'NotFound';
                throw e;
            }
            if (typeof device.specs.capabilities[command] === 'undefined') {
                const e = new Error('capability not found');
                e.type = 'BadRequest';
                throw e;
            }
            if (device.specs.capabilities[command] === false) {
                const e = new Error('capability not supported');
                e.type = 'BadRequest';
                throw e;
            }
            driverObj = drivers[deviceObj.driver];
        }).then(() => {
            const fnName = `capability_${command}`;
            // if a schema is specified, confirm that the request body matches it
            const jsonSchema = models[device.type].Model.schema.paths[`capabilities.${command}`].options.requestSchema;
            if (jsonSchema) {
                const validated = jsonValidator.validate(body, jsonSchema);
                if (validated.errors.length !== 0) {
                    const e = new Error('the supplied json is invalid');
                    e.type = 'Validation';
                    e.errors = validated.errors;
                    throw e;
                }
            }
            return driverObj[fnName](device, body);
        })
        .then((commandResult) => {
        // confirm that the action response matches the schema
            const jsonSchema = models[device.type].Model.schema.paths[`capabilities.${command}`].options.responseSchema;
            const validated = jsonValidator.validate(commandResult, jsonSchema);
            if (validated.errors.length !== 0) {
                const e = new Error('the driver produced invalid json');
                e.type = 'Validation';
                e.errors = validated.errors;
                throw e;
            }

            const ee = driverObj.getEventEmitter();
            const eventName = models[device.type].Model.schema.paths[`capabilities.${command}`].options.eventName;
            ee.emit(eventName, driverObj.getName(), device._id, commandResult);
        });
    }
};

module.exports = controller;
