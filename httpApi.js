module.exports = (
  bodyParser,
  authenticateCtrl,
  eventCtrl,
  driverCtrl,
  interfaceCtrl,
  app,
  drivers
) => {
  const jsonParser = bodyParser.json();

  app.get("/", (req, res) => {
    res.json({
      Thinglator: "Oh, hi!"
    });
  });

  app.get("/authenticate/:driver", async (req, res, next) => {
    try {
      const result = await authenticateCtrl.getAuthenticationProcess(
        req.params.driver,
        drivers
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.post(
    "/authenticate/:driver/:stepId",
    jsonParser,
    async (req, res, next) => {
      try {
        const result = await authenticateCtrl.authenticationStep(
          req.params.driver,
          req.params.stepId,
          req.body
        );
        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  );

  app.get("/discover/:driver", async (req, res, next) => {
    try {
      const result = await driverCtrl.discover(req.params.driver, drivers);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/devices", async (req, res, next) => {
    try {
      const result = await driverCtrl.getAllDevices();
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/devices/type/:type", async (req, res, next) => {
    try {
      const result = await driverCtrl.getDevicesByType(req.params.type);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/devices/driver/:driver", async (req, res, next) => {
    try {
      const result = await driverCtrl.getDevicesByDriver(req.params.driver);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/device/:deviceId", async (req, res, next) => {
    try {
      const result = await driverCtrl.getDeviceById(req.params.deviceId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.post("/device/:deviceId/:command", jsonParser, async (req, res, next) => {
    try {
      await driverCtrl.runCommand(
        req.params.deviceId,
        req.params.command,
        req.body,
        drivers
      );
      res.send();
    } catch (err) {
      next(err);
    }
  });

  app.get("/drivers", async (req, res, next) => {
    try {
      const result = await driverCtrl.getDriversWithStats(drivers);
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/drivers/commands", async (req, res, next) => {
    try {
      const result = await driverCtrl.getCommands();
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/drivers/events", async (req, res, next) => {
    try {
      const result = await driverCtrl.getEventDescriptions();
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/event/latestCommands", async (req, res, next) => {
    try {
      const result = await eventCtrl.getLatestCommandEvents();
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/event/:eventType", async (req, res, next) => {
    try {
      const result = await eventCtrl.getEventsByType(
        req.params.eventType,
        req.query.from
      );
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  app.get("/pairingMode", async (req, res, next) => {
    try {
      const result = await interfaceCtrl.pairingMode();
      res.json(result);
    } catch (err) {
      next(err);
    }
  });

  // Error handling middleware
  app.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    if (err instanceof SyntaxError && err.message.includes("JSON")) {
      err.type = "BadRequest";
      err.message = `Invalid JSON. ${err.message}`;
    }
    switch (err.type) {
      case "Driver":
        console.error(err); // eslint-disable-line no-console
        res.status(500);
        return res.json({
          type: err.type,
          driver: err.driver,
          message: err.message
        });
      case "BadRequest":
        res.status(400);
        return res.json({
          type: err.type,
          message: err.message
        });
      case "NotFound":
        res.status(404);
        return res.json({
          type: err.type,
          message: err.message
        });
      case "Validation":
        res.status(400);
        return res.json({
          type: err.type,
          message: err.message,
          errors: err.errors
        });
      case "Connection":
        res.status(503);
        return res.json({
          type: err.type,
          message: err.message
        });
      case "Authentication":
        res.status(401);
        return res.json({
          type: err.type,
          message: err.message
        });
      default:
        console.error(err); // eslint-disable-line no-console
        res.status(500);
        return res.json({
          type: "Internal"
        });
    }
  });

  return app;
};
