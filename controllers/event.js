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
    }
};

module.exports = controller;
