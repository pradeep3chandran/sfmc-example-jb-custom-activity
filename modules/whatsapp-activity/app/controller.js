'use strict';

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

exports.deliveryReport = function (req, res) {
    console.log('deliveryReport controller');
    console.log('req.body: ', req.query);
    console.log('delivery report');
    console.log(req);
    console.log('body ', req.body);
    console.log('query ', req.query);

    let reqBody = [];
    reqBody.push({
        "keys": {
            "GUID": req.query.CLIENT_GUID
        },
        "values": {
            "STATUS": errorObject[req.query.REASON_CODE],
            "DELIVERED_DATE": req.query.DELIVERED_DATE
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
            fetch('https://mcv3d4v2fm7d1rqg9-fkxts8swqq.rest.marketingcloudapis.com/hub/v1/dataevents/key:7FF55D65-8562-409C-B37F-51810ADF3210/rowset', {
                method: 'POST', body: JSON.stringify(reqBody), headers: { 'Authorization': 'Bearer ' + data.access_token, 'Content-Type': 'application/json' }
            }).then(response1 => {

                response1.json().then(data1 => {
                    console.log(data1);

                    return res.status(200).json('success');
                })
            }).catch(err1 => {
                return res.status(400).json(err1);
            });
            //return res.status(200).json(data1);
        })
    }).catch(err => {
        return res.status(400).json(err);
    });
};