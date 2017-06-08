const mongoose = require('mongoose');
const EventEmitter2 = require('eventemitter2').EventEmitter2;
const EventModel = require('./event').Model;

const SpeakerSchema = new mongoose.Schema({
    _id: false,
    name: {
        type: String,
        required: true
    },
    deviceId: {
        type: String,
        required: true
    },
    additionalInfo: {
        type: Object,
        required: false,
        default: {}
    },
    commands: {
        getCurrentTrack: {
            type: Boolean
        },

        flushQueue: {
            type: Boolean
        },

        getLEDState: {
            type: Boolean
        },

        getMuted: {
            type: Boolean
        },

        getVolume: {
            type: Boolean
        },

        next: {
            type: Boolean
        },

        pause: {
            type: Boolean
        },

        play: {
            type: Boolean
        },

        previous: {
            type: Boolean
        },

        addToQueueBottom: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    uri: {
                        type: 'string'
                    }
                },
                required: [
                    'uri'
                ]
            }
        },

        addToQueueNext: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    uri: {
                        type: 'string'
                    }
                },
                required: [
                    'uri'
                ]
            }
        },

        seek: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    position: {
                        type: 'integer',
                        minimum: 0
                    }
                },
                required: [
                    'position'
                ]
            }
        },

        setLEDState: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    on: {
                        type: 'boolean'
                    }
                },
                required: [
                    'on'
                ]
            }
        },

        setMuted: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    muted: {
                        type: 'boolean'
                    }
                },
                required: [
                    'muted'
                ]
            }
        },

        setName: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    }
                },
                required: [
                    'name'
                ]
            }
        },

        setPlayMode: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    playMode: {
                        type: 'string',
                        enum: [
                            'normal', 'repeat_all', 'shuffle', 'shuffle_norepeat'
                        ]
                    }
                },
                required: [
                    'playMode'
                ]
            }
        },

        setVolume: {
            type: Boolean,
            requestSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    volume: {
                        type: 'integer',
                        minimum: 0,
                        maximum: 100
                    }
                },
                required: [
                    'volume'
                ]
            }
        },

        stop: {
            type: Boolean
        }
    },
    events: {
        currentTrack: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    artist: {
                        type: 'string'
                    },
                    track: {
                        type: 'string'
                    },
                    album: {
                        type: 'string'
                    },
                    length: {
                        type: 'integer'
                    },
                    currentPosition: {
                        type: 'integer'
                    },
                    artUrl: {
                        type: 'string'
                    }
                },
                required: [
                    'artist',
                    'track'
                ]
            }
        },
        queueFlushed: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    queueFlushed: {
                        type: 'boolean'
                    }
                },
                required: [
                    'queueFlushed'
                ]
            }
        },
        ledState: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    on: {
                        type: 'boolean'
                    }
                },
                required: [
                    'on'
                ]
            }
        },
        muted: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    muted: {
                        type: 'boolean'
                    }
                },
                required: [
                    'muted'
                ]
            }
        },
        volume: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    volume: {
                        type: 'integer'
                    }
                },
                required: [
                    'volume'
                ]
            }
        },
        next: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    muted: {
                        next: 'boolean'
                    }
                },
                required: [
                    'next'
                ]
            }
        },
        playingState: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    paused: {
                        paused: 'boolean'
                    },
                    playing: {
                        paused: 'boolean'
                    },
                    stopped: {
                        paused: 'boolean'
                    }
                },
                required: [
                    'paused', 'playing', 'stopped'
                ]
            }
        },
        previous: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    previous: {
                        type: 'boolean'
                    }
                },
                required: [
                    'previous'
                ]
            }
        },
        addedToQueueBottom: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    uri: {
                        type: 'string'
                    }
                },
                required: [
                    'queued'
                ]
            }
        },
        addedToQueueNext: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    uri: {
                        type: 'string'
                    }
                },
                required: [
                    'queued'
                ]
            }
        },
        seek: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    position: {
                        type: 'integer',
                        minimum: 0
                    }
                },
                required: [
                    'position'
                ]
            }
        },
        name: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    name: {
                        type: 'string'
                    }
                },
                required: [
                    'name'
                ]
            }
        },
        playMode: {
            type: Boolean,
            responseSchema: {
                $schema: 'http://json-schema.org/draft-04/schema#',
                type: 'object',
                properties: {
                    playMode: {
                        type: 'string',
                        enum: [
                            'normal', 'repeat_all', 'shuffle', 'shuffle_norepeat'
                        ]
                    }
                },
                required: [
                    'playMode'
                ]
            }
        }
    }
});


const Speaker = mongoose.model('Speaker', SpeakerSchema);
const deviceEventEmitter = new EventEmitter2();

deviceEventEmitter.on('playMode', (driverId, deviceId, obj) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'playMode',
        value: obj
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('name', (driverId, deviceId, obj) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'name',
        value: obj
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('LEDState', (driverId, deviceId, obj) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'LEDState',
        value: obj
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('addedToQueueBottom', (driverId, deviceId, obj) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'addedToQueueBottom',
        value: obj
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('addedToQueueNext', (driverId, deviceId, obj) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'addedToQueueNext',
        value: obj
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('previous', (driverId, deviceId, obj) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'previous',
        value: obj
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('next', (driverId, deviceId, obj) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'next',
        value: obj
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('queueFlushed', (driverId, deviceId, obj) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'queueFlushed',
        value: obj
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('playingState', (driverId, deviceId, obj) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'playingState',
        value: obj
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('currentTrack', (driverId, deviceId, trackId) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'currentTrack',
        value: trackId
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('volume', (driverId, deviceId, volume) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'volume',
        value: volume
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('muted', (driverId, deviceId, state) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'muted',
        value: state
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});

deviceEventEmitter.on('seek', (driverId, deviceId, seekPosition) => {
    const eventObj = EventModel({
        eventType: 'device',
        driverType: 'speaker',
        driverId,
        deviceId,
        event: 'seek',
        value: seekPosition
    });
    eventObj.save().catch((err) => {
        console.error('Unable to save event..', eventObj, err); // eslint-disable-line no-console
    });
});


module.exports = {
    Model: Speaker,
    DeviceEventEmitter: deviceEventEmitter
};
