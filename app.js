const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const js = require('./index');

const submodules = [
    require('./modules/sms-activity/app/app'),
];

const app = express();

// parse application/json
app.use(bodyParser.json())

app.set('port', (process.env.PORT || 8080));
app.use(express.static(path.join(__dirname, 'home')));

app.use('/assets', express.static(path.join(__dirname, '/node_modules/@salesforce-ux/design-system/assets')));

app.get('/jquery.min.js', js.jsmin);
app.get('/require.js', js.reqjs);
app.get('/index.js', js.index);

app.get('/readfile', js.fileread);
app.post('/writefile', js.writefile);
app.get('/login', js.login);

submodules.forEach((sm) => sm(app, {
    rootDirectory: __dirname,
}));



app.listen(app.get('port'), function () {
    console.log(`Express is running at localhost: ${app.get('port')}`);
});
