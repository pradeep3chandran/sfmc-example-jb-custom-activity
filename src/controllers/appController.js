'use strict';

const mongodbService = require('../services/mongodbService');
const mongodbServiceInstance = new mongodbService();
var path = require('path');

exports.jsmin = function (req, res) {
    res.sendFile(path.resolve('src/js/jquery.min.js'));
};

exports.reqjs = function (req, res) {
    res.sendFile(path.resolve('node_modules/requirejs/bin/r.js'));
};

exports.index = function (req, res) {
    res.sendFile(path.resolve('src/js/index.js'));
};

exports.axiosjs = function (req, res) {
    res.sendFile(path.resolve('node_modules/axios/lib/axios.js'));
};

exports.getConfigData = async function (req, res) {
    const configData = await mongodbServiceInstance.getData(req.query.mid);
    res.json(configData.body);
};

exports.updateConfigData = async function (req, res) {

    const result = await mongodbServiceInstance.updateData(req.body);
    res.json(result);
};

exports.login = function (req, res) {
    res.redirect("/?mid=" + req.query.mid);
};