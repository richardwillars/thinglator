const chai = require('chai');
const expect = chai.expect;

describe('utils/event', () => {
    let moduleToBeTested;

    it('getEventEmitter should return an event emitter', () => {
		// call the module to be tested
        moduleToBeTested = require('../../../utils/event');

        expect(moduleToBeTested.getEventEmitter).to.be.a.function;
        const ee = moduleToBeTested.getEventEmitter();
        expect(ee).to.be.an.object;
        expect(ee.on).to.be.a.function;
        expect(ee.emit).to.be.a.function;
        expect(ee.foo).to.not.be.a.function;
    });

    it('newEventCreated should fire an error', (done) => {
		// call the module to be tested
        moduleToBeTested = require('../../../utils/event');

        const ee = moduleToBeTested.getEventEmitter();


        expect(moduleToBeTested.newEventCreated).to.be.a.function;


        ee.on('newEvent', (event) => {
            expect(event.foo).to.equal('bar');
            done();
        });

        moduleToBeTested.newEventCreated({
            foo: 'bar'
        });
    });
});
