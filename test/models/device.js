

const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const mockery = require('mockery');

describe('models/device', () => {
    let moduleToBeTested;
    let deviceConstructorSpy;
    const modelSpy = sinon.spy();

    beforeEach((done) => {
        deviceConstructorSpy = sinon.spy();


        const schemaClass = class Event {
            constructor(props) {
                deviceConstructorSpy(props);
            }
		};
        const mongooseMock = {
            Schema: schemaClass,
            model: (schemaId, schema) => {
                modelSpy(schemaId, schema);
                return schema;
            }
        };


        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        mockery.registerMock('mongoose', mongooseMock);
        done();
    });

    afterEach((done) => {
        mockery.deregisterMock('mongoose');
        done();
    });

    it('should create a mongoose schema representing a device', () => {
		// call the module to be tested

        moduleToBeTested = require('../../models/device');
        expect(deviceConstructorSpy).to.have.been.calledOnce;
        expect(deviceConstructorSpy).to.have.been.calledWith({
            _id: {
                type: String,
                required: true,
                unique: true
            },
            created: {
                type: Date,
                required: false,
                default: Date.now
            },
            type: {
                type: String,
                required: true
            },
            driver: {
                type: String,
                required: true
            },
            specs: {
                type: Object,
                required: true,
                default: {}
            }
        });
    });

    it('should create a mongoose model from the schema', () => {
        moduleToBeTested = require('../../models/device');
        expect(modelSpy).have.been.calledOnce;
        expect(modelSpy).to.have.been.calledWith('Device');
        expect(moduleToBeTested.Model).to.be.an.object;
    });
});
