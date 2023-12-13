const express = require('express');
const configJSON = require('../config/config-json');
const controllerjs = require('../controllers/smsController');
const path = require('path');

module.exports = function smsActivityApp(app, options) {
    const moduleDirectory = `${options.rootDirectory}/modules/sms-activity`;

    app.use('/modules/sms-activity/images', express.static(`${moduleDirectory}/images`));

    app.get('/modules/sms-activity/', function (req, res) {
        return res.redirect('/modules/sms-activity/index.html');
    });

    app.get('/modules/sms-activity/index.html', function (req, res) {
        return res.sendFile(`${moduleDirectory}/html/index.html`);
    });

    // setup config.json route
    app.get('/modules/sms-activity/config.json', function (req, res) {
        return res.status(200).json(configJSON(req));
    });

    app.get('/modules/sms-activity/src/require.js', function (req, res) {
        return res.sendFile(path.resolve('src/js/require.js'));
    });

    app.get('/modules/sms-activity/src/jquery.min.js', function (req, res) {
        return res.sendFile(path.resolve('src/js/jquery.min.js'));
    });

    app.get('/modules/sms-activity/src/customActivity.js', function (req, res) {
        return res.sendFile(`${moduleDirectory}/src/customActivity.js`);
    });

    app.get('/modules/sms-activity/src/postmonger.js', function (req, res) {
        return res.sendFile(path.resolve('src/js/postmonger.js'));
    });

    app.post('/modules/sms-activity/save', function (req, res) {
        console.log('debug: /modules/sms-activity/save');
        return res.status(200).json('save');
    });

    app.post('/modules/sms-activity/publish', function (req, res) {
        console.log('debug: /modules/sms-activity/publish');
        return res.status(200).json({});
    });

    app.post('/modules/sms-activity/validate', function (req, res) {
        console.log('debug: /modules/sms-activity/validate');
        return res.status(200).json({});
    });


    app.post('/modules/sms-activity/stop', function (req, res) {
        console.log('debug: /modules/sms-activity/stop');
        return res.status(200).json({});
    });

    app.get('/modules/sms-activity/getConfigData', controllerjs.getConfigData);
    app.get('/modules/sms-activity/deliveryreport', controllerjs.deliveryReport);
    app.post('/modules/sms-activity/execute', controllerjs.execute);

};
