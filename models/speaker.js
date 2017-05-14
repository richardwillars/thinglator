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
    capabilities: {
        getCurrentTrack: {
            type: Boolean,
            default: false,
            eventName: 'currentTrack',
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

        flushQueue: {
            type: Boolean,
            default: false,
            eventName: 'queueFlushed',
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

        getLEDState: {
            type: Boolean,
            default: false,
            eventName: 'LEDState',
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

        getMuted: {
            type: Boolean,
            default: false,
            eventName: 'muted',
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

        getVolume: {
            type: Boolean,
            default: false,
            eventName: 'volume',
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
            default: false,
            eventName: 'next',
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

        pause: {
            type: Boolean,
            default: false,
            eventName: 'playingState',
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

        play: {
            type: Boolean,
            default: false,
            eventName: 'playingState',
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
            default: false,
            eventName: 'previous',
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

        addToQueueBottom: {
            type: Boolean,
            default: false,
            eventName: 'addedToQueueBottom',
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
            },
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

        addToQueueNext: {
            type: Boolean,
            default: false,
            eventName: 'addedToQueueNext',
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
            },
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
            default: false,
            eventName: 'seek',
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
            },
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

        setLEDState: {
            type: Boolean,
            default: false,
            eventName: 'LEDState',
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
            },
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

        setMuted: {
            type: Boolean,
            default: false,
            eventName: 'muted',
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
            },
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

        setName: {
            type: Boolean,
            default: false,
            eventName: 'name',
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
            },
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

        setPlayMode: {
            type: Boolean,
            default: false,
            eventName: 'playMode',
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
            },
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
        },

        setVolume: {
            type: Boolean,
            default: false,
            eventName: 'volume',
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
            },
            responseSchema: {
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
            type: Boolean,
            default: false,
            eventName: 'playingState',
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
