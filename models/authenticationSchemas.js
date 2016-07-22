// getAuthenticationProcess: function() {
// 	return [{
// 		type: 'ManualAction',
// 		message: 'Please press the sync button on your Hue Hub',
// 		next: '/authentication/speaker/sonos/0'
// 	}, {
// 		type: 'RequestData',
// 		message: 'In order to use LIFX bulbs you must provide an access token. This can be obtained in your LIFX account settings',
// 		button: {
// 			url: 'https://cloud.lifx.com/settings',
// 			label: 'Get access token'
// 		},
// 		dataLabel: 'Access token',
// 		next: '/authentication/speaker/sonos/1'
// 	}];
// },


var AuthenticationSchemas = {
	requested: {
		RequestData: {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				"type": {
					"type": "string"
				},
				"message": {
					"type": "string"
				},
				"button": {
					"type": "object",
					"properties": {
						"url": {
							"type": "string"
						},
						"label": {
							"type": "string"
						}
					},
					"required": [
						"url",
						"label"
					]
				},
				"dataLabel": {
					"type": "string"
				},
				"next": {
					"type": "string"
				}
			},
			"required": [
				"type",
				"message",
				"dataLabel",
				"next"
			]
		},
		ManualAction: {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				"type": {
					"type": "string"
				},
				"message": {
					"type": "string"
				},
				"next": {
					"type": "string"
				}
			},
			"required": [
				"type",
				"message",
				"next"
			]
		}
	},
	returned: {
		RequestData: {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				"data": {
					"type": "string"
				}
			},
			"required": [
				"data"
			]
		},
		ManualAction: {
			"$schema": "http://json-schema.org/draft-04/schema#",
			"type": "object",
			"properties": {
				
			},
			"required": [
			
			]
		}
	}

};


module.exports = AuthenticationSchemas;