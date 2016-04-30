'use strict';
const async = require('async');
const cookie = require('cookie');
const cookieParser = require('cookie-parser');
const config = require('../config');

let sessionStore = require('../lib/sessionStore');
let log = require('../lib/log')(module);
let HttpError = require('../error').HttpError;
let User = require('../models/user').User;


module.exports = function(socket, next) {
    let handshakeData = socket.handshake;

    async.waterfall([
        function(callback) {
            handshakeData.cookies = cookie.parse(handshakeData.headers.cookie || '');
            let sidCookie = handshakeData.cookies[config.get('session:key')];
            let sid = cookieParser.signedCookie(sidCookie, config.get('session:secret'));
            loadSession(sid, callback);
        },

        function(session, callback) {
            if (!session) {
                callback(new HttpError(401, "No session"));
            }

            handshakeData.session = session;

            loadUser(session, callback);
        },

        function(user, callback) {
            if (user) {
                handshakeData.user = user;
            }
            callback(null);
        }

    ], function(err) {
        if (err) {
            return next(err);
        } else {
            return next();
        }
    });
};

function loadSession(sid, callback) {
    // sessionStore callback is not quite async-style!
    sessionStore.load(sid, function(err, session) {
        if (arguments.length === 0) {
            // no arguments => no session
            return callback(null, null);
        } else {
            return callback(null, session);
        }
    });

}

function loadUser(session, callback) {

    if (!session.user) {
        log.debug("Session %s is anonymous", session.id);
        return callback(null, null);
    }

    //log.debug("retrieving user ", session.user);

    User.findById(session.user, function(err, user) {
        if (err) return callback(err);

        if (!user) {
            return callback(null, null);
        }
        log.debug("user found by Id: " + user);
        callback(null, user);
    });

}