'use strict';

exports.execute = function (req, res) {
    console.log('debug: /modules/sms-activity/execute');



    const request = req.body;
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

            "@URL": "https://ct.vfplugin.com/dlr-webhook/sms/63049bd05e0d6714598ade18?TO=%p&MSG_STATUS=%16&CLIENT_GUID=%5&STATUS_ERROR=%4&DELIVERED_DATE=%3&TEXT_STATUS=%13&MESSAGE_ID=%7&TAG=%TAG&CLIENT_SEQ_NUMBER=%6&REASON_CODE=%2"

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

    console.log('usrq1 ', Buffer.from('demosfdc:f{(|p@nE4~').toString('base64'));

    console.log('jsonStr: ', JSON.stringify(jsonStr));


    /*const response = await fetch('https://api.myvfirst.com/psms/api/messages/token?action=generate', {
        method: 'POST', headers: { "Authorization": 'Basic ' + Buffer.from('demosfdc:f{(|p@nE4~').toString('base64') }
    });

    console.log(response);
    const data = await response.json();
    console.log(data);
    return res.status(200).json(data);*/

    fetch('https://api.myvfirst.com/psms/api/messages/token?action=generate', {
        method: 'POST', headers: { "Authorization": 'Basic ' + Buffer.from('demosfdc:f{(|p@nE4~').toString('base64') }
    }).then(response => {
        return res.status(200).json(response);
        /*console.log(response);

        response.json().then(data => {

            console.log('data ', data.token);
            //return res.status(200).json(data);
            let token = data.token;


            fetch('https://api.myvfirst.com/psms/servlet/psms.JsonEservice', {
                method: 'POST', headers: { "Authorization": 'Bearer ' + token, "Content-Type": 'application/json' }, body: JSON.stringify(jsonStr)
            }).then(response1 => {
                console.log(response1);

                response1.json().then(data1 => {
                    return res.status(200).json(data1);
                })
            }).catch(err => {
                return res.status(400).json(err);
            });
        })*/
    }).catch(err => {
        return res.status(400).json(err);
    });
};