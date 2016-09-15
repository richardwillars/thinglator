var models = require('../models');

var controller = {
	getEventsByType: function(eventType, from) {
		if (from) {
			return models['event'].Model.findOne({
					_id: from
				}).lean().exec()
				.then(function(fromEvent) {
					return models['event'].Model.find({
						when: {
							$gte: fromEvent.when
						},
						eventType: eventType,
						_id: {
							$ne: fromEvent._id
						}
					}).sort('when').limit(100).lean().exec();
				})
				.then(function(events) {
					return events;
				});
		} else {
			return models['event'].Model.find({
					eventType: eventType
				})
				.sort('when').limit(100).lean().exec()
				.then(function(events) {
					return events;
				});
		}
	}
};

module.exports = controller;