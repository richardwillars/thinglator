//var interface = null;

module.exports = {
	type: 'speaker',
	name: 'sonos',
	interface: 'http',
	setInterface: function(interfaceObj) {
		//interface = interfaceObj;
	},
	discover: function() {
		return new Promise(function(resolve, reject) {
			var devices = [{
				deviceId: 'abc123',
				name: 'Lounge',
				address: '192.168.1.20',
				capabilities: {
					getCurrentTrack: true,
					getDeviceDescription: true,
					flushQueue: true,
					getCurrentState: true,
					getLEDState: true,
					getMusicLibrary: true,
					getMuted: true,
					getTopology: true,
					getVolume: true,
					getZoneAttrs: true,
					getZoneInfo: true,
					next: true,
					pause: true,
					play: true,
					previous: true,
					addToQueueBottom: true,
					addToQueueNext: true,
					seek: true,
					setLEDState: true,
					setMuted: true,
					setName: true,
					setPlayMode: true,
					setVolume: true,
					stop: true
				}
			}, {
				deviceId: 'def456',
				name: 'Bedroom',
				address: '192.168.1.21',
				capabilities: {
					getCurrentTrack: true,
					getDeviceDescription: true,
					flushQueue: true,
					getCurrentState: true,
					getLEDState: true,
					getMusicLibrary: true,
					getMuted: true,
					getTopology: true,
					getVolume: true,
					getZoneAttrs: true,
					getZoneInfo: true,
					next: true,
					pause: true,
					play: true,
					previous: true,
					addToQueueBottom: true,
					addToQueueNext: true,
					seek: true,
					setLEDState: true,
					setMuted: true,
					setName: true,
					setPlayMode: true,
					setVolume: true,
					stop: true
				}
			}];
			resolve(devices);
		});
	},
	capability_getCurrentTrack: function(device,props) {
		return new Promise(function(resolve,reject) {
			resolve({
				artist: "Jess Glynne",
				track: "Hold my hand",
				album: "I cry when I laugh",
				length: 227,
				currentPosition: 109
			});
		});
	},
	capability_setMuted: function(device,props) {
		return new Promise(function(resolve,reject) {

		});
	}
};