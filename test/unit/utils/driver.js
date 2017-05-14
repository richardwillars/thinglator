

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mockery = require('mockery');

describe('utils/driver', () => {
    let moduleToBeTested,
        app,
        drivers;

    describe('doesDriverExist', () => {
        it('should return true if the driver exists and is of the correct type', (done) => {
			// call the module to be tested
            moduleToBeTested = require('../../../utils/driver');

            expect(moduleToBeTested.doesDriverExist).to.be.a.function;


            const driverId = 'abc';
            const type = 'light';
            const drivers = {
                def: {
                    getType() {
                        return 'foo';
                    }
                },
                abc: {
                    getType() {
                        return 'light';
                    }
                },
                ghi: {
                    getType() {
                        return 'foo';
                    }
                }
            };

            const promise = moduleToBeTested.doesDriverExist(driverId, type, drivers);

            expect(promise).to.be.an.object;
            promise.then((exists) => {
                expect(exists).to.equal(true);
                done();
            });
        });

        it('should return false if the driver exists but is not of the correct type', (done) => {
			// call the module to be tested
            moduleToBeTested = require('../../../utils/driver');

            expect(moduleToBeTested.doesDriverExist).to.be.a.function;


            const driverId = 'abc';
            const type = 'light';
            const drivers = {
                def: {
                    getType() {
                        return 'foo';
                    }
                },
                abc: {
                    getType() {
                        return 'bar';
                    }
                },
                ghi: {
                    getType() {
                        return 'foo';
                    }
                }
            };

            const promise = moduleToBeTested.doesDriverExist(driverId, type, drivers);

            expect(promise).to.be.an.object;
            promise.then((exists) => {
                expect(exists).to.equal(false);
                done();
            });
        });

        it('should return false if the driver does not exist', (done) => {
			// call the module to be tested
            moduleToBeTested = require('../../../utils/driver');

            expect(moduleToBeTested.doesDriverExist).to.be.a.function;


            const driverId = 'xyz';
            const type = 'light';
            const drivers = {
                def: {
                    getType() {
                        return 'foo';
                    }
                },
                abc: {
                    getType() {
                        return 'light';
                    }
                },
                ghi: {
                    getType() {
                        return 'foo';
                    }
                }
            };

            const promise = moduleToBeTested.doesDriverExist(driverId, type, drivers);

            expect(promise).to.be.an.object;
            promise.then((exists) => {
                expect(exists).to.equal(false);
                done();
            });
        });
    });

    describe('loadDrivers', () => {
        beforeEach((done) => {
			// mock out fs
            const fsMock = {
                readdirSync(dirName) {
                    return ['thinglator-driver-foo', 'thinglator-zoo-boo', 'something-else', 'bla.js', 'thinglator-driver-bla'];
                }
            };

            const modelsMock = {
                light: {
                    DeviceEventEmitter: {}
                },

                device: {
                    Model: {
                        find(query) {
                            return {
                                exec(cb) {
                                    cb(null, [{
                                    _id: 'abc123'
                                }, {
                                _id: 'def234'
                            }]);
                                }
                            };
                        }
                    }
                }
            };

            const driverFooMock = class FooDriver {
                constructor(driverSettingsObj, interfaces) {

                }

                getType() {
                    return 'light';
                }

                setEventEmitter(eventEmitter) {

                }

                initDevices() {

                }
			};

            const driverBlaMock = class BlaDriver {
                constructor(driverSettingsObj, interfaces) {

                }

                getType() {
                    return 'light';
                }

                setEventEmitter(eventEmitter) {

                }

                initDevices() {

                }
			};

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);
            mockery.registerMock('fs', fsMock);
            mockery.registerMock('thinglator-driver-foo', driverFooMock);
            mockery.registerMock('thinglator-driver-bla', driverBlaMock);
            done();
        });

        afterEach((done) => {
            mockery.deregisterMock('fs');
            mockery.deregisterMock('thinglator-driver-bla');
            mockery.deregisterMock('thinglator-driver-foo');
            mockery.deregisterMock('../models');
            mockery.disable();
            done();
        });

        it('should load valid drivers', () => {
			// call the module to be tested
            moduleToBeTested = require('../../../utils/driver');
            expect(moduleToBeTested.loadDrivers).to.be.a.function;

            const loadedDrivers = moduleToBeTested.loadDrivers();
            expect(Object.keys(loadedDrivers).length).to.equal(2);

            expect(loadedDrivers.foo).to.be.an.object;
            expect(loadedDrivers.foo.getType()).to.equal('light');

            expect(loadedDrivers.bla).to.be.an.object;
            expect(loadedDrivers.bla.getType()).to.equal('light');
        });
    });

    describe('DriverSettings class', () => {
        afterEach((done) => {
            mockery.deregisterMock('../models');
            mockery.disable();
            done();
        });


        it('should get the DriverSettings class', () => {
            moduleToBeTested = require('../../../utils/driver');
            expect(moduleToBeTested.getDriverSettingsClass).to.be.a.function;
            const classObj = moduleToBeTested.getDriverSettingsClass();
            expect(classObj).to.be.a.function;
        });

        it('should create a new instance of the DriverSettings class', () => {
            moduleToBeTested = require('../../../utils/driver');
            const classObj = moduleToBeTested.getDriverSettingsClass();
            const instance = new classObj('foo');
            expect(instance).to.be.an.object;
        });

        it('the get method should return the settings for the driver', (done) => {
            const modelsMock = {
                driver: {
                    Model: {
                        findOne(query) {
                            return {
                                exec () {
                                return Promise.resolve({
                                settings: {
                                foo: 'bar',
                                boo: 'zoo'
                            }
                            });
                            }
                            };
                        }
                    }
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../../utils/driver');
            const classObj = moduleToBeTested.getDriverSettingsClass();
            const instance = new classObj('foo');
            const promise = instance.get();
            expect(promise).to.be.an.object;
            promise.then((settings) => {
                expect(settings.foo).to.equal('bar');
                expect(settings.boo).to.equal('zoo');
                done();
            });
        });

        it('the get method should broadcast errors appropriately', (done) => {
            const modelsMock = {
                driver: {
                    Model: {
                        findOne(query) {
                            return {
                                exec () {
                                throw new Error('example error thrown by the db');
                            }
                            };
                        }
                    }
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../../utils/driver');
            const classObj = moduleToBeTested.getDriverSettingsClass();
            const instance = new classObj('foo');
            const promise = instance.get();
            expect(promise).to.be.an.object;
            promise.catch((err) => {
                expect(err.message).to.equal('example error thrown by the db');
                done();
            });
        });

        it('the set method should save the settings for the driver', (done) => {
            const modelsMock = {
                driver: {
                    Model: {
                        update(query, obj, updateSettings) {
                            return {
                                exec () {
                                return Promise.resolve();
                            }
                            };
                        }
                    }
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });

            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../../utils/driver');
            const classObj = moduleToBeTested.getDriverSettingsClass();
            const instance = new classObj('foo');
            const promise = instance.set({
                foo: 'bar',
                boo: 'zoo'
            });
            expect(promise).to.be.an.object;
            promise.then(() => {
                done();
            });
        });
    });
});
