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
    console.log("req.body: ", req.body);
    res.redirect("/" + JSON.stringify(req.body));
};