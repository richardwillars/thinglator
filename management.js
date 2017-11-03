/* eslint-disable no-console */
const config = require('config');
const express = require('express');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const npm = require('npm-programmatic');
const pm2 = require('pm2');
const exec = require('child_process').exec;

const jsonParser = bodyParser.json();

console.log(chalk.yellow('Starting Thinglator management API'));

// load and initialise express
const app = express();

const delay = t => new Promise((resolve) => {
    setTimeout(resolve, t);
});

const pm2Restart = packageId => new Promise((resolve, reject) => {
    pm2.restart(packageId, (err, apps) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(apps);
    });
});

const pm2GetInfo = packageId => new Promise((resolve, reject) => {
    pm2.describe(packageId, (err, describeInfo) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(describeInfo);
    });
});

const installDriver = async (driverId) => {
    await npm.install([`thinglator-driver-${driverId}`], {
        cwd: './',
        save: true
    });
    await pm2Restart(config.get('pm2.thinglatorId'));
    await delay(3000);
    const info = await pm2GetInfo(config.get('pm2.thinglatorId'));

    if (info[0].pm2_env.unstable_restarts > 0) {
        throw new Error('Install failed');
    }
}

const uninstallDriver = async (driverId) => {
    await npm.uninstall([`thinglator-driver-${driverId}`], {
        cwd: './',
        save: true
    })
    await pm2Restart(config.get('pm2.thinglatorId'));
    await delay(3000);
    const info = await pm2GetInfo(config.get('pm2.thinglatorId'));

    if (info[0].pm2_env.unstable_restarts > 0) {
        throw new Error('Install failed');
    }
}

// setup the HTTP API
app.get('/', (req, res) => {
    res.json({
        'Thinglator Management': 'Oh, hi!'
    });
});

app.post('/install', jsonParser, async (req, res) => {
    try {
        const body = req.body;
        if (!body.driverId) {
            throw new Error('driverId not specified');
        }
        await installDriver(body.driverId);

        res.json({ success: true });
    }
    catch(err) {
        res.status(400);
        console.error(err);
        res.json({
            message: err.message
        });
    }
});

app.post('/uninstall', jsonParser, async (req, res) => {
    try {
        const body = req.body;
        if (!body.driverId) {
            throw new Error('driverId not specified');
        }
        await uninstallDriver(body.driverId);

        res.json({ success: true });
    }
    catch(err) {
        res.status(400);
        console.error(err);
        res.json({
            message: err.message
        });
    }
});

// Initialise the webserver
const httpServer = app.listen(config.get('management.port'), () => {
    console.log(chalk.blue(`REST API server listening on port ${config.get('management.port')}`));
});
