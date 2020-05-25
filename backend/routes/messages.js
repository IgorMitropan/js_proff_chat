'use strict';
let Message = require('../models/message').Message;
let HttpError = require('../error').HttpError;

exports.get = function(req, res, next) {
    Message.find(function(err, results) {
        if (err) {
            next(new HttpError(500, "Connection to database failed"));
        }

        let messages = [];

        results.forEach(item => {
            let message = {
                username: item.username,
                message: item.message,
                created: item.created
            };
            messages.push(message);
        });

        messages.sort((first, second) => {
            return (first.created - second.created);
        });

        res.json(messages);
    });
};


