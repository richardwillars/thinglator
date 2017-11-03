const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mockery = require('mockery');

let moduleToBeTested;

describe('controllers/device', () => {
    let modelsMock;

    afterEach((done) => {
        mockery.deregisterMock('../models');
        mockery.deregisterMock('jsonschema');
        mockery.disable();
        done();
    });

    describe('getAllDevices', () => {
        it('should return a list of devices', () => {
            const deviceModel = {
                find() {},
                lean() {},
                exec() {}
            };

            const findStub = sinon.stub(deviceModel, 'find', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve([{
                foo: 'bar'
            }, {
                foo: 'bar'
            }]));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../controllers/device');

            expect(moduleToBeTested.getAllDevices).to.be.a.function;
            return moduleToBeTested.getAllDevices()
				.then((result) => {
    expect(JSON.stringify(result)).to.equal(JSON.stringify([{
        foo: 'bar'
    }, {
        foo: 'bar'
    }]));

    expect(findStub).to.have.been.calledOnce;
    expect(findStub).to.have.been.calledWith();

    expect(leanStub).to.have.been.calledOnce;

    expect(execStub).to.have.been.calledOnce;
});
        });

        it('should catch any errors and throw them up the promise', () => {
            const deviceModel = {
                find() {},
                lean() {},
                exec() {}
            };

            const findStub = sinon.stub(deviceModel, 'find', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const err = new Error('something went wrong');
            err.type = 'BadRequest';

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.reject(err));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../controllers/device');
            expect(moduleToBeTested.getAllDevices).to.be.a.function;
            return moduleToBeTested.getAllDevices().catch((errThrown) => {
                expect(errThrown).to.equal(err);
            });
        });
    });

    describe('getDevicesByType', () => {
        it('should return a list of devices of a certain type', () => {
            const deviceModel = {
                find() {},
                lean() {},
                exec() {}
            };

            const findStub = sinon.stub(deviceModel, 'find', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve([{
                foo: 'bar'
            }, {
                foo: 'bar'
            }]));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../controllers/device');

            expect(moduleToBeTested.getDevicesByType).to.be.a.function;
            return moduleToBeTested.getDevicesByType('foo')
				.then((result) => {
    expect(JSON.stringify(result)).to.equal(JSON.stringify([{
        foo: 'bar'
    }, {
        foo: 'bar'
    }]));

    expect(findStub).to.have.been.calledOnce;
    expect(findStub).to.have.been.calledWith({
        type: 'foo'
    });

    expect(leanStub).to.have.been.calledOnce;

    expect(execStub).to.have.been.calledOnce;
});
        });

        it('should catch any errors and throw them up the promise', () => {
            const deviceModel = {
                find() {},
                lean() {},
                exec() {}
            };

            const findStub = sinon.stub(deviceModel, 'find', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const err = new Error('something went wrong');
            err.type = 'BadRequest';

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.reject(err));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../controllers/device');
            expect(moduleToBeTested.getDevicesByType).to.be.a.function;
            return moduleToBeTested.getDevicesByType('bar').catch((errThrown) => {
                expect(errThrown).to.equal(err);
            });
        });
    });

    describe('getDevicesByTypeAndDriver', () => {
        it('should return a list of devices of a certain type and belong to a certain driver', () => {
            const deviceModel = {
                find() {},
                lean() {},
                exec() {}
            };

            const findStub = sinon.stub(deviceModel, 'find', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve([{
                foo: 'bar'
            }, {
                foo: 'bar'
            }]));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../controllers/device');

            expect(moduleToBeTested.getDevicesByTypeAndDriver).to.be.a.function;
            return moduleToBeTested.getDevicesByTypeAndDriver('foo', 'bar')
				.then((result) => {
    expect(JSON.stringify(result)).to.equal(JSON.stringify([{
        foo: 'bar'
    }, {
        foo: 'bar'
    }]));

    expect(findStub).to.have.been.calledOnce;
    expect(findStub).to.have.been.calledWith({
        type: 'foo',
        driver: 'bar'
    });

    expect(leanStub).to.have.been.calledOnce;

    expect(execStub).to.have.been.calledOnce;
});
        });

        it('should catch any errors and throw them up the promise', () => {
            const deviceModel = {
                find() {},
                lean() {},
                exec() {}
            };

            const findStub = sinon.stub(deviceModel, 'find', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const err = new Error('something went wrong');
            err.type = 'BadRequest';

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.reject(err));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../controllers/device');
            expect(moduleToBeTested.getDevicesByTypeAndDriver).to.be.a.function;
            return moduleToBeTested.getDevicesByTypeAndDriver('bar', 'foo').catch((errThrown) => {
                expect(errThrown).to.equal(err);
            });
        });
    });

    describe('getDeviceById', () => {
        it('should return a list of devices of a certain type', () => {
            const deviceModel = {
                findOne() {},
                lean() {},
                exec() {}
            };

            const findOneStub = sinon.stub(deviceModel, 'findOne', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve({
                foo: 'bar'
            }));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../controllers/device');

            expect(moduleToBeTested.getDeviceById).to.be.a.function;
            return moduleToBeTested.getDeviceById('foo')
				.then((result) => {
    expect(JSON.stringify(result)).to.equal(JSON.stringify({
        foo: 'bar'
    }));

    expect(findOneStub).to.have.been.calledOnce;
    expect(findOneStub).to.have.been.calledWith({
        _id: 'foo'
    });

    expect(leanStub).to.have.been.calledOnce;

    expect(execStub).to.have.been.calledOnce;
});
        });

        it('should throw a NotFound error if the device isn\'t found', () => {
            const deviceModel = {
                findOne() {},
                lean() {},
                exec() {}
            };

            const findOneStub = sinon.stub(deviceModel, 'findOne', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve(null) // how mongoose sends back 0 records
);

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../controllers/device');
            expect(moduleToBeTested.getDeviceById).to.be.a.function;

            return moduleToBeTested.getDeviceById('bar').catch((errThrown) => {
                expect(errThrown.message).to.equal('device not found');
                expect(errThrown.type).to.equal('NotFound');
            });
        });

        it('should catch any errors and throw them up the promise', () => {
            const deviceModel = {
                findOne() {},
                lean() {},
                exec() {}
            };

            const findOneStub = sinon.stub(deviceModel, 'findOne', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const err = new Error('something went wrong');
            err.type = 'BadRequest';

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.reject(err));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            moduleToBeTested = require('../../controllers/device');
            expect(moduleToBeTested.getDeviceById).to.be.a.function;
            return moduleToBeTested.getDeviceById('bar').catch((errThrown) => {
                expect(errThrown).to.equal(err);
            });
        });
    });

    describe('runCommand', () => {
        it('should validate the command and then call the driver to run the command for the specified device', () => {
            const deviceModel = {
                findOne() {},
                lean() {},
                exec() {}
            };

            const findOneStub = sinon.stub(deviceModel, 'findOne', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve({
                _id: 'fee',
                type: 'deviceType',
                driver: 'foo',
                specs: {
                    commands: {
                        commandTruthy: true,
                        commandFalsy: false
                    }
                }
            }));

            modelsMock = {
                device: {
                    Model: deviceModel
                },
                deviceType: {
                    Model: {
                        schema: {
                            paths: {
                                'commands.commandTruthy': {
                                    options: {
                                        requestSchema: {
                                            foo: 'bar'
                                        },
                                        responseSchema: {
                                            bar: 'foo'
                                        },
                                        eventName: 'on'
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const jsonValidatorMock = {
                Validator: class {
                    validate() {}
				}
            };

            const jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate', () => ({
                errors: []
            }));


            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);
            mockery.registerMock('jsonschema', jsonValidatorMock);

            const drivers = {
                foo: {
                    command_commandTruthy() {},
                    getEventEmitter() {},
                    getName() {
                        return 'foo';
                    }
                }
            };

            const driverActionStub = sinon.stub(drivers.foo, 'command_commandTruthy', () => ({
                on: true
            }));

            const eventEmitterEmitStub = sinon.stub();
            const getEventEmitterActionStub = sinon.stub(drivers.foo, 'getEventEmitter', () => ({
                emit: eventEmitterEmitStub
            }));

            moduleToBeTested = require('../../controllers/device');

            expect(moduleToBeTested.runCommand).to.be.a.function;
            return moduleToBeTested.runCommand('foo', 'commandTruthy', 'fee', drivers)
				.then((result) => {
    expect(findOneStub).to.have.been.calledOnce;
    expect(findOneStub).to.have.been.calledWith({
        _id: 'foo'
    });

    expect(leanStub).to.have.been.calledOnce;

    expect(execStub).to.have.been.calledOnce;

    expect(jsonValidatorStub).to.have.been.calledOnce;
    expect(jsonValidatorStub.firstCall).to.have.been.calledWith('fee', {
        foo: 'bar'
    });

    expect(driverActionStub).to.have.been.calledOnce;
    expect(driverActionStub).to.have.been.calledWith({
        _id: 'fee',
        type: 'deviceType',
        driver: 'foo',
        specs: {
            commands: {
                commandTruthy: true,
                commandFalsy: false
            }
        }
    }, 'fee');
});
        });

        it('should continue to work even if the request schema isn\'t specified', () => {
            const deviceModel = {
                findOne() {},
                lean() {},
                exec() {}
            };

            const findOneStub = sinon.stub(deviceModel, 'findOne', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve({
                _id: 'fee',
                type: 'deviceType',
                driver: 'foo',
                specs: {
                    commands: {
                        commandTruthy: true,
                        commandFalsy: false
                    }
                }
            }));

            modelsMock = {
                device: {
                    Model: deviceModel
                },
                deviceType: {
                    Model: {
                        schema: {
                            paths: {
                                'commands.commandTruthy': {
                                    options: {
                                        responseSchema: {
                                            bar: 'foo'
                                        },
                                        eventName: 'on'
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const jsonValidatorMock = {
                Validator: class {
                    validate() {}
				}
            };

            const jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate', () => ({
                errors: []
            }));


            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);
            mockery.registerMock('jsonschema', jsonValidatorMock);

            const eventEmitterEmitStub = sinon.stub();

            const drivers = {
                foo: {
                    command_commandTruthy() {},
                    getEventEmitter() {
                        return {
                            emit: eventEmitterEmitStub
                        };
                    },
                    getName() {
                        return 'foo';
                    }
                }
            };

            const driverActionStub = sinon.stub(drivers.foo, 'command_commandTruthy', () => ({
                on: true
            }));

            moduleToBeTested = require('../../controllers/device');

            expect(moduleToBeTested.runCommand).to.be.a.function;
            return moduleToBeTested.runCommand('foo', 'commandTruthy', 'fee', drivers);
        });


        it('should throw an error if the specified device doesn\'t exist', () => {
            const deviceModel = {
                findOne() {},
                lean() {},
                exec() {}
            };

            const findOneStub = sinon.stub(deviceModel, 'findOne', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve(null));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };


            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            const drivers = {};


            moduleToBeTested = require('../../controllers/device');

            expect(moduleToBeTested.runCommand).to.be.a.function;
            return moduleToBeTested.runCommand('foo', 'commandTruthy', 'fee', drivers)
				.catch((error) => {
    expect(error.message).to.equal('device not found');
    expect(error.type).to.equal('NotFound');
});
        });

        it('should throw an error if the specified command doesn\'t exist', () => {
            const deviceModel = {
                findOne() {},
                lean() {},
                exec() {}
            };

            const findOneStub = sinon.stub(deviceModel, 'findOne', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve({
                type: 'deviceType',
                driver: 'foo',
                specs: {
                    commands: {
                        commandTruthy: true,
                        commandFalsy: false
                    }
                }
            }));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };


            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            const drivers = {};


            moduleToBeTested = require('../../controllers/device');

            expect(moduleToBeTested.runCommand).to.be.a.function;
            return moduleToBeTested.runCommand('foo', 'commandNotExist', 'fee', drivers)
				.catch((error) => {
    expect(error.message).to.equal('command not found');
    expect(error.type).to.equal('BadRequest');
});
        });

        it('should throw an error if the specified command isn\'t supported', () => {
            const deviceModel = {
                findOne() {},
                lean() {},
                exec() {}
            };

            const findOneStub = sinon.stub(deviceModel, 'findOne', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve({
                type: 'deviceType',
                driver: 'foo',
                specs: {
                    commands: {
                        commandTruthy: true,
                        commandFalsy: false
                    }
                }
            }));

            modelsMock = {
                device: {
                    Model: deviceModel
                }
            };


            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);

            const drivers = {};


            moduleToBeTested = require('../../controllers/device');

            expect(moduleToBeTested.runCommand).to.be.a.function;
            return moduleToBeTested.runCommand('foo', 'commandFalsy', 'fee', drivers)
				.catch((error) => {
    expect(error.message).to.equal('command not supported');
    expect(error.type).to.equal('BadRequest');
});
        });

        it('should should throw an error if the request body doesn\'t match the schema', () => {
            const deviceModel = {
                findOne() {},
                lean() {},
                exec() {}
            };

            const findOneStub = sinon.stub(deviceModel, 'findOne', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve({
                type: 'deviceType',
                driver: 'foo',
                specs: {
                    commands: {
                        commandTruthy: true,
                        commandFalsy: false
                    }
                }
            }));

            modelsMock = {
                device: {
                    Model: deviceModel
                },
                deviceType: {
                    Model: {
                        schema: {
                            paths: {
                                'commands.commandTruthy': {
                                    options: {
                                        requestSchema: {
                                            foo: 'bar'
                                        },
                                        responseSchema: {
                                            bar: 'foo'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const jsonValidatorMock = {
                Validator: class {
                    validate() {}
				}
            };

            const jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate', () => ({
                errors: [{
                    property: 'instance',
                    message: 'is not of a type(s) string',
                    schema: [Object],
                    instance: 4,
                    name: 'type',
                    argument: [Object],
                    stack: 'instance is not of a type(s) string'
                }]
            }));

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);
            mockery.registerMock('jsonschema', jsonValidatorMock);

            const drivers = {};

            moduleToBeTested = require('../../controllers/device');

            expect(moduleToBeTested.runCommand).to.be.a.function;
            return moduleToBeTested.runCommand('foo', 'commandTruthy', 'fee', drivers)
				.catch((error) => {
    expect(error.message).to.equal('the supplied json is invalid');
    expect(error.type).to.equal('Validation');
    expect(error.errors[0].message).to.equal('is not of a type(s) string');
});
        });


        it('should should throw an error if the response body doesn\'t match the schema', () => {
            const deviceModel = {
                findOne() {},
                lean() {},
                exec() {}
            };

            const findOneStub = sinon.stub(deviceModel, 'findOne', () => deviceModel);

            const leanStub = sinon.stub(deviceModel, 'lean', () => deviceModel);

            const execStub = sinon.stub(deviceModel, 'exec', () => Promise.resolve({
                type: 'deviceType',
                driver: 'foo',
                specs: {
                    commands: {
                        commandTruthy: true,
                        commandFalsy: false
                    }
                }
            }));

            modelsMock = {
                device: {
                    Model: deviceModel
                },
                deviceType: {
                    Model: {
                        schema: {
                            paths: {
                                'commands.commandTruthy': {
                                    options: {
                                        requestSchema: {
                                            foo: 'bar'
                                        },
                                        responseSchema: {
                                            bar: 'foo'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            };

            const jsonValidatorMock = {
                Validator: class {
                    validate() {}
				}
            };

            const jsonValidatorStub = sinon.stub(jsonValidatorMock.Validator.prototype, 'validate');
            jsonValidatorStub.onFirstCall().returns(function () {
                return {
                    errors: []
                };
            }());

            jsonValidatorStub.onSecondCall().returns(function () {
                return {
                    errors: [{
                        property: 'instance',
                        message: 'is not of a type(s) string',
                        schema: [Object],
                        instance: 4,
                        name: 'type',
                        argument: [Object],
                        stack: 'instance is not of a type(s) string'
                    }]
                };
            }());

            mockery.enable({
                useCleanCache: true,
                warnOnUnregistered: false
            });
            mockery.registerMock('../models', modelsMock);
            mockery.registerMock('jsonschema', jsonValidatorMock);

            const drivers = {
                foo: {
                    command_commandTruthy() {
                        return {
                            processed: true
                        };
                    }
                }
            };

            moduleToBeTested = require('../../controllers/device');

            expect(moduleToBeTested.runCommand).to.be.a.function;
            return moduleToBeTested.runCommand('foo', 'commandTruthy', 'fee', drivers)
				.catch((error) => {
    expect(error.message).to.equal('the driver produced invalid json');
    expect(error.type).to.equal('Validation');
    expect(error.errors[0].message).to.equal('is not of a type(s) string');
});
        });
    });
});
