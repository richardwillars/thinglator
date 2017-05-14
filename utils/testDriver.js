
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const models = require('../models');

module.exports = function driverTests(driverName, driver, type, driverInterface) {
    let driverSettings;
    let interfaces = {};
    let eventEmitter;

    describe('driver structure', () => {
        beforeEach(() => {
            driverSettings = new class DriverSettings {
                get() {
                    return Promise.resolve({});
                }
                set() {
                    return Promise.resolve();
                }
            }();

            interfaces = {
                http: {}
            };

            eventEmitter = new EventEmitter2();
        });

        describe('core driver methods', () => {
            it('should be exposed as a class', () => {
                expect(driver).to.be.a.class;
                const driverInstance = new driver();
                expect(driverInstance instanceof driver).to.equal(true);
            });

            it('should have a init method that accepts an instance of the driver settings class, an object containing a list of available interfaces and an event emitter', () => {
                const driverInstance = new driver(driverSettings, interfaces, eventEmitter);

                expect(typeof driverInstance.init).to.equal('function');
                // expect(driverInstance.init()).to.equal(driverName);
            });

            it('should have a getName method that returns the name of the driver', () => {
                const driverInstance = new driver();
                expect(typeof driverInstance.getName).to.equal('function');
                expect(driverInstance.getName()).to.equal(driverName);
            });

            it('should have a getType method that returns the type of the driver', () => {
                const driverInstance = new driver();
                expect(typeof driverInstance.getType).to.equal('function');
                expect(driverInstance.getType()).to.equal(type);
            });

            it('should return a valid type of driver using the getType method', () => {
                expect(typeof models[type]).to.equal('object');
            });

            it('should have a getInterface method that returns the interface required by the driver', () => {
                const driverInstance = new driver();
                driverInstance.init(driverSettings, interfaces, eventEmitter);
                expect(typeof driverInstance.getInterface).to.equal('function');
                expect(driverInstance.getInterface()).to.equal(driverInterface);
            });

            it('should have an initDevices method that accepts an array of devices to be initialised if required', () => {
                const driverInstance = new driver(driverSettings, interfaces, eventEmitter);
                expect(typeof driverInstance.initDevices).to.equal('function');
            });

            it('should have a getEventEmitter method that returns the event emitter for the driver', () => {
                const driverInstance = new driver(driverSettings, interfaces, eventEmitter);
                driverInstance.init(driverSettings, interfaces, eventEmitter);
                expect(typeof driverInstance.getEventEmitter).to.equal('function');
                expect(driverInstance.getEventEmitter()).to.equal(eventEmitter);
            });

            it('should have a getAuthenticationProcess method that returns the authorisation process for the driver as an array', () => {
                const driverInstance = new driver(driverSettings, interfaces, eventEmitter);
                expect(typeof driverInstance.getAuthenticationProcess).to.equal('function');
                expect(driverInstance.getAuthenticationProcess()).to.be.instanceof(Array);
            });

            it('should have a discover method that promises to find and return all active devices', () => {
                const driverInstance = new driver(driverSettings, interfaces, eventEmitter);
                expect(typeof driverInstance.discover).to.equal('function');
            });
        });

        describe(`${type} capabilities`, () => {
            let capabilities = [];
            beforeEach(() => {
                capabilities = Object.getOwnPropertyNames(driver.prototype).filter(r => r.startsWith('capability_'));
            });

            it('should expose at least one capability', () => {
                expect(capabilities.length > 0).to.equal(true);
            });

            it('should only expose valid capabilities', () => {
                const validCapabilities = models[type].Model.schema.paths;
                capabilities.forEach((capability) => {
                    expect(typeof validCapabilities[`capabilities.${capability.substring(11)}`]).to.equal('object', `${capability.substring(11)} is not a valid capability for ${type}`);
                });
            });
        });
    });
};
