var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LightSchema = new mongoose.Schema({
	_id: false,
	name: {
		type: String,
		required: true
	},
	deviceId: {
		type: String,
		required: true
	},
	capabilities: {
		toggle: {
			type: Boolean,
			default: false,
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"on": {
						"type": "boolean"
					}
				},
				"required": [
					"on"
				]
			}
		},
		setState: {
			type: Boolean,
			default: false,
			requestSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"on": {
						"type": "boolean"
					},
					"colour": {
						"type": "string"
					},
					"brightness": {
						"type": "integer",
						"minimum": 0,
						"maximum": 100
					},
					"duration": {
						"duration": "integer",
						"minimum": 0,
						"maxiumum": 99999
					}
				},
				"required": [
					"colour",
					"duration",
					"brightness",
					"on"
				]
			},
			responseSchema: {
				"$schema": "http://json-schema.org/draft-04/schema#",
				"type": "object",
				"properties": {
					"processed": {
						"type": "boolean"
					}
				},
				"required": [
					"processed"
				]
			}

		},
		breatheEffect: {

		},
		pulseEffect: {

		},
		cycleEffect: {

		}
	}
});


var Light = mongoose.model('Light', LightSchema);

module.exports = Light;