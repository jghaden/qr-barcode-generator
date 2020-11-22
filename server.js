const express    = require('express');
const app        = express();
const morgan     = require('morgan');
const bodyParser = require('body-parser');
const router     = express.Router();
const mainRoutes = require('./api')(router);
const path       = require('path');

const PORT       = process.env.PORT || 8080;

///// Middleware
// HTTP request logger for Node.js
app.use(morgan('dev'));
// Setup body parsing to grab data from user input (e.g req.body.data)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));
app.use(express.static(__dirname + '/public'));
// Define API name for the application
// API routes and their configurations are in 'public/routes.js'
app.use('/api', mainRoutes);
/////

// Every page on the website will first load the template index file containing the navbar
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});

// Express and Node will start the server and listen on the port defined above
app.listen(PORT, function(err) {
    if(err) {
        console.log('Cannot start server at http://localhost:' + PORT + '/ =>' + err)
    } else {
        console.log('Running server at http://localhost:' + PORT + '/');
    }
});