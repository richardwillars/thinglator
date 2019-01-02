module.exports = (events, constants) => {
  const deviceCommands = {};

  const deviceEvents = [constants.events.MOTION, constants.events.BUTTON];

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
