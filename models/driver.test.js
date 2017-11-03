

const chai = require('chai');

const expect = chai.expect;
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);
const mockery = require('mockery');

describe('models/driver', () => {
  let moduleToBeTested;
  let driverConstructorSpy;
  const modelSpy = sinon.spy();

  beforeEach((done) => {
    driverConstructorSpy = sinon.spy();

    const schemaClass = class Event {
      constructor(props) {
        driverConstructorSpy(props);
      }
    };
    const mongooseMock = {
      Schema: schemaClass,
      model: (schemaId, schema) => {
        modelSpy(schemaId, schema);
        return schema;
      },
    };


    mockery.enable({
      useCleanCache: true,
      warnOnUnregistered: false,
    });

    mockery.registerMock('mongoose', mongooseMock);
    done();
  });

  afterEach((done) => {
    mockery.deregisterMock('mongoose');
    done();
  });

  it('should create a mongoose schema representing a driver', () => {
    // call the module to be tested

    moduleToBeTested = require('../../models/driver');
    expect(driverConstructorSpy).to.have.been.calledOnce;
    expect(driverConstructorSpy).to.have.been.calledWith({
      _id: {
        type: String,
        required: true,
        unique: true,
      },
      settings: {
        type: Object,
        required: true,
        default: {},
      },
    });
  });

  it('should create a mongoose model from the schema', () => {
    moduleToBeTested = require('../../models/driver');
    expect(modelSpy).have.been.calledOnce;
    expect(modelSpy).to.have.been.calledWith('Driver');
    expect(moduleToBeTested.Model).to.be.an.object;
  });
});
