const express = require('express');
const router  = express.Router();

const jwt          = require('jsonwebtoken');
const randomString = require('randomstring');

router.get('/generate', function(req, res) {
    if(req.query.username && (req.query.username != undefined || req.query.username != null || req.query.username != '')) {
        var username = req.query.username;

        var secret  = randomString.generate(16);
        var api_key = jwt.sign({ username: username }, secret);

        res.json({
            success: true,
            username: username,
            api_key: api_key,
            api_secret: secret
        });
    } else {
        res.json({
            success: false,
            error: 'Must provide a username'
        });
    }
});

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

router.get('/validate', function(req, res) {
    res.json({
        success: true,
        username: req.decoded.username,
        created: {
            unix: req.decoded.iat,
            formatted: DateFormatted(req.decoded.iat * 1000)
        },
        expires: {
            unix: req.decoded.exp,
            formatted: DateFormatted(req.decoded.exp * 1000)
        }
    });
});

function DateFormatted(date, isUnixTimestamp=false) {
    if(!date) {
        return undefined;
    } else {
        var d = new Date(date),
            minutes = d.getMinutes().toString().length == 1 ? '0'+d.getMinutes() : d.getMinutes(),
            ampm = d.getHours() >= 12 ? 'PM' : 'AM',
            hours = d.getHours(),
            months = ['January','Febuary','March','April','May','June','July','August','September','October','November','December'],
            days = ['Sun','Mon','Tues','Wednes','Thurs','Fri','Satur'];

            if(hours > 12) {
                hours -= 12;
            } else if(hours == 0) {
                hours = 12;
            }

        return days[d.getDay()]+'day '+months[d.getMonth()]+' '+d.getDate()+', '+d.getFullYear()+' '+hours+':'+minutes+' '+ampm;
    }
}

module.exports = router;