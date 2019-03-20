const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require('body-parser');
const assert = require('assert');
const app = express();
const PORT = 3000;
const mongoURI = "mongodb://url-shortener_db:27017/shorturls";
require('./models/ShortUrl');
require('./models/analytics');
const connectOptions = {
    keepAlive: true,
    reconnectTries: Number.MAX_VALUE,
    useNewUrlParser: true
};
mongoose.Promise = global.Promise;
mongoose.connect(mongoURI, connectOptions, (err, db) => {
    if (err) {
        console.log(`ERROR`, err)
    } else {
        console.log(`Connected to MongoDB`);
    }
});


app.use(bodyParser.json());
require('./routes/short-url')(app);

app.listen(PORT, () => {
    console.log(`Server started on port`, PORT);
});

app.get('/healthcheck', (req, res) => {
    return res.status(200).send({
        'message': 'Healthy!'
    });
});