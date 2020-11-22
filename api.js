const jwt          = require('jsonwebtoken');
const randomString = require('randomstring');
const barcode      = require('bwip-js');
const QRCode       = require('qrcode');

module.exports = function(router) {
    router.get('/generate', function(req, res) {
        if(req.query.username && (req.query.username != undefined || req.query.username != null || req.query.username != '')) {
            var username = req.query.username;

            var secret  = randomString.generate(16);
            var api_key = jwt.sign({ username: username }, secret);

            res.json({
                success: true,
                username: username,
                api_key: api_key,
                secret: secret
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
        var secret  = req.query.secret;
        var api_key = req.query.api_key;

        if(api_key) {
            jwt.verify(api_key, secret, function(err, decoded) {
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

    router.get('/barcode', function(req, res) {
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

    router.get('/qrcode', function(req, res) {
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

    router.use(function(req, res, next){
        res.status(404);
        res.redirect('/404');
        next();
    });

    return router;
}

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