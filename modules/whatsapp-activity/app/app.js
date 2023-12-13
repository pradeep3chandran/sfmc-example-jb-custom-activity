const express = require('express');
const configJSON = require('../config/config-json');
const controllerjs = require('../routes/controller');

module.exports = function whatsAppActivityApp(app, options) {
    const moduleDirectory = `${options.rootDirectory}/modules/whatsapp-activity`;

    app.use(express.json());
    app.use('/modules/whatsapp-activity/images', express.static(`${moduleDirectory}/images`));

    app.get('/modules/whatsapp-activity/', function (req, res) {
        return res.redirect('/modules/whatsapp-activity/index.html');
    });

    app.get('/modules/whatsapp-activity/index.html', function (req, res) {
        return res.sendFile(`${moduleDirectory}/html/index.html`);
    });

    // setup config.json route
    app.get('/modules/whatsapp-activity/config.json', function (req, res) {
        return res.status(200).json(configJSON(req));
    });

    app.get('/modules/whatsapp-activity/src/require.js', function (req, res) {
        return res.sendFile(`${moduleDirectory}/src/require.js`);
    });

    app.get('/modules/whatsapp-activity/src/jquery.min.js', function (req, res) {
        return res.sendFile(`${moduleDirectory}/src/jquery.min.js`);
    });

    app.get('/modules/whatsapp-activity/src/customActivity.js', function (req, res) {
        return res.sendFile(`${moduleDirectory}/src/customActivity.js`);
    });

    app.get('/modules/whatsapp-activity/src/postmonger.js', function (req, res) {
        return res.sendFile(`${moduleDirectory}/src/postmonger.js`);
    });

    app.get('/modules/whatsapp-activity/gettemplates', controllerjs.getTemplates);


    app.post('/modules/whatsapp-activity/save', function (req, res) {
        console.log('debug: /modules/sms-activity/save');
        return res.status(200).json('save');
    });

    app.post('/modules/whatsapp-activity/publish', function (req, res) {
        console.log('debug: /modules/sms-activity/publish');
        return res.status(200).json({});
    });


    app.post('/modules/whatsapp-activity/validate', function (req, res) {
        console.log('debug: /modules/sms-activity/validate');
        return res.status(200).json({});
    });


    app.post('/modules/whatsapp-activity/stop', function (req, res) {
        console.log('debug: /modules/sms-activity/stop');
        return res.status(200).json({});
    });


    app.get('/modules/whatsapp-activity/inboundmessage', controllerjs.inboundMessage);
    app.all('/modules/whatsapp-activity/deliveryreport', controllerjs.deliveryReport);
    app.post('/modules/whatsapp-activity/execute', controllerjs.execute);

};
