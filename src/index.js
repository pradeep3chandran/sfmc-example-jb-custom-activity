var app = require('./app');
var path = require('path');
const mongoose = require('mongoose');
const dotenv = require("dotenv")

dotenv.config({ path: path.join(__dirname, `../config/${process.env.NODE_ENV}.env`) })

let server;
mongoose.connect(process.env.MONGO_URL).then(() => {
    server = app.listen(process.env.PORT, function () {
        console.log('Express server listening on port ' + process.env.PORT + ' ENV ' + process.env.NODE_ENV);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            process.exit(1)
        })
    } else {
        process.exit(1)
    }
}

const unexpectedErrorHandler = (error) => {
    exitHandler()
}
process.on("uncaughtException", unexpectedErrorHandler)
process.on("unhandledRejection", unexpectedErrorHandler)