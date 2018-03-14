const cron = require("node-cron");

const pruneEvents = eventsCollection => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7);
  eventsCollection
    .chain()
    .find({
      "meta.created": {
        $lt: oneWeekAgo.getTime()
      }
    })
    .limit(1000000)
    .remove();
};

const schedule = eventsCollection => {
  cron.schedule("0 2 * * *", () => pruneEvents(eventsCollection)); // run 2am every day
};

module.exports = eventsCollection => ({
  schedule: () => schedule(eventsCollection)
});
