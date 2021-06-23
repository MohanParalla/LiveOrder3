// app.js

var express = require('express');
var bodyParser = require('body-parser');
// var cors = require('cors')

var itemsearch = require('./routes/itemsearch'); // Imports routes for the attender
var app = express();

// app.use(cors())
// Set up mongoose connection
var mongoose = require('mongoose');
var dev_db_url = 'mongodb://127.0.0.1:27017/csquare_pharma_db';
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB,{ useNewUrlParser: true,useCreateIndex: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(bodyParser.json({limit: '150mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '150mb', extended: true}));

app.use('/api/v1/itemsearch', itemsearch);

var port = 3004;

app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
