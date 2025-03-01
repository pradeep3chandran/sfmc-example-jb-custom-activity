
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
    console.log(configData);
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

    if (req.query.MSG_STATUS == 'Failed') {
        reqBody[0].values.ERROR_CODE = req.query.REASON_CODE;
        reqBody[0].values.ERROR_REASON = errorObject[req.query.REASON_CODE];
    }

    const configDataRes = await mongodbServiceInstance.getData(req.query.mid);
    let configData = configDataRes.body;

    let accessToken = '';
    if (configData.SFMC_TokenExp > Date.now()) {
        accessToken = configData.SFMC_Token;
    } else {
        const sfmcTokenResult = await sfmcServiceInstance.getToken(configData);
        let data = sfmcTokenResult.body.data;
        accessToken = data.access_token;

        let expDate = new Date();
        expDate.setMinutes(expDate.getMinutes() + 15);

        await mongodbServiceInstance.updateData({ MID: mid, SFMC_TokenExp: expDate, SFMC_Token: accessToken });
    }

    const sfmcResult = await sfmcServiceInstance.updateReportData(configData.body, accessToken, reqBody, 'SMS_Delivery_Reports_Data_Extension');
    if (sfmcResult.body) {
        return res.status(200).json('success');
    }
};

exports.execute = async function (req, res) {
    const request = req.body;

    let mobileNumber = '';
    let senderName = '';
    let mid = '';
    let message = '';
    let primaryKey = '';
    let campaignName = '';
    let host = '';

    if (request && request.inArguments) {
        for (let i = 0; i < request.inArguments.length; i++) {
            let e = request.inArguments[i];
            if (e['toNumber']) {
                mobileNumber = e['toNumber'];
            } else if (e['senderName']) {
                senderName = e['senderName'];
            } else if (e['mid']) {
                mid = e['mid'];
            } else if (e['message']) {
                message = e['message'];
            } else if (e['primaryKey']) {
                primaryKey = e['primaryKey'];
            } else if (e['campaignName']) {
                campaignName = e['campaignName'];
            } else if (e['host']) {
                host = e['host'];
            }
        }
    }

    let dlrUrl = 'https://' + host + '/modules/sms-activity/deliveryreport?mid=' + mid + '&TO=%p&MSG_STATUS=%16&CLIENT_GUID=%5&STATUS_ERROR=%4&DELIVERED_DATE=%3&TEXT_STATUS=%13&MESSAGE_ID=%7&TAG=%TAG&CLIENT_SEQ_NUMBER=%6&REASON_CODE=%2';

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

    const configDataRes = await mongodbServiceInstance.getData(mid);
    let configData = configDataRes.body;

    let token = '';
    if (configData.VF_SMSTokenExp > Date.now()) {
        token = configData.VF_SMSToken;
    } else {
        const tokenResult = await valueFirstServiceInstance.getToken(configData.Username, configData.Password);
        let data = tokenResult.body.data;
        token = data.token;
        const result = await mongodbServiceInstance.updateData({ MID: mid, VF_SMSTokenExp: data.expiryDate, VF_SMSToken: token });
    }

    const sendMessageResult = await valueFirstServiceInstance.sendMessage(token, jsonStr);
    let data1 = sendMessageResult.body.data;
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

    let accessToken = '';
    if (configData.SFMC_TokenExp > Date.now()) {
        accessToken = configData.SFMC_Token;
    } else {
        const sfmcTokenResult = await sfmcServiceInstance.getToken(configData);
        let data2 = sfmcTokenResult.body.data;
        accessToken = data2.access_token;

        let expDate = new Date();
        expDate.setMinutes(expDate.getMinutes() + 15);

        await mongodbServiceInstance.updateData({ MID: mid, SFMC_TokenExp: expDate, SFMC_Token: accessToken });
    }

    const sfmcResult = await sfmcServiceInstance.updateReportData(configData, accessToken, reqBody, 'SMS_Delivery_Reports_Data_Extension');
    if (sfmcResult.body) {
        res.status(200).json({ errorCode: reqBody[0].values.ERROR_CODE, GUID: reqBody[0].keys.GUID, status: reqBody[0].values.STATUS });
    }
};