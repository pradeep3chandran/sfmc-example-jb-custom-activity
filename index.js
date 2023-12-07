'use strict';

const fs = require('fs');
const path = require('path');
const csv = require("fast-csv");

const options = {
    objectMode: true,
    delimiter: ",",
    quote: null,
    headers: true,
    renameHeaders: false,
};

var midConst;

exports.jsmin = function (req, res) {
    console.log('req: ', req.headers.host);
    console.log('req.body: ', req.body);
    res.sendFile('./js/jquery.min.js', { root: __dirname });
};

exports.reqjs = function (req, res) {
    console.log('req.body: ', req.body);
    res.sendFile('./js/require.js', { root: __dirname });
};

exports.index = function (req, res) {
    console.log('req.body: ', req.body);
    res.sendFile('./js/index.js', { root: __dirname });
};

exports.fileread = function (req, res) {
    console.log('req.bodyfile: ', req.body);
    let data = [];

    fs.createReadStream(path.join(__dirname, '/data/customer_data.csv'))
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => data.push(row))
        .on('end', () => res.json(data));
};

exports.getFileDetail = function (req, res) {
    console.log('req.bodyfile: ', req.body);
    let data = [];

    console.log('midConst: ', midConst);

    fs.createReadStream(path.join(__dirname, '/data/customer_data.csv'))
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => {
            if (midConst == row.MID) { data.push(row) }
        })
        .on('end', () => res.json(data));
};

exports.writefile = function (req, res) {
    console.log('req.bodyfile: 11 ', req.body);
    let row = req.body;

    const csvStream = csv.format({ headers: true });

    csvStream.pipe(fs.createWriteStream(path.join(__dirname, '/data/customer_data.csv')));

    for (let i = 0; i < row.length; i++) {
        csvStream.write(row[i]);
    }

    csvStream.end();

    console.log('csv stream', csvStream);
};

exports.login = function (req, res) {
    console.log("req.body: ", req.query.mid);
    const mid = req.query.mid;
    midConst = mid;

    res.redirect("/");
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