const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const js = require('./index');
var http = require('http');

const submodules = [
    require('./modules/sms-activity/app/app'),
    require('./modules/whatsapp-activity/app/app'),
];

const app = express();

//app.use(bodyParser.json());

app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

app.set('port', (process.env.PORT || 8080));
app.use(express.static(path.join(__dirname, 'home')));

app.use('/assets', express.static(path.join(__dirname, '/node_modules/@salesforce-ux/design-system/assets')));

app.get('/jquery.min.js', js.jsmin);
app.get('/require.js', js.reqjs);
app.get('/index.js', js.index);

app.get('/readfile', js.fileread);
app.get('/getFileDetail', js.getFileDetail);
app.post('/writefile', js.writefile);
app.get('/login', js.login);

app.all('/whatsapp-activity/deliveryreport', js.deliveryReport);

submodules.forEach((sm) => sm(app, {
    rootDirectory: __dirname,
}));

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
