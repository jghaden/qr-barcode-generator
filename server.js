const express    = require('express');
const app        = express();
const morgan     = require('morgan');
const path       = require('path');

const PORT       = 8080;

///// Middleware
// HTTP request logger for Node.js
app.use(morgan('dev'));
// Setup body parsing to grab data from user input (e.g req.body.data)
app.use(express.json());
app.use(express.urlencoded({ extended:true }));
app.use(express.static(__dirname + '/public'));
// Define API name for the application
const routesUser = require('./app/routes/user');
const routesBarcode = require('./app/routes/barcode');
const routesQR = require('./app/routes/qr');

app.use('/api/users/', routesUser);
app.use('/api/barcode/', routesBarcode);
app.use('/api/qr/', routesQR);
/////

// URI route for generating barcodes and QR codes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/views/index.html'));
});

// URI route for generating API key and secret
app.get('/users/generate', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/views/generate-api.html'));
});

// All other URIs redirect to a 404 page
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/views/error/404.html'));
});

// Express and Node will start the server and listen on the port defined above
app.listen(PORT, (err) => {
    if(err) {
        console.log(`Cannot start server at http://localhost:${PORT}/ => ${err}`)
    } else {
        console.log(`Running server at http://localhost:${PORT}/`);
    }
});