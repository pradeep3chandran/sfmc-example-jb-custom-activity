var app = require('./app');
var path = require('path');
const mongoose = require('mongoose');
const dotenv = require("dotenv")

dotenv.config({ path: path.join(__dirname, `../config/${process.env.NODE_ENV}.env`) })


let server;
mongoose.connect('mongodb+srv://pradeep3chandran:Connect%231@testdb.fobjt51.mongodb.net/testdb?retryWrites=true&w=majority').then(() => {
    console.log("Connected to MongoDB")
    server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port') + ' ENV ' + process.env.NODE_ENV);
    });
});

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("Server closed")
            process.exit(1)
        })
    } else {
        process.exit(1)
    }
}

const unexpectedErrorHandler = (error) => {
    console.error(error)
    exitHandler()
}
process.on("uncaughtException", unexpectedErrorHandler)
process.on("unhandledRejection", unexpectedErrorHandler)

/*http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});*/