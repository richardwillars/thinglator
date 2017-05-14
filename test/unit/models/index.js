const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');

describe('modelLoader', () => {
    let moduleToBeTested;
    let fsMock,
        fooMock,
        blaMock;

    beforeEach((done) => {
		// mock out fs
        const fsMock = {
            readdirSync(dirName) {
                return ['foo.js', 'index.js', 'subdir', 'bla.js', 'unknown.txt'];
            }
        };

        fooMock = {};
        blaMock = {};

        mockery.enable({
            useCleanCache: true,
            warnOnUnregistered: false
        });

        mockery.registerMock('fs', fsMock);
        mockery.registerMock('./foo.js', fooMock);
        mockery.registerMock('./bla.js', blaMock);
        done();
    });

    afterEach((done) => {
        mockery.deregisterMock('fs');
        mockery.deregisterMock('./foo.js', fooMock);
        mockery.deregisterMock('./bla.js', blaMock);
        done();
    });

    it('should return a list of models as module exports', () => {
		// call the module to be tested
        moduleToBeTested = require('../../../models/index');

        expect(moduleToBeTested.foo).to.be.an.object;
        expect(moduleToBeTested.bla).to.be.an.object;
        expect(moduleToBeTested.index).to.not.be.defined;
        expect(moduleToBeTested.subdir).to.not.be.defined;
        expect(moduleToBeTested.unknown).to.not.be.defined;
        expect(Object.keys(moduleToBeTested).length).to.equal(2);
    });
});
