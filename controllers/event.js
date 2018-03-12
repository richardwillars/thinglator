const groupBy = require("lodash.groupby");

const isInt = str => {
  const n = Math.floor(Number(str));
  return String(n) === str && n >= 0;
};

const tidyUpResults = results =>
  results.map(result => {
    const tidyResult = Object.assign({ eventId: result.$loki }, result);
    delete tidyResult.$loki;
    return tidyResult;
  });

const getEventsByType = async (eventType, from, eventsCollection) => {
  if (from) {
    if (!isInt(from)) {
      const err = new Error("From parameter is not a valid id");
      err.type = "BadRequest";
      throw err;
    }
    const fromEvent = eventsCollection.get(from);
    if (!fromEvent) {
      return [];
    }

    return tidyUpResults(
      eventsCollection
        .chain()
        .find({
          "meta.created": {
            $gte: fromEvent.meta.created
          },
          eventType,
          $loki: {
            $ne: fromEvent.$loki
          }
        })
        .limit(100)
        .data()
    );
  }
  return tidyUpResults(
    eventsCollection.find({
      eventType
    })
  );
};

const getLatestCommandEvents = async eventsCollection => {
  const events = await getEventsByType("device", undefined, eventsCollection);
  const grouped = groupBy(events, event => `${event.deviceId}|${event.event}`);
  return Object.values(grouped).map(
    groupedEvents => groupedEvents[groupedEvents.length - 1]
  );
};

module.exports = eventsCollection => ({
  getLatestCommandEvents: () => getLatestCommandEvents(eventsCollection),
  getEventsByType: (eventType, from) =>
    getEventsByType(eventType, from, eventsCollection)
});
