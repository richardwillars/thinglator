var chai = require('chai');
var expect = chai.expect;
var mockery = require('mockery');

describe('modelLoader', () => {
	var moduleToBeTested;
	var fsMock, fooMock, blaMock;

	beforeEach(function(done) {
		//mock out fs
		var fsMock = {
			readdirSync: function(dirName) {
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

	afterEach(function(done) {
		mockery.deregisterMock('fs');
		mockery.deregisterMock('./foo.js', fooMock);
		mockery.deregisterMock('./bla.js', blaMock);
		done();
	});

	it('should return a list of models as module exports', () => {
		//call the module to be tested
		moduleToBeTested = require('../../../models/index');

		expect(moduleToBeTested.foo).to.be.an.object;
		expect(moduleToBeTested.bla).to.be.an.object;
		expect(moduleToBeTested.index).to.not.be.defined;
		expect(moduleToBeTested.subdir).to.not.be.defined;
		expect(moduleToBeTested.unknown).to.not.be.defined;
		expect(Object.keys(moduleToBeTested).length).to.equal(2);
	});
});