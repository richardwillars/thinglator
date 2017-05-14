

const chai = require('chai');
const expect = chai.expect;

describe('models/authenticationSchemas', () => {
    let moduleToBeTested;

    describe('requested', () => {
        it('should expose a JSON schema for RequestData', () => {
            moduleToBeTested = require('../../../models/authenticationSchemas');
            expect(moduleToBeTested.requested.RequestData).to.be.an.object;
			// we compare as json so it's not trying to compare object instances
            expect(JSON.stringify(moduleToBeTested.requested.RequestData)).to.equal('{"$schema":"http://json-schema.org/draft-04/schema#","type":"object","properties":{"type":{"type":"string"},"message":{"type":"string"},"button":{"type":"object","properties":{"url":{"type":"string"},"label":{"type":"string"}},"required":["url","label"]},"dataLabel":{"type":"string"},"next":{"type":"object","properties":{"http":{"type":"string"},"socket":{"type":"object","properties":{"event":{"type":"string"},"step":{"type":"integer"}},"required":["event","step"]}},"required":["http","socket"]}},"required":["type","message","dataLabel","next"]}');
        });

        it('should expose a JSON schema for ManualAction', () => {
            moduleToBeTested = require('../../../models/authenticationSchemas');
            expect(moduleToBeTested.requested.ManualAction).to.be.an.object;
			// we compare as json so it's not trying to compare object instances
            expect(JSON.stringify(moduleToBeTested.requested.ManualAction)).to.equal('{"$schema":"http://json-schema.org/draft-04/schema#","type":"object","properties":{"type":{"type":"string"},"message":{"type":"string"},"next":{"type":"string"}},"required":["type","message","next"]}');
        });
    });

    describe('returned', () => {
        it('should expose a JSON schema for RequestData', () => {
            moduleToBeTested = require('../../../models/authenticationSchemas');
            expect(moduleToBeTested.returned.RequestData).to.be.an.object;
			// we compare as json so it's not trying to compare object instances
            expect(JSON.stringify(moduleToBeTested.returned.RequestData)).to.equal('{"$schema":"http://json-schema.org/draft-04/schema#","type":"object","properties":{"data":{"type":"string"}},"required":["data"]}');
        });

        it('should expose a JSON schema for ManualAction', () => {
            moduleToBeTested = require('../../../models/authenticationSchemas');
            expect(moduleToBeTested.returned.ManualAction).to.be.an.object;
			// we compare as json so it's not trying to compare object instances
            expect(JSON.stringify(moduleToBeTested.returned.ManualAction)).to.equal('{"$schema":"http://json-schema.org/draft-04/schema#","type":"object","properties":{},"required":[]}');
        });
    });
});
