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
const configJSON = require('../config/config-json');
const bodyParser = require('body-parser');
const activityUtils = require('../src/activityUtil');
// setup the discount-code example app
module.exports = function smsActivityApp(app, options) {
    const moduleDirectory = `${options.rootDirectory}/modules/sms-activity`;

    app.use(bodyParser.json());
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
        return res.status(200).json('save');
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
    app.post('/modules/sms-activity/validate', function (req, res) {
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


    app.get('/modules/sms-activity/deliveryreport', function (req, res) {
        console.log('delivery report');
        console.log(req.query);

        let reqBody = [];
        reqBody.push({
            "keys": {
                "GUID": req.query.CLIENT_GUID
            },
            "values": {
                "STATUS": req.query.MSG_STATUS,
                "DELIVEREDDATE": req.query.DELIVERED_DATE
            }
        });

        let accessRequest = {
            "grant_type": "client_credentials",
            "client_id": "kduzi47837sertymgtd515v6",
            "client_secret": "vP3OMwdzW46qSWXQXnPeJ4Bw",
            "account_id": "546001145"
        };

        fetch('https://mcv3d4v2fm7d1rqg9-fkxts8swqq.auth.marketingcloudapis.com/v2/token', {
            method: 'POST', body: JSON.stringify(accessRequest), headers: { 'Content-Type': 'application/json' }
        }).then(response => {

            response.json().then(data => {
                console.log(data);
                console.log(reqBody);
                fetch('https://mcv3d4v2fm7d1rqg9-fkxts8swqq.rest.marketingcloudapis.com/hub/v1/dataevents/key:CA054127-E2A5-494F-83EF-230B180A0F8E/rowset', {
                    method: 'POST', body: JSON.stringify(reqBody), headers: { 'Authorization': 'Bearer ' + data.access_token, 'Content-Type': 'application/json' }
                }).then(response1 => {

                    response1.json().then(data1 => {
                        console.log(data1);

                        return res.status(200).json('Success');
                    })
                }).catch(err1 => {
                    console.log(err1);
                });
                //return res.status(200).json(data1);
            })
        }).catch(err => {
            console.log(err);
        });
        //return res.status(200).json('delivery report success');
    });



    app.post('/modules/sms-activity/execute', function (req, res) {
        console.log('debug: /modules/sms-activity/execute');
        activityUtils.logData(req);

        console.log('req ', req);

        const request = req.body;

        console.log('request ', request);
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


        const mobileNumber = getInArgument('toNumber') || 'nothing';
        const senderName = getInArgument('senderName') || 'nothing';
        const mid = getInArgument('mid') || 'nothing';
        const message = getInArgument('message') || 'nothing';

        const jsonStr = {

            "@VER": "1.2",

            "USER": {},

            "DLR": {

                "@URL": "https://marketing-configuration-app-6564d07cc826.herokuapp.com/modules/sms-activity/deliveryreport?TO=%p&MSG_STATUS=%16&CLIENT_GUID=%5&STATUS_ERROR=%4&DELIVERED_DATE=%3&TEXT_STATUS=%13&MESSAGE_ID=%7&TAG=%TAG&CLIENT_SEQ_NUMBER=%6&REASON_CODE=%2"

            },

            "SMS": [

                {

                    "@UDH": "0",

                    "@CODING": "1",

                    "@TEXT": message,

                    "@PROPERTY": "0",

                    "@ID": "1",

                    "ADDRESS": [

                        {

                            "@FROM": senderName,

                            "@TO": mobileNumber,

                            "@SEQ": "12",

                            "@TAG": "db1"

                        }

                    ]

                }

            ]

        }

        console.log('jsonStr: ', JSON.stringify(jsonStr));

        fetch('https://api.myvfirst.com/psms/api/messages/token?action=generate', {
            method: 'POST', headers: { "Authorization": 'Basic ' + Buffer.from('demosfdc:f{(|p@nE4~').toString('base64') }
        }).then(response => {
            //return res.status(200).json(response);
            console.log(response);

            response.json().then(data => {

                console.log('data ', data.token);
                let token = data.token;


                fetch('https://api.myvfirst.com/psms/servlet/psms.JsonEservice', {
                    method: 'POST', headers: { "Authorization": 'Bearer ' + token, "Content-Type": 'application/json' }, body: JSON.stringify(jsonStr)
                }).then(response1 => {
                    console.log(response1);

                    response1.json().then(data1 => {
                        //return res.status(200).json(data1);
                        let reqBody = [];
                        reqBody.push({
                            "keys": {
                                "GUID": data1.MESSAGEACK.GUID.GUID
                            },
                            "values": {
                                ID: data1.MESSAGEACK.GUID.ID,
                                SUBMITDATE: data1.MESSAGEACK.GUID.SUBMITDATE,
                                FROM: senderName,
                                TO: mobileNumber,
                                TEXT: message
                            }
                        });
                        if (data1.MESSAGEACK.GUID.ERROR) {
                            console.log('error');
                            reqBody[0].values.STATUS = 'FAILED';
                        }
                        activityUtils.updateData(reqBody, res);
                    })
                }).catch(err => {
                    return res.status(400).json(err);
                });
            })
        }).catch(err => {
            return res.status(400).json(err);
        });

    });

};
