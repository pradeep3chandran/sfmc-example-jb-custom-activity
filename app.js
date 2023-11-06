const express = require('express');
const path = require('path');
const bodyParser = require('body-parser')

const submodules = [
    require('./modules/discount-code/app/app'),
    require('./modules/discount-redemption-split/app/app'),
    require('./modules/sms-activity/app/app'),
];

const app = express();

// parse application/json
app.use(bodyParser.json())

app.set('port', (process.env.PORT || 8080));
app.use('/', express.static(path.join(__dirname, 'home')));
app.use('/assets', express.static(path.join(__dirname, '/node_modules/@salesforce-ux/design-system/assets')));


app.get('/js/jquery.min.js', function (req, res) {
    // Journey Builder looks for config.json when the canvas loads.
    // We'll dynamically generate the config object with a function
    return res.sendFile(`${options.rootDirectory}/js/jquery.min.js`);
});

app.get('/js/index.js', function (req, res) {
    // Journey Builder looks for config.json when the canvas loads.
    // We'll dynamically generate the config object with a function
    return res.sendFile(`${options.rootDirectory}/js/index.js`);
});

app.get('/js/require.js', function (req, res) {
    // Journey Builder looks for config.json when the canvas loads.
    // We'll dynamically generate the config object with a function
    return res.sendFile(`${options.rootDirectory}/js/require.js`);
});

submodules.forEach((sm) => sm(app, {
    rootDirectory: __dirname,
}));

app.listen(app.get('port'), function () {
    console.log(`Express is running at localhost: ${app.get('port')}`);
});
