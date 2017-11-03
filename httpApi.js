module.exports = (bodyParser, authenticateCtrl, eventCtrl, driverCtrl, app, drivers) => {
  const jsonParser = bodyParser.json();

  app.get('/', (req, res) => {
    res.json({
      Thinglator: 'Oh, hi!',
    });
  });

  app.get('/authenticate/:driver', (req, res, next) => {
    authenticateCtrl.getAuthenticationProcess(req.params.driver, drivers)
      .then((result) => {
        res.json(result);
      }).catch((err) => {
        next(err);
      });
  });

  app.post('/authenticate/:driver/:stepId', jsonParser, (req, res, next) => {
    authenticateCtrl.authenticationStep(req.params.driver, req.params.stepId, req.body)
      .then((result) => {
        res.json(result);
      }).catch((err) => {
        next(err);
      });
  });

  app.get('/discover/:driver', (req, res, next) => {
    driverCtrl.discover(req.params.driver, drivers)
      .then((results) => {
        res.json(results);
      }).catch((err) => {
        next(err);
      });
  });

  app.get('/devices', (req, res, next) => {
    driverCtrl.getAllDevices()
      .then((results) => {
        res.json(results);
      }).catch((err) => {
        next(err);
      });
  });

  app.get('/devices/type/:type', (req, res, next) => {
    driverCtrl.getDevicesByType(req.params.type)
      .then((results) => {
        res.json(results);
      }).catch((err) => {
        next(err);
      });
  });

  app.get('/devices/driver/:driver', (req, res, next) => {
    driverCtrl.getDevicesByDriver(req.params.driver)
      .then((results) => {
        res.json(results);
      }).catch((err) => {
        next(err);
      });
  });

  app.get('/device/:deviceId', (req, res, next) => {
    driverCtrl.getDeviceById(req.params.deviceId)
      .then((result) => {
        res.json(result);
      }).catch((err) => {
        next(err);
      });
  });

  app.post('/device/:deviceId/:command', jsonParser, (req, res, next) => {
    driverCtrl.runCommand(req.params.deviceId, req.params.command, req.body, drivers)
      .then(() => {
        res.send();
      }).catch((err) => {
        next(err);
      });
  });

  app.get('/drivers', (req, res, next) => {
    driverCtrl.getDriversWithStats(drivers)
      .then((results) => {
        res.json(results);
      }).catch((err) => {
        next(err);
      });
  });

  app.get('/drivers/commands', (req, res, next) => {
    driverCtrl.getCommandDescriptions()
      .then((results) => {
        res.json(results);
      }).catch((err) => {
        next(err);
      });
  });

  app.get('/drivers/events', (req, res, next) => {
    driverCtrl.getEventDescriptions()
      .then((results) => {
        res.json(results);
      }).catch((err) => {
        next(err);
      });
  });

  app.get('/event/latestCommands', (req, res, next) => {
    eventCtrl.getLatestCommandEvents()
      .then((results) => {
        res.json(results);
      }).catch((err) => {
        next(err);
      });
  });

  app.get('/event/:eventType', (req, res, next) => {
    eventCtrl.getEventsByType(req.params.eventType, req.query.from)
      .then((results) => {
        res.json(results);
      }).catch((err) => {
        next(err);
      });
  });

  // Error handling middleware
  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    switch (err.type) {
      case 'Driver':
        console.error(err); // eslint-disable-line no-console
        res.status(500);
        return res.json({
          type: err.type,
          driver: err.driver,
          message: err.message,
        });
      case 'BadRequest':
        res.status(400);
        return res.json({
          type: err.type,
          message: err.message,
        });
      case 'NotFound':
        res.status(404);
        return res.json({
          type: err.type,
          message: err.message,
        });
      case 'Validation':
        res.status(400);
        return res.json({
          type: err.type,
          message: err.message,
          errors: err.errors,
        });
      case 'Connection':
        res.status(503);
        return res.json({
          type: err.type,
          message: err.message,
        });
      case 'Authentication':
        res.status(401);
        return res.json({
          type: err.type,
          message: err.message,
        });
      default:
        console.error(err); // eslint-disable-line no-console
        res.status(500);
        return res.json({
          type: 'Internal',
        });
    }
  });

  return app;
};
