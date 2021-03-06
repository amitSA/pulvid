﻿var express = require('express');
var path = require('path');
var logger = require('morgan'); //SEE WHAT HAPPENS WHEN I REMOVE THE LOGGER
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');

var routes = require('./routes/index.js');
var users = require('./routes/oldcode/users.js');
var app = express();

app.set('port', process.env.PORT || 3000);

// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/webcast/', routes);
app.use('/users/', users);





// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 403;
    next(err);
});

if (app.get("env") === "development") {
    app.use(function (err, req, res, next) {
        res.status(err.status || 402);
        res.send("Error, this route was not found hijoOOOOOo");
    });
}

var portNum = 3000;

/*app.listen(portNum, function (err) {
    if (err) {
        console.log('Error HIJOO for listening on port ' + portNum +"!");
    }
    console.log('Example app listening on port ' + portNum + "!");

});*/

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});



module.exports = app;
