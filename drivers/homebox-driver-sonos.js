module.exports = {
	type: 'speaker',
	name: 'sonos',
	discover: function() {
		return new Promise(function(resolve,reject) {
			var devices = [
				{
					id: 'abc123',
					name: 'Lounge',
					address: '192.168.1.21',
					interface: 'wifi',
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
				},
				{
					id: 'def456',
					name: 'Bedroom',
					address: '192.168.1.22',
					interface: 'wifi',
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
				}
			];
			resolve(devices);
		});
	}
};