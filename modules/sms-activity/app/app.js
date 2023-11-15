const express = require('express');
const configJSON = require('../config/config-json');
const bodyParser = require('body-parser');
const activityUtils = require('../src/activityUtil');

const errorObject = {
    52992: "Username / Password incorrect",
    52995: "Daily Credit limit Reached",
    57089: "Contract expired",
    57090: "User credit expired",
    57091: "User disabled",
    65280: "Service is temporarily unavailable",
    65535: "The specified message does not conform to DTD",
    28673: "Destination number not numeric",
    28674: "Destination number empty",
    28675: "Sender address empty",
    28676: "Template mismatch",
    28677: "UDH is invalid / SPAM message",
    28678: "Coding is invalid",
    28679: "SMS text is empty",
    28680: "Invalid sender ID",
    28681: "Invalid message, Duplicate message, Submit failed",
    28682: "Invalid Receiver ID (Will validate Indian mobile numbers only.)",
    28683: "Invalid Date time for message Schedule (If the date specified in message post for schedule delivery is less than current date or more than expiry date or more than 1 year)",
    28684: "Invalid SMS Block",
    28692: "Invalid Split Count",
    28694: "Invalid/Incomplete details in TEMPLATEINFO tag of request. If occurred any error , related to TEMPLATEINFO parameter, which include like invalid template id is provided, variables count mismatch than the template Text variables count, template text not found for the given template id",
    28695: "Template matched but invalid variables in template",
    28696: "Media ID, type, content type cannot be null or blank in case of two waymedia message. If text have data, it should be in base64 format",
    28697: "Incorrect User Route",
    28698: "Invalid/Blank Media data or type(In case of Push Media Message)",
    28699: "MSGTYPE in WhatsApp Data Request Packet is empty",
    28700: "WhatsApp Data Request Packet is Empty / Media type in WhatsApp data request packet does not match with the MSGTYPE received in the request.",
    28702: "Invalid DLT Parameters",
    28703: "Invalid DLT Content Type",
    28704: "Invalid Authorization Type(If message is rejected due to authorizationscheme other than Authorization header)",
    8448: "Message delivered successfully",
    8449: "Message failed"
};

module.exports = function smsActivityApp(app, options) {
    const moduleDirectory = `${options.rootDirectory}/modules/sms-activity`;

    app.use(bodyParser.json());
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
        return res.sendFile(`${moduleDirectory}/src/require.js`);
    });

    app.get('/modules/sms-activity/src/jquery.min.js', function (req, res) {
        return res.sendFile(`${moduleDirectory}/src/jquery.min.js`);
    });

    app.get('/modules/sms-activity/src/customActivity.js', function (req, res) {
        return res.sendFile(`${moduleDirectory}/src/customActivity.js`);
    });

    app.get('/modules/sms-activity/src/postmonger.js', function (req, res) {
        return res.sendFile(`${moduleDirectory}/src/postmonger.js`);
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


    app.get('/modules/sms-activity/deliveryreport', async function (req, res) {
        console.log('delivery report');
        console.log(req.query);

        let reqBody = [];
        reqBody.push({
            "keys": {
                "GUID": req.query.CLIENT_GUID
            },
            "values": {
                "STATUS": req.query.MSG_STATUS,
                "DELIVERED_DATE": req.query.DELIVERED_DATE
            }
        });

        let accessRequest = {
            "grant_type": "client_credentials",
            "client_id": "kduzi47837sertymgtd515v6",
            "client_secret": "vP3OMwdzW46qSWXQXnPeJ4Bw",
            "account_id": "546001145"
        };

        await fetch('https://mcv3d4v2fm7d1rqg9-fkxts8swqq.auth.marketingcloudapis.com/v2/token', {
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



    app.post('/modules/sms-activity/execute', async function (req, res) {
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
        const primaryKey = getInArgument('primaryKey') || 'nothing';
        const campaignName = getInArgument('campaignName') || 'nothing';

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

                    "@ID": primaryKey,

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

        await fetch('https://api.myvfirst.com/psms/api/messages/token?action=generate', {
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
                        let date1 = new Date().toLocaleDateString()

                        let reqBody = [];
                        if (data1.MESSAGEACK.GUID) {
                            reqBody.push({
                                "keys": {
                                    "GUID": data1.MESSAGEACK.GUID.GUID
                                },
                                "values": {
                                    ID: data1.MESSAGEACK.GUID.ID,
                                    SUBMIT_DATE: date1,
                                    FROM: senderName,
                                    TO: mobileNumber,
                                    TEXT: message,
                                    STATUS: 'Submitted',
                                    CAMPAIGN_NAME: campaignName
                                }
                            });
                            if (data1.MESSAGEACK.GUID.ERROR) {
                                console.log('error');
                                reqBody[0].values.STATUS = 'Failed';
                                reqBody[0].values.ERROR_CODE = data1.MESSAGEACK.GUID.ERROR.CODE;
                                reqBody[0].values.ERROR_REASON = errorObject[data1.MESSAGEACK.GUID.ERROR.CODE];
                            }
                        } else {
                            const date = new Date();
                            reqBody.push({
                                "keys": {
                                    "GUID": primaryKey + date
                                },
                                "values": {
                                    ID: primaryKey,
                                    SUBMIT_DATE: date,
                                    FROM: senderName,
                                    TO: mobileNumber,
                                    TEXT: message,
                                    STATUS: 'Failed',
                                    ERROR_CODE: data1.MESSAGEACK.Err.Code,
                                    ERROR_REASON: errorObject[data1.MESSAGEACK.Err.Code],
                                    CAMPAIGN_NAME: campaignName
                                }
                            });
                        }
                        console.log(reqBody);

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
