var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var os = require('os');
var http = require('http');
var https = require('https');
var fs = require('fs');
var crypto = require('crypto');

var routes = require('./routes/index');
var print = require('./routes/print');

var app = express();

// make sure we known our name
if (!fs.existsSync('PRINTERNAME')) {
    console.error('Missing file PRINTERNAME with an identifier for this printer.');
    process.exit(1);
}

var isDev = app.get('env') === 'development';

app.set('PRINTERNAME', fs.readFileSync('PRINTERNAME', {encoding: 'utf8'}).trim().split('\n')[0]);

// generate a random key which is announce to the server
app.set('SECRETKEY', crypto.randomBytes(16).toString('hex'));

// tell the user which IPs we have
var ips = getIps();
if (ips.length == 0) {
    console.error('No IPs are known for this instance!');
    process.exit(1);
}

console.log("Ticketprinter %s running on:", app.get('PRINTERNAME'));
ips.forEach(function (ip) {
    console.log("ip: %s", ip);
});

// announce ourselves to the server
setInterval(announcePrinter, 20000);
setTimeout(announcePrinter, 0);
setTimeout(announcePrinter, 5000);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(multer({
    dest: './uploads/'
}));

app.use('/', routes);
app.use('/print', print);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

function announcePrinter() {
    console.log('announcing ticketprinter', app.get('PRINTERNAME'));

    var data = JSON.stringify({
        name: app.get('PRINTERNAME'),
        ips: getIps(),
        port: app.get('port'),
        key: app.get('SECRETKEY')
    });

    var req = (isDev ? https : http).request({
        host: isDev ? 'billett.uka.athene.foreningenbs.no' : 'blindernuka.no',
        port: isDev ? 443 : 80,
        rejectUnauthorized: false,
        path: '/billett/api/printer/announce',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data, 'utf8')
        }
    });

    req.write(data);
    req.on('error', function (e) {
        console.log("problem with announcing ticketprinter: ", e.message);
    });

    req.end();
}

function getIps() {
    var res = [];

    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function (ifname) {
        ifaces[ifname].forEach(function (iface) {
            if (iface.internal !== false) {
                return;
            }

            res.push(iface.address);
        });
    });

    return res;
}

