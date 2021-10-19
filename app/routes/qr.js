const express = require('express');
const router  = express.Router();

const jwt          = require('jsonwebtoken');
const QRCode       = require('qrcode');

// Middleware for token
router.use(function(req, res, next) {
    var api_secret  = req.query.api_secret;
    var api_key = req.query.api_key;

    if(api_key) {
        jwt.verify(api_key, api_secret, function(err, decoded) {
            if (err) {
                res.json({
                    success: false,
                    message: 'Invalid API key or secret'
                });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        res.json({
            success: false,
            message: 'Missing API Key'
        });
    }
});

router.get('/generate', function(req, res) {
    if(req.query.data) {
        QRCode.toDataURL(req.query.data, {}, function(err, url) {
            if(err) {
                res.json({
                    success: false,
                    error: 'Invalid data'
                });
            } else {
                res.send('<img src="' + url + '" />');
            }
        });
    } else {
        res.json({
            success: false,
            error: 'Missing data'
        });
    }
});

module.exports = router;