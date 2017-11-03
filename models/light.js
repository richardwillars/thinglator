module.exports = (mongoose, events, constants) => {
  const schema = {
    _id: false,
    name: {
      type: String,
      required: true,
    },
    originalId: {
      type: String,
      required: true,
    },
    additionalInfo: {
      type: Object,
      required: false,
      default: {},
    },
    commands: {
      toggle: {
        type: Boolean,
        description: 'Toggles the light on and off',
        friendly: 'Toggle',
      },
      setHSBState: {
        type: Boolean,
        description: 'Sets the hue, saturation and brightness, allowing you to change the colour of the light',
        friendly: 'Set colour and brightness',
        requestSchema: {
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          properties: {
            colour: {
              type: 'object',
              properties: {
                hue: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 360,
                },
                saturation: {
                  type: 'double',
                  minimum: 0,
                  maximum: 1,
                },
                brightness: {
                  type: 'double',
                  minimum: 0.01,
                  maximum: 1,
                },
              },
              required: [
                'hue',
                'saturation',
                'brightness',
              ],
            },

            duration: {
              type: 'integer',
              minimum: 0,
              maximum: 99999,
            },
          },
          required: [
            'colour',
            'duration',
          ],
        },
      },
      setBrightnessState: {
        type: Boolean,
        description: 'Sets the brightness of the light',
        friendly: 'Set the brightness',
        requestSchema: {
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          properties: {
            colour: {
              type: 'object',
              properties: {
                brightness: {
                  type: 'double',
                  minimum: 0.01,
                  maximum: 1,
                },
              },
              required: [
                'brightness',
              ],
            },
            duration: {
              type: 'integer',
              minimum: 0,
              maximum: 99999,
            },
          },
          required: [
            'colour',
            'duration',
          ],
        },
      },
      setBooleanState: {
        type: Boolean,
        description: 'Turns the light on or off',
        friendly: 'Turn on or off',
        requestSchema: {
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          properties: {
            on: {
              type: 'boolean',
            },
            duration: {
              type: 'integer',
              minimum: 0,
              maximum: 99999,
            },
          },
          required: [
            'on',
            'duration',
          ],
        },

      },
      breatheEffect: {
        type: Boolean,
        friendly: 'Breathe effect',
        description: 'Performs a breathe effect by fading between colours',
        requestSchema: {
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          properties: {
            colour: {
              type: 'object',
              properties: {
                hue: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 360,
                },
                saturation: {
                  type: 'double',
                  minimum: 0,
                  maximum: 1,
                },
                brightness: {
                  type: 'double',
                  minimum: 0,
                  maximum: 1,
                },
              },
              required: [
                'hue',
                'saturation',
                'brightness',
              ],
            },
            fromColour: {
              type: 'object',
              properties: {
                hue: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 360,
                },
                saturation: {
                  type: 'double',
                  minimum: 0,
                  maximum: 1,
                },
                brightness: {
                  type: 'double',
                  minimum: 0,
                  maximum: 1,
                },
              },
              required: [
                'hue',
                'saturation',
                'brightness',
              ],
            },
            period: {
              type: 'double',
              minimum: 0.01,
              maximum: 100,
            },
            cycles: {
              duration: 'double',
              minimum: 0.01,
              maximum: 99999,
            },
            persist: {
              type: 'boolean',
            },
            peak: {
              type: 'double',
              minimum: 0,
              maximum: 1,
            },
          },
          required: [
            'colour',
            'period',
            'cycles',
            'persist',
            'peak',
          ],

        },
      },
      pulseEffect: {
        type: Boolean,
        friendly: 'Pulse effect',
        description: 'Performs a pulse effect by flashing between colours',
        requestSchema: {
          $schema: 'http://json-schema.org/draft-04/schema#',
          type: 'object',
          properties: {
            colour: {
              type: 'object',
              properties: {
                hue: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 360,
                },
                saturation: {
                  type: 'double',
                  minimum: 0,
                  maximum: 1,
                },
                brightness: {
                  type: 'double',
                  minimum: 0,
                  maximum: 1,
                },
              },
              required: [
                'hue',
                'saturation',
                'brightness',
              ],
            },
            fromColour: {
              type: 'object',
              properties: {
                hue: {
                  type: 'integer',
                  minimum: 0,
                  maximum: 360,
                },
                saturation: {
                  type: 'double',
                  minimum: 0,
                  maximum: 1,
                },
                brightness: {
                  type: 'double',
                  minimum: 0,
                  maximum: 1,
                },
              },
              required: [
                'hue',
                'saturation',
                'brightness',
              ],
            },
            period: {
              type: 'double',
              minimum: 0.01,
              maximum: 100,
            },
            cycles: {
              duration: 'double',
              minimum: 0.01,
              maximum: 99999,
            },
            persist: {
              type: 'boolean',
            },
          },
          required: [
            'colour',
            'period',
            'cycles',
            'persist',
          ],

        },
      },
    },
    events: {},
  };

  Object.keys(constants.light).forEach((key) => {
    schema.events[key] = events[key];
  });

  return {
    model: mongoose.model('Light', new mongoose.Schema(schema)),
    schema,
  };
};
