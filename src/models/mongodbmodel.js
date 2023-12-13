const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const dataSchema = new Schema({
    MID: String,
    Client_ID: String,
    Client_Secret: String,
    Auth_URI: String,
    Rest_URI: String,
    Username: String,
    Password: String,
    WhatsApp_Username: String,
    WhatsApp_Password: String
});

const MCData = model('MCData', dataSchema);
module.exports = MCData;