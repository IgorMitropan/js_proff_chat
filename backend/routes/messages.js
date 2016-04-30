'use strict';
let Message = require('../models/message').Message;
let HttpError = require('../error').HttpError;

exports.get = function(req, res, next) {
    Message.find(function(err, results) {
        if (err) {
            next(new HttpError(500, "Connection to database failed"));
        }

        res.json(results);
    });
};


