'use strict';

const fs = require('fs');
const path = require('path');
const csv = require("fast-csv");
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://pradeep3chandran:Connect%231@testdb.fobjt51.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    console.log('Starting');
    await client.connect();
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}

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
    run().then(() => {

        const database = client.db("testdb");
        const collection = database.collection("MCData");

        console.log('midConst ', midConst);

        const findQuery = { MID: midConst };
        const cursor = collection.find(findQuery);
        console.log('cursor ');
        cursor.forEach(recipe => {
            console.log(`${recipe.MID}`);
            res.json(recipe);
        });
    });
};

exports.writefile = function (req, res) {

    console.log('req.bodyfile: 11 ', req.body);
    const database = client.db("testdb");
    const collection = database.collection("MCData");

    let extData = [];
    console.log('req.body.MID: ', req.body.MID);
    const findQuery = { MID: req.body.MID };
    const cursor = collection.find(findQuery);
    console.log('cursor ', cursor);
    cursor.forEach(recipe => {
        console.log(`${recipe.MID}`);
        extData.push(recipe);
    }).then(() => {
        console.log('extData ', extData);
        console.log('extData len ', extData.length);
        if (extData.length > 0) {
            var newvalues = { $set: req.body };
            collection.updateOne(
                findQuery,
                newvalues,
                function (err, res) {
                    if (err) throw err;
                    console.log("1 document updated", res);
                });
        } else {
            collection.insertMany(req.body);
        }
    });
};

exports.login = function (req, res) {
    console.log("req.body: ", req.query.mid);
    const mid = req.query.mid;
    midConst = mid;

    res.redirect("/");
};