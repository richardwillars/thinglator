module.exports = (events, constants) => {
  const deviceCommands = {
    getCurrentTrack: {
      type: Boolean,
      description: "Gets the current track from the speaker",
      friendly: "Get current track"
    },

    flushQueue: {
      type: Boolean,
      description: "Empties the queue on the speaker",
      friendly: "Flush the queue"
    },

    getLEDState: {
      type: Boolean,
      description: "Gets the state of the LED on the speaker",
      friendly: "Get the LED state"
    },

    getMuted: {
      type: Boolean,
      description: "Gets whether the speaker is muted or not",
      friendly: "Get muted"
    },

    getVolume: {
      type: Boolean,
      description: "Gets the volume level of the speaker",
      friendly: "Get volume"
    },

    next: {
      type: Boolean,
      description: "Plays the next track in the queue",
      friendly: "Play next track"
    },

    pause: {
      type: Boolean,
      description: "Pauses the currently playing audio",
      friendly: "Pause audio"
    },

    play: {
      type: Boolean,
      description: "Plays the current audio",
      friendly: "Play audio"
    },

    previous: {
      type: Boolean,
      description: "Plays the previous track in the queue",
      friendly: "Play previous track"
    },

    addUrlToQueueBottom: {
      type: Boolean,
      description: "Adds audio to the bottom of the queue",
      friendly: "Add track to bottom of queue",
      requestSchema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "object",
        properties: {
          uri: {
            type: "string"
          }
        },
        required: ["uri"]
      }
    },

    addUrlToQueueNext: {
      type: Boolean,
      description: "Adds audio to the top of the queue so that it plays next",
      friendly: "Add track to top of queue",
      requestSchema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "object",
        properties: {
          uri: {
            type: "string"
          }
        },
        required: ["uri"]
      }
    },

    addSpotifyToQueueBottom: {
      type: Boolean,
      description: "Adds a spotify track to the bottom of the queue",
      friendly: "Add spotify track to bottom of queue",
      requestSchema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "object",
        properties: {
          uri: {
            type: "string"
          }
        },
        required: ["uri"]
      }
    },

    addSpotifyToQueueNext: {
      type: Boolean,
      description:
        "Adds spotify track to the top of the queue so that it plays next",
      friendly: "Add spotify track to top of queue",
      requestSchema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "object",
        properties: {
          uri: {
            type: "string"
          }
        },
        required: ["uri"]
      }
    },

    seek: {
      type: Boolean,
      description: "Seeks to the specified position within the current audio",
      friendly: "Jump to position within track",
      requestSchema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "object",
        properties: {
          position: {
            type: "integer",
            minimum: 0
          }
        },
        required: ["position"]
      }
    },

    setLEDState: {
      type: Boolean,
      description: "Sets the state of the LED on the speaker",
      friendly: "Turn LED on",
      requestSchema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "object",
        properties: {
          on: {
            type: "boolean"
          }
        },
        required: ["on"]
      }
    },

    setMuted: {
      type: Boolean,
      description: "Sets whether the speaker is muted or not",
      friendly: "Mute",
      requestSchema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "object",
        properties: {
          muted: {
            type: "boolean"
          }
        },
        required: ["muted"]
      }
    },

    setName: {
      type: Boolean,
      description: "Sets the name of the speaker",
      friendly: "Set the name of the speaker",
      requestSchema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "object",
        properties: {
          name: {
            type: "string"
          }
        },
        required: ["name"]
      }
    },

    setPlayMode: {
      type: Boolean,
      description: "Sets the play mode of the speaker",
      friendly: "Set play mode",
      requestSchema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "object",
        properties: {
          playMode: {
            type: "string",
            enum: ["normal", "repeat_all", "shuffle", "shuffle_norepeat"]
          }
        },
        required: ["playMode"]
      }
    },

    setVolume: {
      type: Boolean,
      description: "Sets the volume of the speaker",
      friendly: "Set volume",
      requestSchema: {
        $schema: "http://json-schema.org/draft-04/schema#",
        type: "object",
        properties: {
          volume: {
            type: "integer",
            minimum: 0,
            maximum: 100
          }
        },
        required: ["volume"]
      }
    },

    stop: {
      type: Boolean,
      friendly: "Stop the audio",
      description: "Stops the currently playing audio"
    }
  };

  const deviceEvents = [
    constants.events.AUDIO_PLAYING_STATE,
    constants.events.PREVIOUS_AUDIO_TRACK,
    constants.events.NEXT_AUDIO_TRACK,
    constants.events.MUTED_AUDIO,
    constants.events.QUEUE_FLUSHED,
    constants.events.VOLUME,
    constants.events.SEEK,
    constants.events.NAME,
    constants.events.LED_STATE,
    constants.events.CURRENT_AUDIO_TRACK,
    constants.events.ADDED_TO_QUEUE_NEXT,
    constants.events.ADDED_TO_QUEUE_BOTTOM
  ];

  const eventSchema = {
    type: "object",
    properties: {}
  };

  deviceEvents.forEach(eventId => {
    eventSchema.properties[eventId] = events[eventId];
    eventSchema.properties[eventId].constant = eventId;
  });

  return {
    commands: deviceCommands,
    events: deviceEvents
  };
};
