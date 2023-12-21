'use strict';

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
    8449: "Message failed",
    "000": "Read",
    173: "Delivered but not Read",
    401: "Contact not registered on WhatsApp",
    402: "Sent",
    2008: "Media format used is unsupported",
    2009: "Required component in the Template is missing",
    2010: "URL in button component is invalid",
    2011: "Phone Number in button component is invalid",
    2012: "Parameter format does not match format in the created Template",
    2013: "Buttons are unsupported by the receiver",
    100: "Miscellaneous",
};

exports.getConfigData = async function (req, res) {
    const configData = await mongodbServiceInstance.getData(req.query.mid);
    res.json(configData.body);
};

exports.getTemplates = async function (req, res) {

    let configData = req.body;
    const templates = await valueFirstServiceInstance.getTemplates(configData);
    console.log('data.json;', templates.body.data);
    res.json(templates.body.data);
}

exports.execute = async function (req, res) {
    const request = req.body;
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

    let bodyFieldDetails = getInArgument('bodyFieldDetails') || 'nothing';
    let headerFieldDetails = getInArgument('headerFieldDetails') || 'nothing';
    let buttonFieldDetails = getInArgument('buttonFieldDetails') || 'nothing';
    let selectedTemplate = getInArgument('selectedTemplate') || 'nothing';
    let headerDocURL = getInArgument('headerDocURL') || 'nothing';
    let messageAction = getInArgument('messageAction') || 'nothing';
    let configData = getInArgument('configData') || 'nothing';

    let mobileNumber = getInArgument('toNumber') || 'nothing';
    let senderName = getInArgument('senderName') || 'nothing';
    let mid = getInArgument('mid') || 'nothing';
    let primaryKey = getInArgument('primaryKey') || 'nothing';
    let campaignName = getInArgument('campaignName') || 'nothing';

    let templateId = getInArgument('templateId') || 'nothing';
    const host = getInArgument('host') || 'nothing';

    if (messageAction == 'Retry Message') {
        bodyFieldDetails = selectedTemplate.BODY_FIELD_DETAILS ? JSON.parse(selectedTemplate.BODY_FIELD_DETAILS) : [];
        headerFieldDetails = selectedTemplate.HEADER_FIELD_DETAILS ? JSON.parse(selectedTemplate.HEADER_FIELD_DETAILS) : [];
        buttonFieldDetails = selectedTemplate.BUTTON_FIELD_DETAILS ? JSON.parse(selectedTemplate.BUTTON_FIELD_DETAILS) : [];
        headerDocURL = selectedTemplate.DOCUMENT_URL;
        mobileNumber = selectedTemplate.TO;
        senderName = selectedTemplate.FROM;
        templateId = selectedTemplate.TEMPLATE_ID;
        primaryKey = selectedTemplate.GUID;
    }

    let templateInfo = templateId;

    if (bodyFieldDetails && bodyFieldDetails != 'nothing') {
        for (let i = 0; i < bodyFieldDetails.length; i++) {
            templateInfo += '~' + bodyFieldDetails[i].value;
        }
    }

    let mediatype = '';
    let msgType = "1";
    if (messageAction == 'Retry Message') {
        mediatype = selectedTemplate.MEDIA_TYPE;
    } else {
        mediatype = selectedTemplate.mediatype;
    }

    msgType = (mediatype == 'video' || mediatype == 'image' || mediatype == 'document' || mediatype == 'audio') ? "3" : "1";


    let dlrUrl = 'https://' + host + '/modules/whatsapp-activity/deliveryreport?MESSAGE_ID=%7&mid=' + mid + '&TO=%p&MSG_STATUS=%16&CLIENT_GUID=%5&STATUS_ERROR=%4&DELIVERED_DATE=%3&TEXT_STATUS=%13&MESSAGE_ID=%7&TAG=%TAG&CLIENT_SEQ_NUMBER=%6&REASON_CODE=%2';

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

                "@TEMPLATEINFO": templateInfo,

                "@MSGTYPE": msgType,

                "@PROPERTY": "0",

                "@ID": primaryKey,

                "ADDRESS": [

                    {

                        "@FROM": senderName,

                        "@TO": mobileNumber,

                        "@SEQ": primaryKey,
                    }

                ]

            }

        ]

    }

    if (buttonFieldDetails && buttonFieldDetails.length > 0 && buttonFieldDetails != 'nothing') {
        jsonStr.SMS[0]['@B_URLINFO'] = buttonFieldDetails[0].value;
    }


    const tokenResult = await valueFirstServiceInstance.getToken(configData.WhatsApp_Username, configData.WhatsApp_Password);
    let data = tokenResult.body.data;
    console.log('data ', data.token);
    let token = data.token;
    const sendMessageResult = await valueFirstServiceInstance.sendMessage(token, jsonStr);
    let messageData = sendMessageResult.body.data;
    let templatetext;
    let headerText;
    let footerText;
    let buttonInfo;
    if (messageAction == 'New Message') {

        let bodyIndex = selectedTemplate.whatsappcomponents.findIndex(obj => obj.type == 'BODY');
        templatetext = selectedTemplate.whatsappcomponents[bodyIndex].text;

        let headerIndex = selectedTemplate.whatsappcomponents.findIndex(obj => obj.type == 'HEADER' && obj.format == 'TEXT');
        headerText = headerIndex >= 0 ? selectedTemplate.whatsappcomponents[headerIndex].text : '';

        let footerIndex = selectedTemplate.whatsappcomponents.findIndex(obj => obj.type == 'FOOTER');
        footerText = footerIndex >= 0 ? selectedTemplate.whatsappcomponents[footerIndex].text : '';

        let buttonIndex = selectedTemplate.whatsappcomponents.findIndex(obj => obj.type == 'BUTTONS');
        buttonInfo = buttonIndex >= 0 ? selectedTemplate.whatsappcomponents[buttonIndex].buttons : '';
    }
    let reqBody = [];
    if (messageData.MESSAGEACK.GUID) {
        if (messageAction == 'Retry Message') {
            reqBody.push({
                "keys": {
                    "GUID": messageData.MESSAGEACK.GUID.GUID
                },
                "values": {
                    ID: messageData.MESSAGEACK.GUID.ID,
                    SUBMIT_DATE: messageData.MESSAGEACK.GUID.SUBMITDATE,
                    FROM: senderName,
                    TO: mobileNumber,
                    TEXT: selectedTemplate.TEXT,
                    STATUS: 'Submitted',
                    CAMPAIGN_NAME: campaignName,
                    TEMPLATE_NAME: selectedTemplate.TEMPLATE_NAME,
                    TEMPLATE_ID: selectedTemplate.TEMPLATE_ID,
                    MEDIA_TYPE: selectedTemplate.MEDIA_TYPE,
                    DOCUMENT_URL: headerDocURL,
                    HEADER_FIELD_DETAILS: JSON.stringify(headerFieldDetails),
                    BODY_FIELD_DETAILS: JSON.stringify(bodyFieldDetails),
                    BUTTON_FIELD_DETAILS: JSON.stringify(buttonFieldDetails),
                    BUTTON_INFO: selectedTemplate.BUTTON_INFO,
                    FOOTER_TEXT: selectedTemplate.FOOTER_TEXT,
                    HEADER_TEXT: selectedTemplate.HEADER_TEXT,
                    TYPE: 'Outbound Message'
                }
            });
        } else {
            reqBody.push({
                "keys": {
                    "GUID": messageData.MESSAGEACK.GUID.GUID
                },
                "values": {
                    ID: messageData.MESSAGEACK.GUID.ID,
                    SUBMIT_DATE: messageData.MESSAGEACK.GUID.SUBMITDATE,
                    FROM: senderName,
                    TO: mobileNumber,
                    TEXT: templatetext,
                    STATUS: 'Submitted',
                    CAMPAIGN_NAME: campaignName,
                    TEMPLATE_NAME: selectedTemplate.templatename,
                    TEMPLATE_ID: selectedTemplate.templateid,
                    MEDIA_TYPE: selectedTemplate.mediatype,
                    DOCUMENT_URL: headerDocURL,
                    HEADER_FIELD_DETAILS: JSON.stringify(headerFieldDetails),
                    BODY_FIELD_DETAILS: JSON.stringify(bodyFieldDetails),
                    BUTTON_FIELD_DETAILS: JSON.stringify(buttonFieldDetails),
                    BUTTON_INFO: JSON.stringify(buttonInfo),
                    FOOTER_TEXT: footerText,
                    HEADER_TEXT: headerText,
                    TYPE: 'Outbound Message'
                }
            });
        }
        if (messageData.MESSAGEACK.GUID.ERROR) {
            console.log('error');
            reqBody[0].values.STATUS = 'Failed';
            reqBody[0].values.ERROR_CODE = messageData.MESSAGEACK.GUID.ERROR.CODE;
            reqBody[0].values.ERROR_REASON = errorObject[messageData.MESSAGEACK.GUID.ERROR.CODE];
        }
    } else {
        const date = new Date().toLocaleString();
        if (messageAction == 'Retry Message') {
            reqBody.push({
                "keys": {
                    "GUID": primaryKey + date
                },
                "values": {
                    ID: primaryKey,
                    SUBMIT_DATE: date,
                    FROM: senderName,
                    TO: mobileNumber,
                    TEXT: selectedTemplate.TEXT,
                    STATUS: 'Failed',
                    ERROR_CODE: messageData.MESSAGEACK.Err.Code,
                    ERROR_REASON: errorObject[messageData.MESSAGEACK.Err.Code],
                    CAMPAIGN_NAME: campaignName,
                    TEMPLATE_NAME: selectedTemplate.TEMPLATE_NAME,
                    TEMPLATE_ID: selectedTemplate.TEMPLATE_ID,
                    MEDIA_TYPE: selectedTemplate.MEDIA_TYPE,
                    DOCUMENT_URL: headerDocURL,
                    HEADER_FIELD_DETAILS: JSON.stringify(headerFieldDetails),
                    BODY_FIELD_DETAILS: JSON.stringify(bodyFieldDetails),
                    BUTTON_FIELD_DETAILS: JSON.stringify(buttonFieldDetails),
                    BUTTON_INFO: selectedTemplate.BUTTON_INFO,
                    FOOTER_TEXT: selectedTemplate.FOOTER_TEXT,
                    HEADER_TEXT: selectedTemplate.HEADER_TEXT,
                    TYPE: 'Outbound Message'
                }
            });
        } else {
            reqBody.push({
                "keys": {
                    "GUID": primaryKey + date
                },
                "values": {
                    ID: primaryKey,
                    SUBMIT_DATE: date,
                    FROM: senderName,
                    TO: mobileNumber,
                    TEXT: templatetext,
                    STATUS: 'Failed',
                    ERROR_CODE: messageData.MESSAGEACK.Err.Code,
                    ERROR_REASON: errorObject[messageData.MESSAGEACK.Err.Code],
                    CAMPAIGN_NAME: campaignName,
                    TEMPLATE_NAME: selectedTemplate.templatename,
                    TEMPLATE_ID: selectedTemplate.templateid,
                    MEDIA_TYPE: selectedTemplate.mediatype,
                    DOCUMENT_URL: headerDocURL,
                    HEADER_FIELD_DETAILS: JSON.stringify(headerFieldDetails),
                    BODY_FIELD_DETAILS: JSON.stringify(bodyFieldDetails),
                    BUTTON_FIELD_DETAILS: JSON.stringify(buttonFieldDetails),
                    BUTTON_INFO: JSON.stringify(buttonInfo),
                    FOOTER_TEXT: footerText,
                    HEADER_TEXT: headerText,
                    TYPE: 'Outbound Message'
                }
            });
        }
    }

    const sfmcTokenResult = await sfmcServiceInstance.getToken(configData);
    let sfmcTokenData = sfmcTokenResult.body.data;
    const sfmcResult = await sfmcServiceInstance.updateReportData(configData, sfmcTokenData.access_token, reqBody, '7FF55D65-8562-409C-B37F-51810ADF3210');
    if (sfmcResult.body) {
        res.status(200).json({ errorCode: reqBody[0].values.ERROR_CODE, GUID: reqBody[0].keys.GUID, status: reqBody[0].values.STATUS });
    }
};

exports.deliveryReport = async function (req, res) {
    console.log('delivery report');
    console.log('WA body ', req.body);
    console.log('WA query ', req.query);

    let resBody = {};

    if (req.query && req.query.CLIENT_GUID) {
        resBody = req.query;
    } else if (req.body) {
        resBody = req.body;
    }
    let reqBody = [];
    reqBody.push({
        "keys": {
            "GUID": resBody.CLIENT_GUID
        },
        "values": {
            "STATUS": errorObject[resBody.REASON_CODE],
            "DELIVERED_DATE": resBody.DELIVERED_DATE
        }
    });

    const configData = await mongodbServiceInstance.getData(req.query.mid);


    const sfmcTokenResult = await sfmcServiceInstance.getToken(configData.body);
    console.log('tokenResult', sfmcTokenResult);
    let data = sfmcTokenResult.body.data;
    const sfmcResult = await sfmcServiceInstance.updateReportData(configData.body, data.access_token, reqBody, '7FF55D65-8562-409C-B37F-51810ADF3210');
    if (sfmcResult.body) {
        return res.status(200).json('success');
    }
};

exports.inboundMessage = async function (req, res) {

    const {
        from,
        text,
        time,
        mediatype,
        contenttype,
        mediadata,
        caption,
        latitude,
        longitude,
        buttonlabel
    } = req.body;

    console.log('inboundmessage', req.query);
    console.log(req.body);
    const date = new Date().getTime();
    let reqBody = [];
    reqBody.push({
        "keys": {
            "GUID": from + ' - ' + date
        },
        "values": {
            "ID": from + ' - ' + date,
            "FROM": from,
            "TEXT": text,
            "TIME": time,
            "MEDIA_TYPE": mediatype,
            "CONTENT_TYPE": contenttype,
            "DOCUMENT_URL": mediadata,
            "LONGITUDE": longitude,
            "LATITUDE": latitude,
            "BUTTON_LABEL": buttonlabel,
            "TYPE": 'Inbound Message',
            "RECEIVED_DATE": time
        }
    });

    const configData = await mongodbServiceInstance.getData(req.query.mid);
    const sfmcTokenResult = await sfmcServiceInstance.getToken(configData.body);
    console.log('tokenResult', sfmcTokenResult);
    let data = sfmcTokenResult.body.data;
    const sfmcResult = await sfmcServiceInstance.updateReportData(configData.body, data.access_token, reqBody, '7FF55D65-8562-409C-B37F-51810ADF3210');
    if (sfmcResult.body) {
        return res.status(200).json('success');
    }
};