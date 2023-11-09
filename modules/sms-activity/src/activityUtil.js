'use strict';

exports.logExecuteData = [];

exports.logData = function (req) {
    exports.logExecuteData.push({
        body: req.body,
        headers: req.headers,
        trailers: req.trailers,
        method: req.method,
        url: req.url,
        params: req.params,
        query: req.query,
        route: req.route,
        cookies: req.cookies,
        ip: req.ip,
        path: req.path,
        host: req.host,
        fresh: req.fresh,
        stale: req.stale,
        protocol: req.protocol,
        secure: req.secure,
        originalUrl: req.originalUrl
    });

    exports.updateData = function (req, res) {
        console.log('updateData', req);

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
                console.log(req);
                fetch('https://mcv3d4v2fm7d1rqg9-fkxts8swqq.rest.marketingcloudapis.com/hub/v1/dataevents/key:CA054127-E2A5-494F-83EF-230B180A0F8E/rowset', {
                    method: 'POST', body: JSON.stringify(req), headers: { 'Authorization': 'Bearer ' + data.access_token, 'Content-Type': 'application/json' }
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
    }
};
