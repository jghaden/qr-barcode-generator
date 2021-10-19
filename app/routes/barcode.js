const express = require('express');
const router  = express.Router();

const jwt          = require('jsonwebtoken');
const barcode      = require('bwip-js');

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
        var config = {
            bcid:        'code128',       // Barcode type
            scale:       2,               // 3x scaling factor
            height:      10,              // Bar height, in millimeters
            label:       true,            // Show human-readable text
            align:       'center'
        }

        config.scale  = (req.query.scale) ? req.query.scale : config.scale;
        config.height = (req.query.height) ? req.query.height : config.height;
        config.label  = (req.query.label == 0) ? false : true;
        config.align  = (req.query.align) ? req.query.align : config.align;

        barcode.toBuffer({
            bcid:        config.bcid,
            text:        req.query.data,
            scale:       config.scale,
            height:      config.height,
            includetext: config.label,
            textxalign:  config.align
        }, function (err, buffer) {
            if (err) {
                res.json({
                    success: false,
                    error: 'Barcode could not be generated'
                });
            } else {
                let url = 'data:image/png;base64,' + buffer.toString("base64")
                
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