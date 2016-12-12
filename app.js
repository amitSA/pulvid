var express = require('express');
var path = require('path');
var logger = require('morgan'); //SEE WHAT HAPPENS WHEN I REMOVE THE LOGGER
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 403;
    next(err);
});

if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        //res.status(403); error status on header has allready been set by the above middleware function
        res.send("Error, hiJOO this route is not authORIizizejbefOUDNERIORORROHACKKKEDDHAXCKEDD THIS HAS SERVER HAS DHEHE SECURITY HAS BEEN DECRYPTED<EHE oncTENT INFORMATION BEING RETRIVED");                
    });
}







module.exports = app;
