// JOURNEY BUILDER CUSTOM ACTIVITY - discount-code ACTIVITY
// ````````````````````````````````````````````````````````````
// SERVER SIDE IMPLEMENTATION
//
// This example demonstrates
// * Configuration Lifecycle Events
//    - save
//    - publish
//    - validate
// * Execution Lifecycle Events
//    - execute
//    - stop

const express = require('express');
const path = require('path');
const configJSON = require('../config/config-json');
const js = require('../app/index');

//app.use('/modules/sms-activity/images', express.static(`${moduleDirectory}/images`));
app.use('/modules/sms-activity/images', express.static(path.join(__dirname, '/images')));

app.get('/modules/sms-activity/', js.appredirect);

app.get('/modules/sms-activity/index.html', js.appredirectAsfile);

app.get('/modules/sms-activity/config.json', js.configJS);

app.get('/modules/sms-activity/src/require.js', js.reqjs);

app.get('/modules/sms-activity/src/jquery.min.js', js.jsmin);

app.get('/modules/sms-activity/src/customActivity.js', js.customActivity);

app.get('/modules/sms-activity/src/postmonger.js', js.postmongerjs);


app.post('/modules/sms-activity/save', js.save);

app.post('/modules/sms-activity/publish', js.publish);

app.post('/modules/sms-activity/validate', js.validate);

app.post('/modules/sms-activity/stop', js.stop);

app.post('/modules/sms-activity/execute', js.execute);




// setup the discount-code example app
/*module.exports = function smsActivityApp(app, options) {
    const moduleDirectory = `${options.rootDirectory}/modules/sms-activity`;

    app.use('/modules/sms-activity/images', express.static(`${moduleDirectory}/images`));

    // setup the index redirect
    app.get('/modules/sms-activity/', function (req, res) {
        return res.redirect('/modules/sms-activity/index.html');
    });

    // setup index.html route
    app.get('/modules/sms-activity/index.html', function (req, res) {
        // you can use your favorite templating library to generate your html file.
        // this example keeps things simple and just returns a static file
        return res.sendFile(`${moduleDirectory}/html/index.html`);
    });

    // setup config.json route
    app.get('/modules/sms-activity/config.json', function (req, res) {
        // Journey Builder looks for config.json when the canvas loads.
        // We'll dynamically generate the config object with a function
        return res.status(200).json(configJSON(req));
    });

    app.get('/modules/sms-activity/src/require.js', function (req, res) {
        // Journey Builder looks for config.json when the canvas loads.
        // We'll dynamically generate the config object with a function
        return res.sendFile(`${moduleDirectory}/src/require.js`);
    });

    app.get('/modules/sms-activity/src/jquery.min.js', function (req, res) {
        // Journey Builder looks for config.json when the canvas loads.
        // We'll dynamically generate the config object with a function
        return res.sendFile(`${moduleDirectory}/src/jquery.min.js`);
    });

    app.get('/modules/sms-activity/src/customActivity.js', function (req, res) {
        // Journey Builder looks for config.json when the canvas loads.
        // We'll dynamically generate the config object with a function
        return res.sendFile(`${moduleDirectory}/src/customActivity.js`);
    });

    app.get('/modules/sms-activity/src/postmonger.js', function (req, res) {
        // Journey Builder looks for config.json when the canvas loads.
        // We'll dynamically generate the config object with a function
        return res.sendFile(`${moduleDirectory}/src/postmonger.js`);
    });

    // ```````````````````````````````````````````````````````
    // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
    //
    // CONFIGURATION
    // ```````````````````````````````````````````````````````
    // Reference:
    // https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/interaction-operating-states.htm

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


    // ```````````````````````````````````````````````````````
    // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
    //
    // EXECUTING JOURNEY
    // ```````````````````````````````````````````````````````

    app.post('/modules/sms-activity/stop', function (req, res) {
        console.log('debug: /modules/sms-activity/stop');
        return res.status(200).json({});
    });

    app.post('/modules/sms-activity/execute', js.execute);

};*/
