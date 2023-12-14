const express = require('express');
const path = require('path');

const js = require('./controllers/appController');


const submodules = [
    require('./modules/sms-activity/app/app'),
    require('./modules/whatsapp-activity/app/app'),
];

const app = express();

//app.use(bodyParser.json());

app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'home')));

app.use('/assets', express.static(path.join(__dirname, '../node_modules/@salesforce-ux/design-system/assets')));

app.get('/jquery.min.js', js.jsmin);
app.get('/require.js', js.reqjs);
app.get('/index.js', js.index);
app.get('/axios.js', js.axiosjs);

app.get('/getConfigData', js.getConfigData);
app.post('/updateConfigData', js.updateConfigData);
app.get('/login', js.login);

submodules.forEach((sm) => sm(app, {
    rootDirectory: __dirname,
}));

module.exports = app;
