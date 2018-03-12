module.exports = constants => ({
  [constants.events.ADDED_TO_QUEUE_BOTTOM]: {
    type: Boolean,
    description: "Fired when an item is added to the bottom of the queue",
    friendly: "Added to bottom of queue",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        uri: {
          type: "string"
        }
      },
      required: ["queued"]
    }
  },
  [constants.events.ADDED_TO_QUEUE_NEXT]: {
    type: Boolean,
    description: "Fired when an item is added to the top of the queue",
    friendly: "Added to top of queue",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        uri: {
          type: "string"
        }
      },
      required: ["queued"]
    }
  },
  [constants.events.AUDIO_PLAYING_STATE]: {
    type: Boolean,
    description:
      "Represents the current playing state (playing, paused, stopped)",
    friendly: "Playing state",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        paused: {
          paused: "boolean"
        },
        playing: {
          paused: "boolean"
        },
        stopped: {
          paused: "boolean"
        }
      },
      required: ["paused", "playing", "stopped"]
    }
  },
  audioPlayMode: {
    type: Boolean,
    description:
      "The current play mode of the audio device (normal, shuffle, repeat etc)",
    friendly: "Play mode",
    responseSchema: {
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
  [constants.events.BATTERY_LEVEL]: {
    type: Boolean,
    description: "The current battery level of the device",
    friendly: "Battery level",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: 0,
          maxiumum: 100
        }
      },
      required: ["level"]
    }
  },
  [constants.events.BREATHE_LIGHT_EFFECT]: {
    type: Boolean,
    description: "Whether the light is running a breathe effect or not",
    friendly: "Breathe effect",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        breatheEffect: {
          type: "boolean"
        }
      },
      required: ["breatheEffect"]
    }
  },
  [constants.events.CONTACT]: {
    type: Boolean,
    description: "Whether the contact sensor is closed or open",
    friendly: "Contact",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        contact: {
          type: "boolean"
        }
      },
      required: ["contact"]
    }
  },
  [constants.events.CURRENT_AUDIO_TRACK]: {
    type: Boolean,
    description: "Information about the current audio",
    friendly: "Current track",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        artist: {
          type: "string"
        },
        track: {
          type: "string"
        },
        album: {
          type: "string"
        },
        length: {
          type: "integer"
        },
        currentPosition: {
          type: "integer"
        },
        artUrl: {
          type: "string"
        }
      },
      required: ["artist", "track"]
    }
  },
  [constants.events.ENERGY]: {
    type: Boolean,
    description: "The current energy level in watts",
    friendly: "Energy",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        energy: {
          type: "double"
        }
      },
      required: ["energy"]
    }
  },
  [constants.events.HUMIDITY]: {
    type: Boolean,
    description: "The current humidity level",
    friendly: "Humidity",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: 0,
          maxiumum: 100
        }
      },
      required: ["level"]
    }
  },
  [constants.events.LED_STATE]: {
    type: Boolean,
    description: "The current state of the LED",
    friendly: "LED",
    responseSchema: {
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
  [constants.events.LIGHT]: {
    type: Boolean,
    description: "The current light level in lux",
    friendly: "Light level",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: 0,
          maxiumum: 30000
        }
      },
      required: ["level"]
    }
  },
  [constants.events.LIGHT_STATE]: {
    type: Boolean,
    description:
      "The current state of the light (hue, saturation, brightness etc)",
    friendly: "Light state",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        on: {
          type: "boolean"
        },
        colour: {
          type: "object",
          properties: {
            hue: {
              type: "integer",
              minimum: 0,
              maxiumum: 360
            },
            saturation: {
              type: "double",
              minimum: 0,
              maximum: 1
            },
            brightness: {
              type: "double",
              minimum: 0,
              maximum: 1
            }
          }
        }
      },
      required: ["colour", "on"]
    }
  },
  [constants.events.ON]: {
    type: Boolean,
    description: "Whether the device is on or not",
    friendly: "On",
    responseSchema: {
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
  [constants.events.MOTION]: {
    type: Boolean,
    description: "Represents if motion is detected or not",
    friendly: "Motion",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        detected: {
          type: "boolean"
        }
      },
      required: ["detected"]
    }
  },
  [constants.events.MUTED_AUDIO]: {
    type: Boolean,
    description: "Whether the audio is muted or not",
    friendly: "Muted",
    responseSchema: {
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
  [constants.events.NAME]: {
    type: Boolean,
    description: "The current name of the device",
    friendly: "Name",
    responseSchema: {
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
  [constants.events.NEXT_AUDIO_TRACK]: {
    type: Boolean,
    description: "Fired when changing to the next audio track",
    friendly: "Next audio track",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        next: {
          type: "boolean"
        }
      },
      required: ["next"]
    }
  },
  [constants.events.PREVIOUS_AUDIO_TRACK]: {
    type: Boolean,
    description: "Fired when changing to the previous audio track",
    friendly: "Previous audio track",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        previous: {
          type: "boolean"
        }
      },
      required: ["previous"]
    }
  },
  [constants.events.PULSE_LIGHT_EFFECT]: {
    type: Boolean,
    description: "Whether the light is running a pulse effect or not",
    friendly: "Pulse effect",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        pulseEffect: {
          type: "boolean"
        }
      },
      required: ["pulseEffect"]
    }
  },
  [constants.events.QUEUE_FLUSHED]: {
    type: Boolean,
    description: "Fired when the queue has been emptied",
    friendly: "Queue flushed",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        queueFlushed: {
          type: "boolean"
        }
      },
      required: ["queueFlushed"]
    }
  },
  [constants.events.SEEK]: {
    type: Boolean,
    description: "Represents the current position",
    friendly: "Current position",
    responseSchema: {
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
  [constants.events.TAMPER]: {
    type: Boolean,
    description: "If the device is being tampered with or not",
    friendly: "Tamper",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        detected: {
          type: "boolean"
        }
      },
      required: ["detected"]
    }
  },
  [constants.events.TEMPERATURE]: {
    type: Boolean,
    description: "The current temperature in degrees celcius",
    friendly: "Temperature",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: -50,
          maxiumum: 100
        }
      },
      required: ["level"]
    }
  },
  [constants.events.UV]: {
    type: Boolean,
    description: "The current UV level",
    friendly: "UV level",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: 0,
          maxiumum: 15
        }
      },
      required: ["level"]
    }
  },
  [constants.events.VIBRATION]: {
    type: Boolean,
    description: "The current vibration level",
    friendly: "Vibration level",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        level: {
          type: "double",
          minimum: 0,
          maxiumum: 100
        }
      },
      required: ["level"]
    }
  },
  [constants.events.VOLUME]: {
    type: Boolean,
    description: "The current volume level",
    friendly: "Volume level",
    responseSchema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      type: "object",
      properties: {
        volume: {
          type: "integer",
          minimum: 0,
          maxiumum: 100
        }
      },
      required: ["volume"]
    }
  }
});
