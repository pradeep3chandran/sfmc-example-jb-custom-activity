
const path = require('path');
const mongodbService = require(path.resolve('src/services/mongodbService'));
const mongodbServiceInstance = new mongodbService();

const valueFirstService = require(path.resolve('src/services/valueFirstService'));
const valueFirstServiceInstance = new valueFirstService();

const sfmcService = require(path.resolve('src/services/sfmcService'));
const sfmcServiceInstance = new sfmcService();

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



exports.getConfigData = async function (req, res) {
    const configData = await mongodbServiceInstance.getData(req.query.mid);
    res.json(configData.body);
};

exports.deliveryReport = async function (req, res) {
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

    const configData = await mongodbServiceInstance.getData(req.query.mid);

    const sfmcTokenResult = await sfmcServiceInstance.getToken(configData.body);
    console.log('tokenResult', sfmcTokenResult);
    sfmcTokenResult.body.json().then(async (data) => {
        const sfmcResult = await sfmcServiceInstance.updateReportData(configData.body, data.access_token, reqBody, 'CA054127-E2A5-494F-83EF-230B180A0F8E');
        sfmcResult.body.json().then(data1 => {
            return res.status(200).json('success');
        })
    });
};

exports.execute = async function (req, res) {
    console.log('debug: /modules/sms-activity/execute');
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
    const configData = getInArgument('configData') || 'nothing';

    let dlrUrl = 'https://marketing-configuration-app-6564d07cc826.herokuapp.com/modules/sms-activity/deliveryreport?mid=' + mid + '&TO=%p&MSG_STATUS=%16&CLIENT_GUID=%5&STATUS_ERROR=%4&DELIVERED_DATE=%3&TEXT_STATUS=%13&MESSAGE_ID=%7&TAG=%TAG&CLIENT_SEQ_NUMBER=%6&REASON_CODE=%2';

    const jsonStr = {

        "@VER": "1.2",

        "USER": {},

        "DLR": {

            "@URL": dlrUrl

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

    console.log('dataa ', configData);


    const tokenResult = await valueFirstServiceInstance.getToken(configData);
    tokenResult.body.json().then(async (data) => {

        console.log('data ', data.token);
        let token = data.token;
        const sendMessageResult = await valueFirstServiceInstance.sendMessage(token, jsonStr);
        sendMessageResult.body.json().then(async (data1) => {
            let reqBody = [];
            if (data1.MESSAGEACK.GUID) {
                reqBody.push({
                    "keys": {
                        "GUID": data1.MESSAGEACK.GUID.GUID
                    },
                    "values": {
                        ID: data1.MESSAGEACK.GUID.ID,
                        SUBMIT_DATE: data1.MESSAGEACK.GUID.SUBMITDATE,
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
                const date = new Date().toLocaleString();
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

            const sfmcTokenResult = await sfmcServiceInstance.getToken(configData);
            sfmcTokenResult.body.json().then(async (data2) => {
                const sfmcResult = await sfmcServiceInstance.updateReportData(configData, data2.access_token, reqBody, 'CA054127-E2A5-494F-83EF-230B180A0F8E');
                sfmcResult.body.json().then(data3 => {
                    res.status(200).json({ errorCode: reqBody[0].values.ERROR_CODE, GUID: reqBody[0].keys.GUID, status: reqBody[0].values.STATUS });
                })
            });
        })
    })

};