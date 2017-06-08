const models = require('../models');

const controller = {
    getEventsByType(eventType, from) {
        if (from) {
            return models.event.Model.findOne({
                _id: from
            }).lean().exec()
            .then(fromEvent => models.event.Model.find({
                when: {
                    $gte: fromEvent.when
                },
                eventType,
                _id: {
                    $ne: fromEvent._id
                }
            }).sort('when').limit(100).lean().exec())
            .then(events => events);
        }
        return models.event.Model.find({
            eventType
        })
        .sort('when').limit(100).lean().exec()
        .then(events => events);
    },
    getLatestCommandEvents() {
        return models.event.Model.aggregate(
            [
                {
                    $sort: {
                        when: 1
                    }
                },
                {
                    $group: {
                        _id: {
                            deviceId: '$deviceId',
                            event: '$event'
                        },
                        eventId: {
                            $last: '$_id'
                        },
                        eventType: {
                            $last: '$eventType'
                        },
                        driverType: {
                            $last: '$driverType'
                        },
                        driverId: {
                            $last: '$driverId'
                        },
                        deviceId: {
                            $last: '$deviceId'
                        },
                        event: {
                            $last: '$event'
                        },
                        when: {
                            $last: '$when'
                        },
                        value: {
                            $last: '$value'
                        }
                    }
                },
                {
                    $project: { eventId: 1, eventType: 1, driverType: 1, driverId: 1, deviceId: 1, event: 1, when: 1, value: 1 }
                }
            ]).exec().then((events) => {
                const eventList = [];
                const t = events.length;
                for (let i = 0; i < t; i += 1) {
                    events[i]._id = events[i].eventId;
                    delete events[i].eventId;
                    eventList.push(events[i]);
                }
                return eventList;
            });
    }
};

module.exports = controller;
