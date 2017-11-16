const getEventsByType = async (eventType, from, models) => {
  if (from) {
    const fromEvent = await models.event.model.findOne({
      _id: from,
    }).lean().exec();
    return models.event.model.find({
      when: {
        $gte: fromEvent.when,
      },
      eventType,
      _id: {
        $ne: fromEvent._id,
      },
    }).sort('when').limit(100).lean()
      .exec();
  }
  return models.event.model.find({
    eventType,
  }).sort('when').limit(100).lean()
    .exec();
};

const getLatestCommandEvents = async (models) => {
  const events = await models.event.model.aggregate([
    {
      $sort: {
        when: 1,
      },
    },
    {
      $group: {
        _id: {
          deviceId: '$deviceId',
          event: '$event',
        },
        eventId: {
          $last: '$_id',
        },
        eventType: {
          $last: '$eventType',
        },
        driverType: {
          $last: '$driverType',
        },
        driverId: {
          $last: '$driverId',
        },
        deviceId: {
          $last: '$deviceId',
        },
        event: {
          $last: '$event',
        },
        when: {
          $last: '$when',
        },
        value: {
          $last: '$value',
        },
      },
    },
    {
      $project: {
        eventId: 1, eventType: 1, driverType: 1, driverId: 1, deviceId: 1, event: 1, when: 1, value: 1,
      },
    },
  ]).exec();

  const eventList = [];
  const t = events.length;
  for (let i = 0; i < t; i += 1) {
    events[i]._id = events[i].eventId;
    delete events[i].eventId;
    eventList.push(events[i]);
  }
  return eventList;
};

module.exports = models => ({
  getLatestCommandEvents: () => getLatestCommandEvents(models),
  getEventsByType: (eventType, from) => getEventsByType(eventType, from, models),
});
