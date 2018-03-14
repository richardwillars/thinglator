module.exports = (events, constants) => {
  const deviceCommands = {};

  const deviceEvents = [
    constants.events.CONTACT,
    constants.events.TEMPERATURE,
    constants.events.HUMIDITY,
    constants.events.LIGHT,
    constants.events.UV,
    constants.events.BATTERY_LEVEL,
    constants.events.MOTION,
    constants.events.NAME,
    constants.events.VIBRATION,
    constants.events.TAMPER
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
    events: eventSchema
  };
};
