'use strict';
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const http = require('http');

const config = require('./backend/config');
let log = require('./backend/lib/log')(module);
let HttpError = require('./backend/error').HttpError;
let routes = require('./backend/routes/index');

let app = express();

// view engine setup
app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'backend/templates'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));

if (app.get('env') === 'development') {
    app.use(logger('dev'));
} else {
    app.use(logger('default'));
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

let sessionStore = require('./backend/lib/sessionStore');
app.use(session({
    cookie: config.get('session:cookie'),
    key: config.get('session:key'),
    resave: config.get('session:resave'),
    saveUninitialized: config.get('session:saveUninitialized'),
    secret: config.get('session:secret'),
    store: sessionStore
}));

app.use(require('./backend/middleware/sendHttpError'));
app.use(require('./backend/middleware/loadUser'));

app.use('/', routes);

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(new HttpError(404, 'Content not found') );
});

// error handler
app.use(function(err, req, res, next) {
    if (typeof err === 'number') { // example: next(404);
        err = new HttpError(err);
    }

    if (err instanceof HttpError) {
        res.sendHttpError(err);
    } else {
        log.error(err);
        err = new HttpError(500);
        res.sendHttpError(err);
    }
});

let server = http.createServer(app);
server.listen(config.get('port'), config.get('IP'), function(){
    log.info('Express server listening on port ' + config.get('port') + ' IP ' + config.get('IP'));
});

let io = require('./backend/socket')(server);
app.set('io', io);

module.exports = app;
