'use strict';

const fs = require('fs');
const path = require('path');
const csv = require("fast-csv");
const { MongoClient, ServerApiVersion } = require('mongodb');

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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    //await client.db("testdb").command({ ping: 1 });
    //const insertManyResult = await collection.insertMany(recipes);
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

    /*console.log('req.bodyfile: ', req.body);
    let data = [];

    console.log('midConst: ', midConst);

    fs.createReadStream(path.join(__dirname, '/data/customer_data.csv'))
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', row => {
            if (midConst == row.MID) { data.push(row) }
        })
        .on('end', () => res.json(data));*/
};

exports.writefile = function (req, res) {

    console.log('req.bodyfile: 11 ', req.body);
    const database = client.db("testdb");
    const collection = database.collection("MCData");

    const insertManyResult = collection.insertMany(req.body);

    /*console.log('req.bodyfile: 11 ', req.body);
    let row = req.body;

    const csvStream = csv.format({ headers: true });

    csvStream.pipe(fs.createWriteStream(path.join(__dirname, '/data/customer_data.csv')));

    for (let i = 0; i < row.length; i++) {
        csvStream.write(row[i]);
    }

    csvStream.end();

    console.log('csv stream', csvStream);*/
};

exports.login = function (req, res) {
    console.log("req.body: ", req.query.mid);
    const mid = req.query.mid;
    midConst = mid;

    res.redirect("/");
};

exports.deliveryReport = function (req, res) {
    console.log('delivery report');
    console.log('body ', req.body);
    console.log('query ', req.query);

    let resBody = {};

    if (req.query && req.query.CLIENT_GUID) {
        resBody = req.query;
    } else if (req.body) {
        resBody = req.body;
    }

    console.log('resBody ', resBody);

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