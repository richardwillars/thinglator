

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mockery = require('mockery');

describe('models/event', () => {
    let moduleToBeTested;
    let eventConstructorSpy;
    const modelSpy = sinon.spy();
    const preSpy = sinon.spy();
    const newEventCreatedSpy = sinon.spy();
    let onSaveAction = null;

    beforeEach((done) => {
        eventConstructorSpy = sinon.spy();


        const schemaClass = class Event {
            constructor(props) {
                eventConstructorSpy(props);
            }

            pre(action, cb) {
                preSpy(action, cb);
                onSaveAction = cb;
            }
		};
        const mongooseMock = {
            Schema: schemaClass,
            model: (schemaId, schema) => {
                modelSpy(schemaId, schema);
                return schema;
            }
        };

        const eventUtilsMock = {
            newEventCreated: (eventModelInstance) => {
                newEventCreatedSpy(eventModelInstance);
            }
        };

        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        mockery.registerMock('mongoose', mongooseMock);
        mockery.registerMock('../utils/event', eventUtilsMock);
        done();
    });

    afterEach((done) => {
        mockery.deregisterMock('mongoose');
        mockery.deregisterMock('../utils/event');
        done();
    });

    it('should create a mongoose schema representing an event', () => {
		// call the module to be tested

        moduleToBeTested = require('../../../models/event');
        expect(eventConstructorSpy).to.have.been.calledOnce;
        expect(eventConstructorSpy).to.have.been.calledWith({
            eventType: {
                type: String,
                required: true,
                enum: ['request', 'device']
            },
            driverType: {
                type: String,
                required: true
            },
            driverId: {
                type: String,
                required: true
            },
            deviceId: {
                type: String,
                required: true
            },
            event: {
                type: String,
                required: true
            },
            value: {
                type: Object,
                required: false,
                default: {}
            },
            when: {
                type: Date,
                required: false,
                default: Date.now
            }
        });
    });

    it('should create a mongoose model from the schema', () => {
        moduleToBeTested = require('../../../models/event');
        expect(modelSpy).have.been.calledOnce;
        expect(modelSpy).to.have.been.calledWith('Event');
        expect(moduleToBeTested.Model).to.be.an.object;
    });

    it('should call eventUtils.newEventCreated whenever a new event is created', (done) => {
        moduleToBeTested = require('../../../models/event');
        expect(preSpy).to.have.been.calledOnce;
        expect(preSpy).to.have.been.calledWith('save');

        expect(newEventCreatedSpy).to.have.not.been.called;
        onSaveAction.call({
            isNew: true,
            foo: 'bar'
        }, () => {
            expect(newEventCreatedSpy).to.have.been.calledOnce;
            expect(newEventCreatedSpy).to.have.been.calledWith({
                isNew: true,
                foo: 'bar'
            });
            done();
        });
    });
});
