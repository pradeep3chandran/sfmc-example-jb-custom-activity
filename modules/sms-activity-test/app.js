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
const configJSON = require('../js/config-json');

// setup the discount-code example app
module.exports = function discountCodeExample(app, options) {
  const moduleDirectory = `${options.rootDirectory}/modules/sms-activity`;

  // setup static resources
  app.use('/modules/sms-activity/dist', express.static(`${moduleDirectory}/dist`));
  app.use('/modules/sms-activity/images', express.static(`${moduleDirectory}/images`));

  // setup the index redirect
  app.get('/modules/sms-activity/', function (req, res) {
    return res.redirect('/modules/sms-activity/index.html');
  });

  // setup index.html route
  app.get('/modules/sms-activity/index.html', function (req, res) {
    // you can use your favorite templating library to generate your html file.
    // this example keeps things simple and just returns a static file
    return res.sendFile(`${moduleDirectory}/index.html`);
  });

  // setup config.json route
  app.get('/modules/sms-activity/config.json', function (req, res) {
    // Journey Builder looks for config.json when the canvas loads.
    // We'll dynamically generate the config object with a function
    return res.status(200).json(configJSON(req));
  });

  // ```````````````````````````````````````````````````````
  // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
  //
  // CONFIGURATION
  // ```````````````````````````````````````````````````````
  // Reference:
  // https://developer.salesforce.com/docs/atlas.en-us.mc-apis.meta/mc-apis/interaction-operating-states.htm

  /**
   * Called when a journey is saving the activity.
   * @return {[type]}     [description]
   * 200 - Return a 200 iff the configuraiton is valid.
   * 30x - Return if the configuration is invalid (this will block the publish phase)
   * 40x - Return if the configuration is invalid (this will block the publish phase)
   * 50x - Return if the configuration is invalid (this will block the publish phase)
   */
  app.post('/modules/sms-activity/save', function (req, res) {
    console.log('debug: /modules/sms-activity/save');
    return res.status(200).json({});
  });

  /**
   * Called when a Journey has been published.
   * This is when a journey is being activiated and eligible for contacts
   * to be processed.
   * @return {[type]}     [description]
   * 200 - Return a 200 iff the configuraiton is valid.
   * 30x - Return if the configuration is invalid (this will block the publish phase)
   * 40x - Return if the configuration is invalid (this will block the publish phase)
   * 50x - Return if the configuration is invalid (this will block the publish phase)
   */
  app.post('/modules/sms-activity/publish', function (req, res) {
    console.log('debug: /modules/sms-activity/publish');
    return res.status(200).json({});
  });

  /**
   * Called when Journey Builder wants you to validate the configuration
   * to ensure the configuration is valid.
   * @return {[type]}
   * 200 - Return a 200 iff the configuraiton is valid.
   * 30x - Return if the configuration is invalid (this will block the publish phase)
   * 40x - Return if the configuration is invalid (this will block the publish phase)
   * 50x - Return if the configuration is invalid (this will block the publish phase)
   */
  app.post('/modules/sms-activity/alidate', function (req, res) {
    console.log('debug: /modules/sms-activity/validate');
    return res.status(200).json({});
  });


  // ```````````````````````````````````````````````````````
  // BEGIN JOURNEY BUILDER LIFECYCLE EVENTS
  //
  // EXECUTING JOURNEY
  // ```````````````````````````````````````````````````````

  /**
   * Called when a Journey is stopped.
   * @return {[type]}
   */
  app.post('/modules/sms-activity/stop', function (req, res) {
    console.log('debug: /modules/sms-activity/stop');
    return res.status(200).json({});
  });

  /**
   * Called when a contact is flowing through the Journey.
   * @return {[type]}
   * 200 - Processed OK
   * 3xx - Contact is ejected from the Journey.
   * 4xx - Contact is ejected from the Journey.
   * 5xx - Contact is ejected from the Journey.
   */
  app.post('/modules/sms-activity/execute', function (req, res) {
    console.log('debug: /modules/sms-activity/execute');

    const request = req.body;

    console.log(" req.body", JSON.stringify(req.body));

    // Find the in argument
    function getInArgument(k) {
      if (request && request.inArguments) {
        for (let i = 0; i < request.inArguments.length; i++) {
          let e = request.inArguments[i];
          if (k in e) {
            return e[k];
          }
        }
      }
    }
  });

};
