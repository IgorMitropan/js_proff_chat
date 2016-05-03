'use strict';
let User = require('../models/user').User;
let HttpError = require('../error').HttpError;
let AuthError = require('../models/user').AuthError;

exports.post = function(req, res, next) {
    let username = req.body.username;
    let password = req.body.password;
    let io = req.app.get('io');

    if (username && password) {
        User.authorize(username, password, function (err, user) {
            if (err) {
                if (err instanceof AuthError) {
                    return next(new HttpError(403, err.message));
                } else {
                    return next(new HttpError(500, "Connection to database failed"));
                }
            }

            req.session.user = user._id;
            io.sessionReload(req.session.id);

            res.json({});
        });
    } else {
        next(400);
    }

};
